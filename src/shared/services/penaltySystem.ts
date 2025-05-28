import {
  rentalApplicationService,
  userService,
  penaltyRecordService,
  rentalItemService,
  FirestoreRentalApplication,
  FirestoreUser,
  FirestoreRentalItem,
  PenaltyType,
} from "./firestore";
import { discordService } from "./discordService";

// 벌점 규칙 정의
const PENALTY_RULES = {
  OVERDUE_DAILY: 1, // 연체 1일당 1점
  DAMAGE_MINOR: 5, // 경미한 손상
  DAMAGE_MAJOR: 15, // 심각한 손상
  LOSS: 30, // 분실
  RETURN_DELAY: 2, // 반납 지연 (승인 후 미수령)
  MULTIPLE_OVERDUE: 5, // 다중 연체 (동시에 여러 물품 연체)
};

// 제재 기준
const PENALTY_THRESHOLDS = {
  WARNING: 10, // 경고
  SUSPENSION_1: 20, // 1개월 이용 정지
  SUSPENSION_3: 30, // 3개월 이용 정지
  PERMANENT_BAN: 50, // 영구 이용 정지
};

interface OverdueItem {
  application: FirestoreRentalApplication;
  user: FirestoreUser;
  item: FirestoreRentalItem;
  overdueDays: number;
  penaltyPoints: number;
}

interface PenaltyProcessResult {
  totalProcessed: number;
  newOverdueItems: OverdueItem[];
  penaltiesApplied: {
    userId: string;
    points: number;
    reason: string;
  }[];
  notificationsSent: number;
  errors: string[];
}

class PenaltySystem {
  // 모든 연체 항목 확인 및 처리
  async processOverdueItems(): Promise<PenaltyProcessResult> {
    const result: PenaltyProcessResult = {
      totalProcessed: 0,
      newOverdueItems: [],
      penaltiesApplied: [],
      notificationsSent: 0,
      errors: [],
    };

    try {
      // 현재 대여 중인 모든 항목 조회
      const activeRentals = await rentalApplicationService.getActiveRentals();
      const today = new Date();

      for (const rental of activeRentals) {
        try {
          result.totalProcessed++;

          // 연체 여부 확인
          const dueDate = new Date(rental.dueDate);
          const timeDiff = today.getTime() - dueDate.getTime();
          const overdueDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

          if (overdueDays > 0 && rental.status === "rented") {
            // 사용자 및 물품 정보 조회
            const user = await userService.getByUid(rental.userId);
            const item = await rentalItemService.getById(rental.itemId);

            if (!user || !item) {
              result.errors.push(
                `사용자 또는 물품 정보를 찾을 수 없음: ${rental.id}`
              );
              continue;
            }

            // 기존 연체 기록 확인
            const existingOverdue = rental.overdueDays || 0;

            // 새로운 연체이거나 연체일이 증가한 경우
            if (overdueDays > existingOverdue) {
              // 상태를 overdue로 변경
              await rentalApplicationService.updateStatus(
                rental.id!,
                "overdue",
                {
                  overdueDays,
                  lastOverdueCheck: today,
                }
              );

              // 증가한 연체일에 대한 벌점만 부과
              const additionalDays = overdueDays - existingOverdue;
              const additionalPenalty =
                additionalDays * PENALTY_RULES.OVERDUE_DAILY;

              if (additionalPenalty > 0) {
                // 벌점 부과
                await this.applyPenalty(
                  user.uid,
                  additionalPenalty,
                  "OVERDUE",
                  `${item.name} ${additionalDays}일 추가 연체`
                );

                result.penaltiesApplied.push({
                  userId: user.uid,
                  points: additionalPenalty,
                  reason: `${item.name} ${additionalDays}일 추가 연체`,
                });

                // Discord 알림 전송
                try {
                  await discordService.notifyOverdue({
                    studentName: user.name,
                    studentId: user.studentId,
                    itemName: item.name,
                    dueDate: rental.dueDate,
                    overdueDays,
                    phoneNumber: rental.phoneNumber || "연락처 없음",
                    rentalId: rental.id || "알 수 없음",
                  });
                  result.notificationsSent++;
                } catch {
                  result.errors.push(`Discord 알림 전송 실패: ${user.name}`);
                }
              }

              result.newOverdueItems.push({
                application: rental,
                user,
                item,
                overdueDays,
                penaltyPoints: additionalPenalty,
              });
            }
          }
        } catch (error) {
          result.errors.push(`대여 항목 처리 오류 (${rental.id}): ${error}`);
        }
      }

      // 다중 연체 확인 및 추가 벌점 부과
      await this.checkMultipleOverdue(result);
    } catch (error) {
      result.errors.push(`전체 처리 오류: ${error}`);
    }

    return result;
  }

  // 연체 벌점 계산
  private calculateOverduePenalty(overdueDays: number): number {
    return overdueDays * PENALTY_RULES.OVERDUE_DAILY;
  }

