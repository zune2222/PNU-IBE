import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import axios from "axios";

// Discord Webhook URL 환경변수 정의
const discordWebhookUrl = defineString("DISCORD_WEBHOOK_URL");

// Discord 메시지 타입 정의
interface DiscordMessage {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordField[];
  timestamp?: string;
  footer?: {
    text?: string;
    icon_url?: string;
  };
}

interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

// 색상 코드
const COLORS = {
  SUCCESS: 0x00ff00,
  WARNING: 0xff9900,
  ERROR: 0xff0000,
  INFO: 0x0099ff,
};

const PNU_IBE_LOGO = "https://via.placeholder.com/100x100.png?text=PNU+IBE";

// Discord 메시지 전송 함수
async function sendDiscordMessage(message: DiscordMessage): Promise<boolean> {
  const webhookUrl = discordWebhookUrl.value();
  if (!webhookUrl) {
    logger.warn("Discord Webhook URL이 설정되지 않았습니다.");
    return false;
  }

  try {
    const response = await axios.post(webhookUrl, message, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      logger.info("Discord 메시지 전송 성공");
      return true;
    } else {
      logger.error(`Discord 메시지 전송 실패: ${response.status}`);
      return false;
    }
  } catch (error) {
    logger.error("Discord 메시지 전송 오류:", error);
    return false;
  }
}

// 연체 확인 및 알림 (매일 오전 9시 실행) - 비활성화됨 (checkReturnDelays로 대체)
/*
export const checkOverdueRentals = onSchedule(
  {
    schedule: "0 9 * * *", // 매일 오전 9시 (KST)
    timeZone: "Asia/Seoul",
    region: "asia-northeast3", // 서울 리전
  },
  async () => {
    try {
      logger.info("연체 확인 스케줄러 시작");

      const db = admin.firestore();
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // 현재 대여 중인 항목 조회
      const activeRentalsQuery = await db
        .collection("rental_applications")
        .where("status", "==", "rented")
        .where("dueDate", "<", todayStr)
        .get();

      let overdueCount = 0;
      const overdueUsers: any[] = [];

      for (const doc of activeRentalsQuery.docs) {
        const rental = doc.data();
        const endDate = new Date(rental.dueDate);
        const overdueDays = Math.floor(
          (today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (overdueDays > 0) {
          overdueCount++;

          // 벌점 계산 (연체일 * 1점)
          const penaltyPoints = overdueDays;

          // 물품 정보 조회
          let itemName = "알 수 없는 물품";
          try {
            const itemDoc = await db
              .collection("rental_items")
              .doc(rental.itemId)
              .get();
            if (itemDoc.exists) {
              const itemData = itemDoc.data();
              itemName = itemData?.name || "알 수 없는 물품";
            }
          } catch (error) {
            logger.warn(`물품 정보 조회 실패: ${rental.itemId}`, error);
          }

          // 사용자 정보 조회 - 학번으로 조회
          const usersQuery = await db
            .collection("users")
            .where("studentId", "==", rental.studentId)
            .get();

          let user = null;
          if (!usersQuery.empty) {
            user = usersQuery.docs[0].data();
          }

          if (user) {
            overdueUsers.push({
              userName: user.name,
              studentId: user.studentId,
              itemName: itemName,
              endDate: rental.dueDate,
              overdueDays,
            });

            // 벌점 기록 추가 - studentId 기반으로 저장
            await db.collection("penalties").add({
              userId: rental.studentId, // 학번을 userId로 사용
              rentalId: doc.id,
              type: "OVERDUE",
              points: penaltyPoints,
              reason: `${itemName} ${overdueDays}일 연체`,
              appliedAt: admin.firestore.Timestamp.now(),
            });

            logger.info(
              `연체 처리: ${user.name} (${rental.studentId}) - ${itemName} (${overdueDays}일)`
            );
          } else {
            // 사용자 정보가 없는 경우에도 대여 신청의 정보를 사용
            overdueUsers.push({
              userName: rental.studentName,
              studentId: rental.studentId,
              itemName: itemName,
              endDate: rental.dueDate,
              overdueDays,
            });

            // 벌점 기록 추가 - 사용자 정보가 없어도 학번으로 기록
            await db.collection("penalties").add({
              userId: rental.studentId, // 학번을 userId로 사용
              rentalId: doc.id,
              type: "OVERDUE",
              points: penaltyPoints,
              reason: `${itemName} ${overdueDays}일 연체`,
              appliedAt: admin.firestore.Timestamp.now(),
            });

            logger.info(
              `연체 처리 (사용자 정보 없음): ${rental.studentName} (${rental.studentId}) - ${itemName} (${overdueDays}일)`
            );
          }
        }
      }

      // Discord 알림 전송
      if (overdueCount > 0) {
        const message: DiscordMessage = {
          embeds: [
            {
              title: "⚠️ 연체 항목 발견",
              description: `**${overdueCount}건**의 연체 항목이 발견되었습니다.`,
              color: COLORS.ERROR,
              fields: overdueUsers.slice(0, 10).map((item) => ({
                name: `${item.userName} (${item.studentId})`,
                value: `${item.itemName} - ${item.overdueDays}일 연체`,
                inline: false,
              })),
              timestamp: new Date().toISOString(),
              footer: {
                text:
                  overdueCount > 10
                    ? `${overdueCount - 10}건 더...`
                    : "즉시 조치가 필요합니다",
                icon_url: PNU_IBE_LOGO,
              },
            },
          ],
        };

        await sendDiscordMessage(message);
      } else {
        logger.info("연체 항목 없음");
      }

      logger.info(`연체 확인 완료 - 총 ${overdueCount}건 처리`);
    } catch (error) {
      logger.error("연체 확인 스케줄러 오류:", error);

      // 오류 알림
      if (discordWebhookUrl.value()) {
        await sendDiscordMessage({
          embeds: [
            {
              title: "🚨 연체 확인 스케줄러 오류",
              description: "연체 확인 중 오류가 발생했습니다.",
              color: COLORS.ERROR,
              fields: [
                {
                  name: "오류 메시지",
                  value: String(error),
                  inline: false,
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    }
  }
);
*/

