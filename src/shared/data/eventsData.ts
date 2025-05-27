// 행사 정보 데이터 타입 정의
export interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
  description: string;
  content?: string;
  organizer?: string;
  contact?: string;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  featured?: boolean;
  gradient?: string;
}

// 행사 정보 데이터
export const eventsData: Event[] = [
  {
    id: 3,
    title: "기말고사 간식행사",
    category: "문화",
    date: "2025-06-09",
    time: "11:00 - 16:00",
    location: "제6공학관",
    image: "/images/events/party.jpg",
    status: "upcoming",
    description:
      "기말고사 기간 중 시험 준비에 지친 학우들을 위한 간식 나눔 행사입니다. 다양한 간식과 응원 메시지를 전달합니다.",
    content: `
      <h3>기말고사 간식행사</h3>
      <p>기말고사 기간을 맞아 시험 준비로 지친 정보의생명공학대학 학우들을 위한 간식 나눔 행사를 진행합니다. 맛있는 간식과 함께 힘찬 응원의 메시지를 전달하는 시간이 될 것입니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2025년 6월 9일 (월) 11:00 - 16:00</li>
        <li>장소: 제6공학관</li>
        <li>참가 대상: 정보의생명공학대학 재학생</li>
        <li>준비물: 학생증</li>
      </ul>
      
      <h4>제공 간식</h4>
      <ul>
        <li>추후 공지</li>
      </ul>
      
      <h4>안내사항</h4>
      <ul>
        <li>학생증을 필수로 지참해주세요.</li>
        <li>간식은 선착순으로 소진될 수 있습니다.</li>
        <li>일회용품 사용을 줄이기 위해 개인 텀블러 지참을 권장합니다.</li>
      </ul>
      
      <p>문의사항이 있으신 경우 인스타그램 <a href="https://www.instagram.com/pnu_ibe/" target="_blank">@pnu_ibe</a>로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보의생명공학대학 학생회",
    contact: "인스타그램 @pnu_ibe",
    registrationRequired: false,
    gradient: "from-[#FFB6C1] to-[#FF69B4]",
  },
];

// 유틸리티 함수들

// 카테고리별 색상 스타일 반환 함수
export function getCategoryColor(category: string): string {
  switch (category) {
    case "학술":
      return "bg-purple-100 text-purple-700";
    case "체육":
      return "bg-red-100 text-red-700";
    case "문화":
      return "bg-amber-100 text-amber-700";
    case "취업":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// 상태별 배지 스타일 반환 함수
export function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "ongoing":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// 상태 한글 변환 함수
export function getStatusText(status: string): string {
  switch (status) {
    case "upcoming":
      return "진행 예정";
    case "ongoing":
      return "진행 중";
    case "completed":
      return "종료";
    default:
      return status;
  }
}

// 다가오는 행사 가져오기 함수
export function getUpcomingEvents(limit: number = 3): Event[] {
  return eventsData
    .filter(
      (event) => event.status === "upcoming" || event.status === "ongoing"
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
}

// 피처링된 행사 가져오기 함수
export function getFeaturedEvents(): Event[] {
  return eventsData.filter((event) => event.featured);
}
