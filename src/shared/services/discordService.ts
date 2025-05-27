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
  thumbnail?: {
    url?: string;
  };
}

interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

// Discord Webhook URL (환경변수로 관리)
const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

// 색상 코드 정의
const COLORS = {
  SUCCESS: 0x00ff00, // 초록색 - 승인, 반납 완료
  WARNING: 0xff9900, // 주황색 - 새 신청, 반납 신청
  ERROR: 0xff0000, // 빨간색 - 연체, 거부
  INFO: 0x0099ff, // 파란색 - 일반 정보
};

// PNU IBE 로고 URL (실제 로고로 교체 가능)
const PNU_IBE_LOGO = "https://via.placeholder.com/100x100.png?text=PNU+IBE";

class DiscordService {
  private async sendMessage(message: DiscordMessage): Promise<boolean> {
    if (!DISCORD_WEBHOOK_URL) {
      console.warn("Discord Webhook URL이 설정되지 않았습니다.");
      return false;
    }

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        console.error("Discord 메시지 전송 실패:", response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Discord 메시지 전송 오류:", error);
      return false;
    }
  }

  // 새로운 대여 신청 알림
  async notifyNewRentalApplication(data: {
    userName: string;
    studentId: string;
    itemName: string;
    startDate: string;
    endDate: string;
    purpose: string;
  }): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 대여 시스템",
      avatar_url: PNU_IBE_LOGO,
      embeds: [
        {
          title: "🆕 새로운 대여 신청",
          description: `**${data.userName}**님이 물품 대여를 신청했습니다.`,
          color: COLORS.WARNING,
          fields: [
            {
              name: "신청자",
              value: `${data.userName} (${data.studentId})`,
              inline: true,
            },
            { name: "물품", value: data.itemName, inline: true },
            {
              name: "대여 기간",
              value: `${data.startDate} ~ ${data.endDate}`,
              inline: false,
            },
            { name: "대여 목적", value: data.purpose, inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "PNU 정보의생명공학대학 학생회",
            icon_url: PNU_IBE_LOGO,
          },
        },
      ],
    };

