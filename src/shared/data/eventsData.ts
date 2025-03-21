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
    id: 1,
    title: "총학생회 체육대회",
    category: "체육",
    date: "2024-04-04",
    time: "09:00 - 18:00",
    location: "부산대학교 대운동장",
    image: "/images/events/sports.jpg",
    status: "upcoming",
    description:
      "부산대학교 총학생회에서 주최하는 전체 체육대회입니다. 각 단과대학별로 다양한 종목을 통해 경쟁하고 화합하는 자리입니다.",
    content: `
      <h3>부산대학교 총학생회 체육대회</h3>
      <p>부산대학교 총학생회가 주최하는 2024년 체육대회에 여러분을 초대합니다. 다양한 경기와 이벤트를 통해 단과대학 간 화합과 친목을 다집니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2024년 4월 4일 (목) 09:00 - 18:00</li>
        <li>장소: 부산대학교 대운동장</li>
        <li>참가 대상: 부산대학교 재학생</li>
        <li>준비물: 단과대학 티셔츠, 운동화, 개인 물병</li>
      </ul>
      
      <h4>종목 안내</h4>
      <ul>
        <li>축구: 단과대학 대항전 토너먼트</li>
        <li>농구: 단과대학 대항전 토너먼트</li>
        <li>계주: 단과대학 대항전</li>
        <li>줄다리기: 단과대학 대항전</li>
        <li>명랑운동회: OX 퀴즈, 단체 줄넘기 등</li>
      </ul>
      
      <h4>시간표</h4>
      <p>09:00 - 09:30: 개회식 및 준비운동<br>
      09:30 - 12:00: 오전 경기 (축구, 농구 예선)<br>
      12:00 - 13:00: 점심 시간<br>
      13:00 - 16:30: 오후 경기 (결승전, 줄다리기, 계주)<br>
      16:30 - 17:30: 명랑운동회<br>
      17:30 - 18:00: 시상식 및 폐회식</p>
      
      <h4>안내사항</h4>
      <ul>
        <li>참가 신청은 각 단과대학 학생회를 통해 3월 25일까지 접수 바랍니다.</li>
        <li>우천 시 체육관 및 강당에서 변경된 일정으로 진행됩니다.</li>
        <li>각 단과대학별 응원석이 배정됩니다.</li>
        <li>점심 식사는 행사장에서 제공됩니다.</li>
      </ul>
      
      <p>문의사항이 있으신 경우 인스타그램 <a href="https://www.instagram.com/pnu_ibe/" target="_blank">@pnu_ibe</a>로 연락주시기 바랍니다.</p>
    `,
    organizer: "부산대학교 총학생회",
    contact: "인스타그램 @pnu_ibe",
    registrationRequired: true,
    registrationDeadline: "2024-03-25",
    featured: true,
    gradient: "from-[#485493] to-[#2C3968]",
  },
  {
    id: 2,
    title: "정의전 (정보의생명공학대학 체육대회)",
    category: "체육",
    date: "2024-05-02",
    time: "10:00 - 17:00",
    location: "부산대학교 대운동장",
    image: "/images/events/sports.jpg",
    status: "upcoming",
    description:
      "정보의생명공학대학 학생회에서 주최하는 학과별 체육대회입니다. 다양한 경기와 이벤트로 학과 간 우정과 단결을 다집니다.",
    content: `
      <h3>정의전 (정보의생명공학대학 체육대회)</h3>
      <p>정보의생명공학대학의 모든 학과가 참여하는 연례 체육대회입니다. 다양한 스포츠 경기와 레크리에이션을 통해 학과 간 화합과 단결을 도모합니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2024년 5월 2일 (목) 10:00 - 17:00</li>
        <li>장소: 부산대학교 대운동장</li>
        <li>참가 대상: 정보의생명공학대학 재학생</li>
        <li>준비물: 학과 티셔츠, 운동화, 개인 물병</li>
      </ul>
      
      <h4>종목 안내</h4>
      <ul>
        <li>축구: 5인제, 조별 리그 후 토너먼트</li>
        <li>농구: 3대3 하프코트, 토너먼트</li>
        <li>발야구: 학과 대항전</li>
        <li>줄다리기: 학과 대항전</li>
        <li>레크리에이션 게임: 이어달리기, 미니게임 등</li>
      </ul>
      
      <h4>시간표</h4>
      <p>10:00 - 10:30: 개회식 및 준비운동<br>
      10:30 - 12:30: 오전 경기 (축구, 농구 예선)<br>
      12:30 - 13:30: 점심 시간<br>
      13:30 - 15:30: 오후 경기 (발야구, 줄다리기, 결승전)<br>
      15:30 - 16:30: 레크리에이션 게임<br>
      16:30 - 17:00: 시상식 및 폐회식</p>
      
      <h4>안내사항</h4>
      <ul>
        <li>참가 신청은 각 학과 학생회를 통해 4월 25일까지 접수 바랍니다.</li>
        <li>우천 시 체육관에서 변경된 일정으로 진행됩니다.</li>
        <li>부상 방지를 위해 준비운동을 충분히 해주시기 바랍니다.</li>
        <li>점심 식사는 행사장에서 제공됩니다.</li>
      </ul>
      
      <p>문의사항이 있으신 경우 인스타그램 <a href="https://www.instagram.com/pnu_ibe/" target="_blank">@pnu_ibe</a>로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보의생명공학대학 학생회",
    contact: "인스타그램 @pnu_ibe",
    registrationRequired: true,
    registrationDeadline: "2024-04-25",
    featured: true,
    gradient: "from-[#00BFFF] to-[#0077B6]",
  },
  {
    id: 3,
    title: "기말고사 간식행사",
    category: "문화",
    date: "2024-06-19",
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
        <li>일시: 2024년 6월 19일 (수) 11:00 - 16:00</li>
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
