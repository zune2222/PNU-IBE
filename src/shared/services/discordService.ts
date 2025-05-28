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

interface RentalNotificationData {
  studentName: string;
  studentId: string;
  department: string;
  phoneNumber: string;
  itemName: string;
  itemCategory: string;
  campus: string;
  location: string;
  rentDate: string;
  dueDate: string;
  rentalId: string;
}

// Discord Webhook URL (환경변수로 관리)
const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;

// 색상 코드 정의
const COLORS = {
  SUCCESS: 0x00ff00, // 초록색 - 승인, 반납 완료
  WARNING: 0xff9900, // 주황색 - 새 신청, 반납 신청
  ERROR: 0xff0000, // 빨간색 - 연체, 거부
  INFO: 0x0099ff, // 파란색 - 일반 정보
  RENTAL: 0x3b82f6, // 파란색 - 즉시 대여
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

  // 즉시 대여 완료 알림
  async notifyInstantRental(data: RentalNotificationData): Promise<boolean> {
    const embed: DiscordEmbed = {
      title: "🔔 즉시 대여 완료",
      description: `**${data.studentName}** 학생이 물품을 즉시 대여했습니다.`,
      color: COLORS.RENTAL,
      fields: [
        {
          name: "👤 학생 정보",
          value: `**이름:** ${data.studentName}\n**학번:** ${data.studentId}\n**학과:** ${data.department}\n**연락처:** ${data.phoneNumber}`,
          inline: true,
        },
        {
          name: "📦 물품 정보",
          value: `**물품명:** ${data.itemName}\n**카테고리:** ${
            data.itemCategory
          }\n**위치:** ${
            data.campus === "yangsan" ? "양산캠퍼스" : "장전캠퍼스"
          } ${data.location}`,
          inline: true,
        },
        {
          name: "📅 대여 기간",
          value: `**대여일:** ${data.rentDate}\n**반납 예정일:** ${data.dueDate}`,
          inline: false,
        },
        {
          name: "🔗 관리",
          value: `**대여 ID:** \`${data.rentalId}\``,
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "PNU IBE 물품 대여 시스템",
      },
      thumbnail: {
        url: PNU_IBE_LOGO,
      },
    };

    const message: DiscordMessage = {
      content: "📱 새로운 즉시 대여가 완료되었습니다!",
      embeds: [embed],
    };

    return await this.sendMessage(message);
  }

  // 즉시 반납 완료 알림
  async notifyInstantReturn(data: {
    studentName: string;
    studentId: string;
    itemName: string;
    returnDate: string;
    rentalId: string;
    isOnTime: boolean;
    overdueDays?: number;
  }): Promise<boolean> {
    const embed: DiscordEmbed = {
      title: data.isOnTime ? "✅ 즉시 반납 완료" : "⚠️ 연체 반납 완료",
      description: `**${data.studentName}** 학생이 물품을 즉시 반납했습니다.`,
      color: data.isOnTime ? COLORS.SUCCESS : COLORS.WARNING,
      fields: [
        {
          name: "👤 학생 정보",
          value: `**이름:** ${data.studentName}\n**학번:** ${data.studentId}`,
          inline: true,
        },
        {
          name: "📦 물품 정보",
          value: `**물품명:** ${data.itemName}\n**반납일:** ${data.returnDate}`,
          inline: true,
        },
        {
          name: "📊 상태",
          value: data.isOnTime
            ? "✅ 정상 반납"
            : `⚠️ 연체 반납 (${data.overdueDays}일 연체)`,
          inline: false,
        },
        {
          name: "🔗 관리",
          value: `**대여 ID:** \`${data.rentalId}\``,
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "PNU IBE 물품 대여 시스템",
      },
      thumbnail: {
        url: PNU_IBE_LOGO,
      },
    };

    const message: DiscordMessage = {
      content: data.isOnTime
        ? "✅ 물품이 정상 반납되었습니다!"
        : "⚠️ 연체된 물품이 반납되었습니다!",
      embeds: [embed],
    };

    return await this.sendMessage(message);
  }

  // 연체 알림
  async notifyOverdue(data: {
    studentName: string;
    studentId: string;
    itemName: string;
    dueDate: string;
    overdueDays: number;
    phoneNumber: string;
    rentalId: string;
  }): Promise<boolean> {
    const embed: DiscordEmbed = {
      title: "🚨 물품 연체 알림",
      description: `**${data.studentName}** 학생의 물품이 ${data.overdueDays}일 연체되었습니다.`,
      color: COLORS.ERROR,
      fields: [
        {
          name: "👤 학생 정보",
          value: `**이름:** ${data.studentName}\n**학번:** ${data.studentId}\n**연락처:** ${data.phoneNumber}`,
          inline: true,
        },
        {
          name: "📦 물품 정보",
          value: `**물품명:** ${data.itemName}\n**반납 예정일:** ${data.dueDate}\n**연체 일수:** ${data.overdueDays}일`,
          inline: true,
        },
        {
          name: "📞 조치 사항",
          value: "학생에게 연락하여 즉시 반납하도록 안내해주세요.",
          inline: false,
        },
        {
          name: "🔗 관리",
          value: `**대여 ID:** \`${data.rentalId}\``,
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "PNU IBE 물품 대여 시스템",
      },
      thumbnail: {
        url: PNU_IBE_LOGO,
      },
    };

    const message: DiscordMessage = {
      content: "🚨 연체된 물품이 있습니다!",
      embeds: [embed],
    };

    return await this.sendMessage(message);
  }

  // 일일 요약 알림
  async notifyDailySummary(data: {
    date: string;
    newRentals: number;
    activeRentals: number;
    overdueRentals: number;
    completedReturns: number;
    totalItems: number;
    availableItems: number;
  }): Promise<boolean> {
    const embed: DiscordEmbed = {
      title: "📊 일일 대여 현황 요약",
      description: `**${data.date}** 대여 시스템 현황입니다.`,
      color: COLORS.INFO,
      fields: [
        {
          name: "📈 오늘의 활동",
          value: `**새로운 대여:** ${data.newRentals}건\n**완료된 반납:** ${data.completedReturns}건`,
          inline: true,
        },
        {
          name: "📊 현재 상황",
          value: `**대여 중:** ${data.activeRentals}건\n**연체:** ${data.overdueRentals}건`,
          inline: true,
        },
        {
          name: "📦 물품 현황",
          value: `**전체 물품:** ${data.totalItems}개\n**대여 가능:** ${data.availableItems}개`,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "PNU IBE 물품 대여 시스템",
      },
      thumbnail: {
        url: PNU_IBE_LOGO,
      },
    };

    const message: DiscordMessage = {
      content: "📊 일일 대여 현황 요약입니다.",
      embeds: [embed],
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
    const embed: DiscordEmbed = {
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
        text: "PNU IBE 물품 대여 시스템",
      },
      thumbnail: {
        url: PNU_IBE_LOGO,
      },
    };

    const message: DiscordMessage = {
      content: "🚨 시스템 오류가 발생했습니다!",
      embeds: [embed],
    };

    return this.sendMessage(message);
  }

  // 테스트 메시지 (개발용)
  async sendTestMessage(): Promise<boolean> {
    const embed: DiscordEmbed = {
      title: "🧪 테스트 완료",
      description: "Discord Webhook이 정상적으로 작동하고 있습니다.",
      color: COLORS.SUCCESS,
      timestamp: new Date().toISOString(),
      footer: {
        text: "PNU IBE 물품 대여 시스템",
      },
      thumbnail: {
        url: PNU_IBE_LOGO,
      },
    };

    const message: DiscordMessage = {
      content: "🧪 Discord 알림 시스템 테스트 메시지입니다.",
      embeds: [embed],
    };

    return this.sendMessage(message);
  }
}

// 싱글톤 인스턴스 생성
export const discordService = new DiscordService();

// 타입 및 인터페이스 내보내기
export type {
  DiscordMessage,
  DiscordEmbed,
  DiscordField,
  RentalNotificationData,
};