// 일일 요약 보고서 (매일 저녁 6시 실행)
export const sendDailySummary = onSchedule(
  {
    schedule: "0 18 * * *", // 매일 저녁 6시 (KST)
    timeZone: "Asia/Seoul",
    region: "asia-northeast3",
  },
  async () => {
    try {
      logger.info("일일 요약 스케줄러 시작");

      const db = admin.firestore();
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // 오늘의 통계 수집
      const [
        newApplicationsQuery,
        pendingApplicationsQuery,
        activeRentalsQuery,
        overdueRentalsQuery,
        completedReturnsQuery,
      ] = await Promise.all([
        // 새로운 신청 (오늘)
        db
          .collection("rental_applications")
          .where(
            "createdAt",
            ">=",
            admin.firestore.Timestamp.fromDate(new Date(todayStr))
          )
          .get(),

        // 승인 대기 - 셀프 서비스에서는 pending 상태가 없을 수 있음
        db
          .collection("rental_applications")
          .where("status", "==", "pending")
          .get(),

        // 현재 대여 중
        db
          .collection("rental_applications")
          .where("status", "==", "rented")
          .where("dueDate", ">=", todayStr)
          .get(),

        // 연체 중
        db
          .collection("rental_applications")
          .where("status", "==", "rented")
          .where("dueDate", "<", todayStr)
          .get(),

        // 완료된 반납 (오늘)
        db
          .collection("rental_applications")
          .where("status", "==", "returned")
          .where("actualReturnDate", ">=", todayStr)
          .get(),
      ]);

      const stats = {
        newApplications: newApplicationsQuery.size,
        pendingApplications: pendingApplicationsQuery.size,
        activeRentals: activeRentalsQuery.size,
        overdueRentals: overdueRentalsQuery.size,
        completedReturns: completedReturnsQuery.size,
      };

      // 인기 물품 통계 (최근 7일)
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentRentalsQuery = await db
        .collection("rental_applications")
        .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(weekAgo))
        .get();

      const itemStats: { [key: string]: number } = {};
      recentRentalsQuery.docs.forEach((doc) => {
        const itemName = doc.data().itemName;
        itemStats[itemName] = (itemStats[itemName] || 0) + 1;
      });

      const topItems = Object.entries(itemStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => `${name}: ${count}회`);

      // Discord 요약 메시지 전송
      const message: DiscordMessage = {
        embeds: [
          {
            title: "📊 일일 대여 현황 요약",
            description: `**${todayStr}** 대여 시스템 현황입니다.`,
            color: COLORS.INFO,
            fields: [
              {
                name: "📝 오늘 새 신청",
                value: `${stats.newApplications}건`,
                inline: true,
              },
              {
                name: "⏳ 승인 대기",
                value: `${stats.pendingApplications}건`,
                inline: true,
              },
              {
                name: "📦 현재 대여 중",
                value: `${stats.activeRentals}건`,
                inline: true,
              },
              {
                name: "⚠️ 연체",
                value: `${stats.overdueRentals}건`,
                inline: true,
              },
              {
                name: "✅ 오늘 반납 완료",
                value: `${stats.completedReturns}건`,
                inline: true,
              },
              {
                name: "🔥 인기 물품 (주간)",
                value:
                  topItems.length > 0 ? topItems.join("\n") : "데이터 없음",
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: "PNU 정보의생명공학대학 학생회",
              icon_url: PNU_IBE_LOGO,
            },
          },
        ],
      };

      await sendDiscordMessage(message);

      logger.info("일일 요약 전송 완료", stats);
    } catch (error) {
      logger.error("일일 요약 스케줄러 오류:", error);

      // 오류 알림
      if (discordWebhookUrl.value()) {
        await sendDiscordMessage({
          embeds: [
            {
              title: "🚨 일일 요약 스케줄러 오류",
              description: "일일 요약 생성 중 오류가 발생했습니다.",
              color: COLORS.ERROR,
              fields: [
                {
                  name: "오류 메시지",
                  value: String(error),
                  inline: false,
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    }
  }
);

// 시스템 헬스체크 (매 시간 실행)
export const systemHealthCheck = onSchedule(
  {
    schedule: "0 * * * *", // 매시간 정각
    timeZone: "Asia/Seoul",
    region: "asia-northeast3",
  },
  async () => {
    try {
      logger.info("시스템 헬스체크 시작");

      const db = admin.firestore();

      // 기본적인 데이터베이스 연결 테스트
      await db.collection("system").doc("healthcheck").set({
        lastCheck: admin.firestore.Timestamp.now(),
        status: "healthy",
      });

      // 중요한 컬렉션들의 접근 가능성 확인
      const collections = ["users", "rental_applications", "items"];
      const healthResults = await Promise.all(
        collections.map(async (collection) => {
          try {
            const snapshot = await db.collection(collection).limit(1).get();
            return { collection, status: "ok", count: snapshot.size };
          } catch (error) {
            return { collection, status: "error", error: String(error) };
          }
        })
      );

      const errors = healthResults.filter(
        (result) => result.status === "error"
      );

      if (errors.length > 0) {
        // 문제 발견 시 Discord 알림
        await sendDiscordMessage({
          embeds: [
            {
              title: "🚨 시스템 헬스체크 경고",
              description: "시스템에 문제가 감지되었습니다.",
              color: COLORS.ERROR,
              fields: errors.map((error) => ({
                name: `컬렉션: ${error.collection}`,
                value: String(error.error),
                inline: false,
              })),
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }

      logger.info("시스템 헬스체크 완료", { results: healthResults });
    } catch (error) {
      logger.error("시스템 헬스체크 오류:", error);
    }
  }
);

// 반납 지연 확인 및 처리 (매분 실행)
export const checkReturnDelays = onSchedule(
  {
    schedule: "* * * * *", // 매분 실행
    timeZone: "Asia/Seoul",
    region: "asia-northeast3",
  },
  async () => {
    try {
      logger.info("반납 지연 확인 스케줄러 시작");

      const db = admin.firestore();
      const now = new Date();

      // 현재 대여 중인 항목들 조회
      const activeRentalsQuery = await db
        .collection("rental_applications")
        .where("status", "==", "rented")
        .get();

      let delayCount = 0;
      const delayedRentals: any[] = [];

      for (const doc of activeRentalsQuery.docs) {
        const rental = doc.data();
        const dueDateTime = new Date(rental.dueDate);
        const delayTime = now.getTime() - dueDateTime.getTime();

        // 반납 기한이 지난 경우
        if (delayTime > 0) {
          delayCount++;

          const delayMinutes = Math.floor(delayTime / (1000 * 60));
          const delayHours = Math.floor(delayTime / (1000 * 60 * 60));

          // 물품 정보 조회
          let itemName = "알 수 없는 물품";
          try {
            const itemDoc = await db
              .collection("rental_items")
              .doc(rental.itemId)
              .get();
            if (itemDoc.exists) {
              const itemData = itemDoc.data();
              itemName = itemData?.name || "알 수 없는 물품";
            }
          } catch (error) {
            logger.warn(`물품 정보 조회 실패: ${rental.itemId}`, error);
          }

          let sanctionType = "";
          let sanctionReason = "";
          let shouldApplySanction = false;

          // 24시간 초과: 영구 제재
          if (delayTime > 24 * 60 * 60 * 1000) {
            sanctionType = "permanent_ban";
            sanctionReason = `${itemName} 24시간 초과 지연 (${delayHours}시간 ${delayMinutes % 60}분)`;
            shouldApplySanction = true;
          }
          // 2시간 초과: 1개월 제재
          else if (delayTime > 2 * 60 * 60 * 1000) {
            sanctionType = "suspension_1_month";
            sanctionReason = `${itemName} 2시간 초과 지연 (${delayHours}시간 ${delayMinutes % 60}분)`;
            shouldApplySanction = true;
          }
          // 30분 초과: 1주일 제재
          else if (delayTime > 30 * 60 * 1000) {
            sanctionType = "suspension_1_week";
            sanctionReason = `${itemName} 30분 초과 지연 (${delayMinutes}분)`;
            shouldApplySanction = true;
          }
          // 30분 이내: 경고
          else if (delayTime > 0) {
            sanctionType = "warning";
            sanctionReason = `${itemName} 반납 지연 (${delayMinutes}분)`;
            shouldApplySanction = true;
          }

          if (shouldApplySanction) {
            try {
              // 기존 제재 확인
              const existingSanctionQuery = await db
                .collection("student_sanctions")
                .where("studentId", "==", rental.studentId)
                .where("isActive", "==", true)
                .get();

              let existingSanction = null;
              if (!existingSanctionQuery.empty) {
                existingSanction = existingSanctionQuery.docs[0].data();
              }

              // 제재 레벨 확인 - 상태 변경이 있는 경우에만 처리
              const sanctionLevels: Record<string, number> = {
                warning: 1,
                suspension_1_week: 2,
                suspension_1_month: 3,
                permanent_ban: 4,
              };

              let shouldSendNotification = false;

              // 기존 제재가 없거나, 더 높은 제재로 변경되는 경우에만 처리
              if (!existingSanction) {
                shouldSendNotification = true; // 새로운 제재
              } else if (sanctionLevels[sanctionType] > sanctionLevels[existingSanction.sanctionType]) {
                shouldSendNotification = true; // 제재 등급 상승
              } else {
                // 이미 같거나 더 높은 제재가 있는 경우 건너뛰기
                continue;
              }

              // 제재 적용
              const sanctionData: any = {
                studentId: rental.studentId,
                studentName: rental.studentName,
                sanctionType,
                sanctionReason,
                sanctionStartDate: now.toISOString(),
                warningCount: sanctionType === "warning" ? 1 : 0,
                totalWarnings: sanctionType === "warning" ? 1 : 0,
                isActive: true,
                relatedRentalId: doc.id,
                createdAt: admin.firestore.Timestamp.now(),
                updatedAt: admin.firestore.Timestamp.now(),
              };

              // 제재 종료일 설정
              if (sanctionType === "suspension_1_week") {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 7);
                sanctionData.sanctionEndDate = endDate.toISOString();
              } else if (sanctionType === "suspension_1_month") {
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                sanctionData.sanctionEndDate = endDate.toISOString();
              }

              if (sanctionType === "warning") {
                sanctionData.lastWarningDate = now.toISOString();
              }

              // 기존 제재 업데이트 또는 새로 생성
              if (existingSanction && !existingSanctionQuery.empty) {
                // 경고인 경우 카운트 증가
                if (sanctionType === "warning") {
                  sanctionData.warningCount =
                    (existingSanction.warningCount || 0) + 1;
                  sanctionData.totalWarnings =
                    (existingSanction.totalWarnings || 0) + 1;

                  // 경고 3회 누적 시 1주일 제재로 변경
                  if (sanctionData.warningCount >= 3) {
                    sanctionData.sanctionType = "suspension_1_week";
                    sanctionData.sanctionReason =
                      "경고 3회 누적으로 인한 1주일 대여 제한";
                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() + 7);
                    sanctionData.sanctionEndDate = endDate.toISOString();
                    sanctionData.warningCount = 0; // 리셋
                    shouldSendNotification = true; // 경고 3회 누적으로 제재 변경 시 알림
                  }
                }

                await db
                  .collection("student_sanctions")
                  .doc(existingSanctionQuery.docs[0].id)
                  .update(sanctionData);
              } else {
                await db.collection("student_sanctions").add(sanctionData);
              }

              // 대여 상태를 overdue로 변경
              await db.collection("rental_applications").doc(doc.id).update({
                status: "overdue",
                lastOverdueCheck: admin.firestore.Timestamp.now(),
              });

              // 상태 변경이 있는 경우에만 알림 목록에 추가
              if (shouldSendNotification) {
                delayedRentals.push({
                  studentName: rental.studentName,
                  studentId: rental.studentId,
                  itemName,
                  delayTime:
                    delayHours > 0
                      ? `${delayHours}시간 ${delayMinutes % 60}분`
                      : `${delayMinutes}분`,
                  sanctionType,
                  phoneNumber: rental.phoneNumber || "연락처 없음",
                });
              }

              logger.info(
                `반납 지연 제재 적용: ${rental.studentName} (${rental.studentId}) - ${itemName} (${sanctionType})`
              );
            } catch (error) {
              logger.error(
                `제재 적용 실패: ${rental.studentId} - ${error}`
              );
            }
          }
        }
      }

      // Discord 알림 전송 (새로운 제재 또는 제재 등급 변경이 있는 경우만)
      if (delayedRentals.length > 0) {
        const message: DiscordMessage = {
          embeds: [
            {
              title: "🚨 새로운 반납 지연 제재",
              description: `**${delayedRentals.length}건**의 새로운 제재가 적용되었습니다.`,
              color: COLORS.ERROR,
              fields: delayedRentals.slice(0, 10).map((item) => ({
                name: `${item.studentName} (${item.studentId})`,
                value: `📦 ${item.itemName}\n⏰ ${item.delayTime} 지연\n⚖️ 제재: ${item.sanctionType}\n📞 ${item.phoneNumber}`,
                inline: false,
              })),
              timestamp: new Date().toISOString(),
              footer: {
                text:
                  delayedRentals.length > 10
                    ? `${delayedRentals.length - 10}건 더 있습니다`
                    : "즉시 연락 조치가 필요합니다",
                icon_url: PNU_IBE_LOGO,
              },
            },
          ],
        };

        await sendDiscordMessage(message);
      }

      logger.info(`반납 지연 확인 완료 - 총 ${delayCount}건 확인, ${delayedRentals.length}건 처리`);
    } catch (error) {
      logger.error("반납 지연 확인 스케줄러 오류:", error);

      // 오류 알림
      if (discordWebhookUrl.value()) {
        await sendDiscordMessage({
          embeds: [
            {
              title: "🚨 반납 지연 확인 스케줄러 오류",
              description: "반납 지연 확인 중 오류가 발생했습니다.",
              color: COLORS.ERROR,
              fields: [
                {
                  name: "오류 메시지",
                  value: String(error),
                  inline: false,
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    }
  }
);