    return this.sendMessage(message);
  }

  // 대여 승인 알림
  async notifyRentalApproved(data: {
    userName: string;
    studentId: string;
    itemName: string;
    lockboxLocation: string;
    lockboxPassword: string;
  }): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 대여 시스템",
      avatar_url: PNU_IBE_LOGO,
      embeds: [
        {
          title: "✅ 대여 승인 완료",
          description: `**${data.userName}**님의 대여 신청이 승인되었습니다.`,
          color: COLORS.SUCCESS,
          fields: [
            {
              name: "신청자",
              value: `${data.userName} (${data.studentId})`,
              inline: true,
            },
            { name: "물품", value: data.itemName, inline: true },
            { name: "보관함 위치", value: data.lockboxLocation, inline: false },
            {
              name: "보관함 비밀번호",
              value: `||${data.lockboxPassword}||`,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "보관함에서 물품을 수령해주세요",
            icon_url: PNU_IBE_LOGO,
          },
        },
      ],
    };

    return this.sendMessage(message);
  }

  // 대여 거부 알림
  async notifyRentalRejected(data: {
    userName: string;
    studentId: string;
    itemName: string;
    reason: string;
  }): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 대여 시스템",
      avatar_url: PNU_IBE_LOGO,
      embeds: [
        {
          title: "❌ 대여 신청 거부",
          description: `**${data.userName}**님의 대여 신청이 거부되었습니다.`,
          color: COLORS.ERROR,
          fields: [
            {
              name: "신청자",
              value: `${data.userName} (${data.studentId})`,
              inline: true,
            },
            { name: "물품", value: data.itemName, inline: true },
            { name: "거부 사유", value: data.reason, inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "문의사항이 있으시면 학생회에 연락해주세요",
            icon_url: PNU_IBE_LOGO,
          },
        },
      ],
    };

    return this.sendMessage(message);
  }

  // 반납 신청 알림
  async notifyReturnRequested(data: {
    userName: string;
    studentId: string;
    itemName: string;
    endDate: string;
  }): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 대여 시스템",
      avatar_url: PNU_IBE_LOGO,
      embeds: [
        {
          title: "📦 반납 신청",
          description: `**${data.userName}**님이 물품 반납을 신청했습니다.`,
          color: COLORS.WARNING,
          fields: [
            {
              name: "신청자",
              value: `${data.userName} (${data.studentId})`,
              inline: true,
            },
            { name: "물품", value: data.itemName, inline: true },
            { name: "원래 반납일", value: data.endDate, inline: true },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "관리자 확인이 필요합니다",
            icon_url: PNU_IBE_LOGO,
          },
        },
      ],
    };

    return this.sendMessage(message);
  }

  // 반납 완료 알림
  async notifyReturnCompleted(data: {
    userName: string;
    studentId: string;
    itemName: string;
    actualReturnDate: string;
  }): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 대여 시스템",
      avatar_url: PNU_IBE_LOGO,
      embeds: [
        {
          title: "✅ 반납 완료",
          description: `**${data.userName}**님의 물품 반납이 완료되었습니다.`,
          color: COLORS.SUCCESS,
          fields: [
            {
              name: "반납자",
              value: `${data.userName} (${data.studentId})`,
              inline: true,
            },
            { name: "물품", value: data.itemName, inline: true },
            { name: "반납일", value: data.actualReturnDate, inline: true },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "이용해주셔서 감사합니다",
            icon_url: PNU_IBE_LOGO,
          },
        },
      ],
    };

    return this.sendMessage(message);
  }

  // 연체 알림
  async notifyOverdue(data: {
    userName: string;
    studentId: string;
    itemName: string;
    endDate: string;
    overdueDays: number;
    penaltyPoints: number;
  }): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 대여 시스템",
      avatar_url: PNU_IBE_LOGO,
      embeds: [
        {
          title: "⚠️ 연체 발생",
          description: `**${data.userName}**님의 대여 물품이 연체되었습니다.`,
          color: COLORS.ERROR,
          fields: [
            {
              name: "연체자",
              value: `${data.userName} (${data.studentId})`,
              inline: true,
            },
            { name: "물품", value: data.itemName, inline: true },
            { name: "원래 반납일", value: data.endDate, inline: true },
            { name: "연체일", value: `${data.overdueDays}일`, inline: true },
            {
              name: "부과 벌점",
              value: `${data.penaltyPoints}점`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "즉시 반납해주세요",
            icon_url: PNU_IBE_LOGO,
          },
        },
      ],
    };

    return this.sendMessage(message);
  }

  // 일일 요약 알림
  async notifyDailySummary(data: {
    date: string;
    newApplications: number;
    pendingApplications: number;
    activeRentals: number;
    overdueRentals: number;
    completedReturns: number;
  }): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 대여 시스템",
      avatar_url: PNU_IBE_LOGO,
      embeds: [
        {
          title: "📊 일일 대여 현황 요약",
          description: `**${data.date}** 대여 시스템 현황입니다.`,
          color: COLORS.INFO,
          fields: [
            {
              name: "새로운 신청",
              value: `${data.newApplications}건`,
              inline: true,
            },
            {
              name: "승인 대기",
              value: `${data.pendingApplications}건`,
              inline: true,
            },
            { name: "대여 중", value: `${data.activeRentals}건`, inline: true },
            { name: "연체", value: `${data.overdueRentals}건`, inline: true },
            {
              name: "완료된 반납",
              value: `${data.completedReturns}건`,
              inline: true,
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

    return this.sendMessage(message);
  }

  // 시스템 오류 알림
  async notifySystemError(data: {
    errorType: string;
    errorMessage: string;
    userId?: string;
    additionalInfo?: string;
  }): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 시스템",
      avatar_url: PNU_IBE_LOGO,
      embeds: [
        {
          title: "🚨 시스템 오류 발생",
          description: "대여 시스템에 오류가 발생했습니다.",
          color: COLORS.ERROR,
          fields: [
            { name: "오류 타입", value: data.errorType, inline: true },
            { name: "오류 메시지", value: data.errorMessage, inline: false },
            ...(data.userId
              ? [{ name: "사용자 ID", value: data.userId, inline: true }]
              : []),
            ...(data.additionalInfo
              ? [
                  {
                    name: "추가 정보",
                    value: data.additionalInfo,
                    inline: false,
                  },
                ]
              : []),
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "시스템 관리자 확인 필요",
            icon_url: PNU_IBE_LOGO,
          },
        },
      ],
    };

    return this.sendMessage(message);
  }

  // 테스트 메시지 (개발용)
  async sendTestMessage(): Promise<boolean> {
    const message: DiscordMessage = {
      username: "PNU IBE 대여 시스템",
      avatar_url: PNU_IBE_LOGO,
      content: "🧪 Discord 알림 시스템 테스트 메시지입니다.",
      embeds: [
        {
          title: "테스트 완료",
          description: "Discord Webhook이 정상적으로 작동하고 있습니다.",
          color: COLORS.SUCCESS,
          timestamp: new Date().toISOString(),
          footer: {
            text: "PNU 정보의생명공학대학 학생회",
            icon_url: PNU_IBE_LOGO,
          },
        },
      ],
    };

    return this.sendMessage(message);
  }
}

// 싱글톤 인스턴스 생성
export const discordService = new DiscordService();

// 타입 및 인터페이스 내보내기
export type { DiscordMessage, DiscordEmbed, DiscordField };