  // 벌점 부과
  async applyPenalty(
    userId: string,
    points: number,
    type: PenaltyType,
    reason: string
  ): Promise<void> {
    try {
      // 벌점 기록 추가
      await penaltyRecordService.add({
        userId,
        points,
        type,
        reason,
        appliedBy: "system",
        status: "active",
      });

      // 사용자 총 벌점 업데이트
      const user = await userService.getByUid(userId);
      if (user) {
        const newTotalPoints = (user.penaltyPoints || 0) + points;
        await userService.update(userId, {
          penaltyPoints: newTotalPoints,
        });

        // 제재 조치 확인 및 적용
        await this.checkAndApplySanctions(userId, newTotalPoints);
      }
    } catch (error) {
      console.error(`벌점 부과 오류 (${userId}):`, error);
      throw error;
    }
  }

  // 제재 조치 확인 및 적용
  private async checkAndApplySanctions(
    userId: string,
    totalPoints: number
  ): Promise<void> {
    try {
      const user = await userService.getByUid(userId);
      if (!user) return;

      let sanctionType = "";
      let sanctionEndDate = null;

      if (totalPoints >= PENALTY_THRESHOLDS.PERMANENT_BAN) {
        sanctionType = "permanent_ban";
        // 영구 정지는 종료일 없음
      } else if (totalPoints >= PENALTY_THRESHOLDS.SUSPENSION_3) {
        sanctionType = "suspension_3_months";
        sanctionEndDate = new Date();
        sanctionEndDate.setMonth(sanctionEndDate.getMonth() + 3);
      } else if (totalPoints >= PENALTY_THRESHOLDS.SUSPENSION_1) {
        sanctionType = "suspension_1_month";
        sanctionEndDate = new Date();
        sanctionEndDate.setMonth(sanctionEndDate.getMonth() + 1);
      } else if (totalPoints >= PENALTY_THRESHOLDS.WARNING) {
        sanctionType = "warning";
      }

      if (sanctionType) {
        // 사용자 제재 상태 업데이트
        await userService.update(userId, {
          sanctionType,
          sanctionEndDate: sanctionEndDate?.toISOString(),
          sanctionAppliedAt: new Date().toISOString(),
        });

        // Discord 알림 (제재 통보)
        try {
          await discordService.notifySystemError({
            errorType: "사용자 제재",
            errorMessage: `${user.name}(${user.studentId})님에게 제재가 적용되었습니다.`,
            additionalInfo: `제재 종류: ${sanctionType}, 벌점: ${totalPoints}점`,
          });
        } catch {
          console.error("제재 알림 전송 실패");
        }
      }
    } catch (error) {
      console.error("제재 조치 적용 오류:", error);
    }
  }

  // 다중 연체 확인
  private async checkMultipleOverdue(
    result: PenaltyProcessResult
  ): Promise<void> {
    try {
      // 사용자별 연체 물품 수 집계
      const userOverdueCounts: { [userId: string]: number } = {};

      for (const overdueItem of result.newOverdueItems) {
        const userId = overdueItem.user.uid;
        userOverdueCounts[userId] = (userOverdueCounts[userId] || 0) + 1;
      }

      // 다중 연체 벌점 부과
      for (const [userId, count] of Object.entries(userOverdueCounts)) {
        if (count > 1) {
          const additionalPenalty = PENALTY_RULES.MULTIPLE_OVERDUE;
          await this.applyPenalty(
            userId,
            additionalPenalty,
            "MULTIPLE_OVERDUE",
            `동시 ${count}개 물품 연체`
          );

          result.penaltiesApplied.push({
            userId,
            points: additionalPenalty,
            reason: `동시 ${count}개 물품 연체`,
          });
        }
      }
    } catch (error) {
      result.errors.push(`다중 연체 확인 오류: ${error}`);
    }
  }

  // 물품 손상/분실 벌점 부과
  async applyDamagePenalty(
    userId: string,
    damageType: "minor" | "major" | "loss",
    itemName: string,
    description: string
  ): Promise<void> {
    const penaltyPoints =
      damageType === "loss"
        ? PENALTY_RULES.LOSS
        : damageType === "major"
        ? PENALTY_RULES.DAMAGE_MAJOR
        : PENALTY_RULES.DAMAGE_MINOR;

    const penaltyType =
      damageType === "loss"
        ? "LOSS"
        : damageType === "major"
        ? "DAMAGE_MAJOR"
        : "DAMAGE_MINOR";

    await this.applyPenalty(
      userId,
      penaltyPoints,
      penaltyType as PenaltyType,
      `${itemName} ${description}`
    );
  }

  // 반납 지연 벌점 부과
  async applyReturnDelayPenalty(
    userId: string,
    itemName: string,
    delayDays: number
  ): Promise<void> {
    const penaltyPoints = delayDays * PENALTY_RULES.RETURN_DELAY;

    await this.applyPenalty(
      userId,
      penaltyPoints,
      "RETURN_DELAY",
      `${itemName} ${delayDays}일 수령 지연`
    );
  }

  // 벌점 감면 (관리자용)
  async reducePenalty(
    userId: string,
    points: number,
    reason: string,
    adminId: string
  ): Promise<void> {
    try {
      // 감면 기록 추가
      await penaltyRecordService.add({
        userId,
        points: -points, // 음수로 기록
        type: "REDUCTION",
        reason,
        appliedBy: adminId,
        status: "active",
      });

      // 사용자 총 벌점 감소
      const user = await userService.getByUid(userId);
      if (user) {
        const newTotalPoints = Math.max(0, (user.penaltyPoints || 0) - points);
        await userService.update(userId, {
          penaltyPoints: newTotalPoints,
        });

        // 제재 해제 확인
        if (newTotalPoints < PENALTY_THRESHOLDS.WARNING) {
          await userService.update(userId, {
            sanctionType: null,
            sanctionEndDate: null,
            sanctionAppliedAt: null,
          });
        }
      }
    } catch (error) {
      console.error(`벌점 감면 오류 (${userId}):`, error);
      throw error;
    }
  }

  // 사용자 이용 가능 여부 확인
  async checkUserEligibility(userId: string): Promise<{
    eligible: boolean;
    reason?: string;
    sanctionEndDate?: string;
  }> {
    try {
      const user = await userService.getByUid(userId);
      if (!user) {
        return { eligible: false, reason: "사용자 정보를 찾을 수 없습니다." };
      }

      // 제재 상태 확인
      if (user.sanctionType) {
        if (user.sanctionType === "permanent_ban") {
          return {
            eligible: false,
            reason: "영구 이용 정지 상태입니다. 학생회에 문의하세요.",
          };
        }

        if (user.sanctionEndDate) {
          const sanctionEnd = new Date(user.sanctionEndDate);
          const now = new Date();

          if (now < sanctionEnd) {
            return {
              eligible: false,
              reason: `이용 정지 중입니다. (해제일: ${sanctionEnd.toLocaleDateString()})`,
              sanctionEndDate: user.sanctionEndDate,
            };
          } else {
            // 제재 기간이 끝났으면 제재 해제
            await userService.update(userId, {
              sanctionType: null,
              sanctionEndDate: null,
              sanctionAppliedAt: null,
            });
          }
        }
      }

      // 현재 연체 중인 물품 확인
      const overdueRentals =
        await rentalApplicationService.getUserOverdueRentals(userId);
      if (overdueRentals.length > 0) {
        return {
          eligible: false,
          reason: `연체 중인 물품이 ${overdueRentals.length}개 있습니다. 먼저 반납해주세요.`,
        };
      }

      return { eligible: true };
    } catch (error) {
      console.error("사용자 이용 가능성 확인 오류:", error);
      return { eligible: false, reason: "시스템 오류가 발생했습니다." };
    }
  }

  // 벌점 통계 조회
  async getPenaltyStatistics(): Promise<{
    totalUsers: number;
    usersWithPenalties: number;
    averagePenaltyPoints: number;
    sanctionCounts: {
      warning: number;
      suspension1: number;
      suspension3: number;
      permanentBan: number;
    };
    overdueItemsCount: number;
  }> {
    try {
      const allUsers = await userService.getAllUsers();
      const overdueRentals = await rentalApplicationService.getOverdueRentals();

      const totalUsers = allUsers.length;
      const usersWithPenalties = allUsers.filter(
        (user) => (user.penaltyPoints || 0) > 0
      ).length;
      const totalPenaltyPoints = allUsers.reduce(
        (sum, user) => sum + (user.penaltyPoints || 0),
        0
      );
      const averagePenaltyPoints =
        usersWithPenalties > 0 ? totalPenaltyPoints / usersWithPenalties : 0;

      const sanctionCounts = {
        warning: allUsers.filter(
          (user) =>
            (user.penaltyPoints || 0) >= PENALTY_THRESHOLDS.WARNING &&
            (user.penaltyPoints || 0) < PENALTY_THRESHOLDS.SUSPENSION_1
        ).length,
        suspension1: allUsers.filter(
          (user) =>
            (user.penaltyPoints || 0) >= PENALTY_THRESHOLDS.SUSPENSION_1 &&
            (user.penaltyPoints || 0) < PENALTY_THRESHOLDS.SUSPENSION_3
        ).length,
        suspension3: allUsers.filter(
          (user) =>
            (user.penaltyPoints || 0) >= PENALTY_THRESHOLDS.SUSPENSION_3 &&
            (user.penaltyPoints || 0) < PENALTY_THRESHOLDS.PERMANENT_BAN
        ).length,
        permanentBan: allUsers.filter(
          (user) =>
            (user.penaltyPoints || 0) >= PENALTY_THRESHOLDS.PERMANENT_BAN
        ).length,
      };

      return {
        totalUsers,
        usersWithPenalties,
        averagePenaltyPoints: Math.round(averagePenaltyPoints * 100) / 100,
        sanctionCounts,
        overdueItemsCount: overdueRentals.length,
      };
    } catch (error) {
      console.error("벌점 통계 조회 오류:", error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const penaltySystem = new PenaltySystem();

// 상수 및 타입 내보내기
export { PENALTY_RULES, PENALTY_THRESHOLDS };
export type { OverdueItem, PenaltyProcessResult };
