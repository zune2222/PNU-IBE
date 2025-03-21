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
    title: "정보의생명공학대학 체육대회",
    category: "체육",
    date: "2025-04-15",
    time: "09:00 - 18:00",
    location: "부산대학교 대운동장",
    image: "/images/events/sports.jpg",
    status: "upcoming",
    description:
      "매년 진행되는 정보의생명공학대학 체육대회입니다. 학과별 축구, 농구, 발야구 등 다양한 종목이 준비되어 있습니다.",
    content: `
      <h3>정보의생명공학대학 체육대회</h3>
      <p>정보의생명공학대학의 모든 학과가 참여하는 연례 체육대회입니다. 다양한 스포츠 경기와 레크리에이션을 통해 학과 간 화합과 단결을 도모합니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2025년 4월 15일 (목) 09:00 - 18:00</li>
        <li>장소: 부산대학교 대운동장</li>
        <li>참가 대상: 정보의생명공학대학 재학생</li>
        <li>준비물: 운동복, 운동화, 개인 물병</li>
      </ul>
      
      <h4>종목 안내</h4>
      <ul>
        <li>축구: 5인제, 조별 리그 후 토너먼트</li>
        <li>농구: 3대3 하프코트, 토너먼트</li>
        <li>발야구: 학과 대항전</li>
        <li>줄다리기: 학과 대항전</li>
        <li>미니게임: 다양한 레크리에이션 게임</li>
      </ul>
      
      <h4>시간표</h4>
      <p>09:00 - 09:30: 개회식 및 준비운동<br>
      09:30 - 12:00: 오전 경기 (축구, 농구 예선)<br>
      12:00 - 13:00: 점심 시간<br>
      13:00 - 16:30: 오후 경기 (발야구, 줄다리기, 결승전)<br>
      16:30 - 17:30: 미니게임 및 레크리에이션<br>
      17:30 - 18:00: 시상식 및 폐회식</p>
      
      <h4>안내사항</h4>
      <ul>
        <li>참가 신청은 각 학과 학생회를 통해 4월 5일까지 접수 바랍니다.</li>
        <li>우천 시 체육관에서 변경된 일정으로 진행됩니다.</li>
        <li>부상 방지를 위해 준비운동을 충분히 해주시기 바랍니다.</li>
        <li>점심 식사는 행사장에서 제공됩니다.</li>
      </ul>
      
      <p>문의사항이 있으신 경우 학생회(051-510-1234)로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보의생명공학대학 학생회",
    contact: "051-510-1234",
    registrationRequired: true,
    registrationDeadline: "2025-04-05",
    featured: true,
    gradient: "from-[#485493] to-[#2C3968]",
  },
  {
    id: 2,
    title: "프로그래밍 경진대회",
    category: "학술",
    date: "2025-03-10",
    time: "13:00 - 18:00",
    location: "제2공학관 강당",
    image: "/images/events/programming.jpg",
    status: "upcoming",
    description:
      "알고리즘 문제 해결 능력을 겨루는 프로그래밍 경진대회입니다. 다양한 상품과 상금이 마련되어 있습니다.",
    content: `
      <h3>프로그래밍 경진대회</h3>
      <p>알고리즘 문제 해결 능력을 겨루는 프로그래밍 경진대회입니다. 창의적인 사고와 효율적인 코드 작성 능력을 평가하며, 우수한 성적을 거둔 참가자에게는 다양한 상품과 상금이 준비되어 있습니다.</p>
      
      <h4>대회 개요</h4>
      <ul>
        <li>일시: 2025년 3월 10일 (월) 13:00 - 18:00</li>
        <li>장소: 제2공학관 강당</li>
        <li>참가 대상: 부산대학교 재학생 (전공 무관)</li>
        <li>참가비: 무료</li>
      </ul>
      
      <h4>대회 형식</h4>
      <ul>
        <li>개인전으로 진행</li>
        <li>5시간 동안 8-10개의 알고리즘 문제 해결</li>
        <li>사용 가능 언어: C, C++, Java, Python</li>
        <li>온라인 저지 시스템을 통한 실시간 채점</li>
      </ul>
      
      <h4>시상 내역</h4>
      <ul>
        <li>대상(1명): 상장 및 상금 50만원</li>
        <li>금상(2명): 상장 및 상금 30만원</li>
        <li>은상(3명): 상장 및 상금 20만원</li>
        <li>동상(5명): 상장 및 상금 10만원</li>
        <li>참가상: 기념품</li>
      </ul>
      
      <h4>준비물</h4>
      <ul>
        <li>학생증</li>
        <li>개인 노트북 (전원 어댑터 포함)</li>
      </ul>
      
      <h4>유의사항</h4>
      <ul>
        <li>인터넷 검색 및 외부 자료 참조는 금지됩니다.</li>
        <li>사전에 작성한 코드 사용은 금지됩니다.</li>
        <li>참가자는 대회 시작 30분 전까지 입실해야 합니다.</li>
      </ul>
      
      <p>문의사항이 있으신 경우 정보컴퓨터공학부 학생회(051-510-2345)로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보컴퓨터공학부 알고리즘 학회",
    contact: "051-510-2345",
    registrationRequired: true,
    registrationDeadline: "2025-03-05",
    gradient: "from-[#87CEFA] to-[#4A6FA5]",
  },
  {
    id: 3,
    title: "새내기 환영회",
    category: "문화",
    date: "2025-03-02",
    time: "17:00 - 21:00",
    location: "학생회관 대강당",
    image: "/images/events/welcome.jpg",
    status: "ongoing",
    description:
      "신입생들을 환영하는 행사로, 학과 소개 및 선배들과의 만남의 시간이 준비되어 있습니다.",
    content: `
      <h3>새내기 환영회</h3>
      <p>정보의생명공학대학에 입학한 새내기 여러분을 환영합니다! 이번 행사는 학과 생활에 필요한 정보를 제공하고 선후배 간의 유대감을 형성하기 위한 자리입니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2025년 3월 2일 (일) 17:00 - 21:00</li>
        <li>장소: 학생회관 대강당</li>
        <li>참가 대상: 2025학년도 정보의생명공학대학 신입생 및 재학생</li>
      </ul>
      
      <h4>행사 일정</h4>
      <p>17:00 - 17:30: 등록 및 입장<br>
      17:30 - 18:00: 학장님 환영사 및 학과 소개<br>
      18:00 - 19:00: 저녁 식사<br>
      19:00 - 20:00: 학과별 소개 및 선배와의 만남<br>
      20:00 - 21:00: 레크리에이션 및 친목 활동</p>
      
      <h4>프로그램</h4>
      <ul>
        <li>학과 생활 가이드: 수강신청, 학점 관리, 장학금 등 꿀팁 공유</li>
        <li>동아리/학회 소개: 다양한 학과 동아리 및 학회 활동 소개</li>
        <li>멘토-멘티 매칭: 1:3 비율로 선배와 후배 매칭</li>
        <li>아이스브레이킹 게임: 즐거운 친목 활동</li>
      </ul>
      
      <h4>참가 신청</h4>
      <p>참가 신청은 각 학과 학생회를 통해서 가능합니다. 신청 마감은 2월 25일까지입니다.</p>
      
      <p>문의사항이 있으신 경우 학생회(051-510-1234)로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보의생명공학대학 학생회",
    contact: "051-510-1234",
    registrationRequired: true,
    registrationDeadline: "2025-02-25",
    gradient: "from-[#00BFFF] to-[#0077B6]",
    featured: true,
  },
  {
    id: 4,
    title: "진로 탐색 워크샵",
    category: "취업",
    date: "2025-02-28",
    time: "14:00 - 17:00",
    location: "제1공학관 세미나실",
    image: "/images/events/career.jpg",
    status: "ongoing",
    description:
      "다양한 기업의 현직자들을 초청하여 진로 탐색에 도움을 주는 워크샵입니다.",
    content: `
      <h3>진로 탐색 워크샵</h3>
      <p>정보의생명공학대학 학생들의 진로 탐색을 돕기 위해 다양한 분야의 현직자들을 초청한 워크샵입니다. 실제 업무 환경과 필요한 역량에 대한 이야기를 듣고 질의응답 시간을 통해 궁금증을 해소할 수 있는 기회입니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2025년 2월 28일 (금) 14:00 - 17:00</li>
        <li>장소: 제1공학관 세미나실</li>
        <li>참가 대상: 정보의생명공학대학 재학생 및 졸업생</li>
        <li>참가비: 무료</li>
      </ul>
      
      <h4>초청 연사</h4>
      <ul>
        <li>김민준 (네이버 - 소프트웨어 엔지니어)</li>
        <li>이서연 (삼성전자 - 인공지능 연구원)</li>
        <li>박지훈 (LG생명과학 - 바이오정보학 연구원)</li>
        <li>정수아 (카카오 - 데이터 분석가)</li>
        <li>최우진 (스타트업 창업자 - 인지컴퓨팅 분야)</li>
      </ul>
      
      <h4>프로그램</h4>
      <p>14:00 - 14:10: 개회사<br>
      14:10 - 15:30: 패널 토크 (각 연사별 15-20분 발표)<br>
      15:30 - 15:50: 휴식<br>
      15:50 - 16:40: 질의응답 및 패널 토론<br>
      16:40 - 17:00: 네트워킹</p>
      
      <h4>혜택</h4>
      <ul>
        <li>참가자 전원에게 간식 제공</li>
        <li>참석확인서 발급 가능</li>
        <li>연사와의 1:1 대화 기회</li>
      </ul>
      
      <p>문의사항이 있으신 경우 취업지원센터(051-510-3456)로 연락주시기 바랍니다.</p>
    `,
    organizer: "취업지원센터",
    contact: "051-510-3456",
    registrationRequired: true,
    registrationDeadline: "2025-02-25",
    gradient: "from-[#ADD8E6] to-[#5B8DA0]",
  },
  {
    id: 5,
    title: "종강 파티",
    category: "문화",
    date: "2024-12-20",
    time: "18:00 - 22:00",
    location: "학생회관",
    image: "/images/events/party.jpg",
    status: "ongoing",
    description:
      "한 학기 동안 고생한 학우들을 위한 종강 파티입니다. 다양한 음식과 게임이 준비되어 있습니다.",
    content: `
      <h3>종강 파티</h3>
      <p>한 학기 동안 열심히 공부한 정보의생명공학대학 학우들을 위한 종강 파티입니다. 맛있는 음식과 재미있는 게임, 다양한 공연이 준비되어 있으니 많은 참여 바랍니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2024년 12월 20일 (금) 18:00 - 22:00</li>
        <li>장소: 학생회관 1층 로비</li>
        <li>참가 대상: 정보의생명공학대학 재학생</li>
        <li>참가비: 5,000원 (현장 납부)</li>
      </ul>
      
      <h4>프로그램</h4>
      <ul>
        <li>학생회 한 학기 활동 보고</li>
        <li>맛있는 음식과 음료 제공</li>
        <li>장기자랑 및 공연</li>
        <li>레크리에이션 및 게임</li>
        <li>경품 추첨</li>
      </ul>
      
      <h4>참가 신청</h4>
      <p>참가 신청은 각 학과 대표를 통해 12월 15일까지 접수해주시기 바랍니다. 참가비는 현장에서 수납합니다.</p>
      
      <p>문의사항이 있으신 경우 학생회(051-510-1234)로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보의생명공학대학 학생회",
    contact: "051-510-1234",
    registrationRequired: false,
    gradient: "from-[#FFB6C1] to-[#FF69B4]",
  },
  {
    id: 6,
    title: "학술 세미나",
    category: "학술",
    date: "2024-11-25",
    time: "15:00 - 18:00",
    location: "제2공학관 세미나실",
    image: "/images/events/seminar.jpg",
    status: "completed",
    description: "최신 기술 트렌드와 연구 동향을 공유하는 학술 세미나입니다.",
    content: `
      <h3>학술 세미나: 최신 기술 트렌드와 연구 동향</h3>
      <p>정보의생명공학 분야의 최신 기술 트렌드와 연구 동향을 공유하는 학술 세미나입니다. 학계와 산업계에서 활발히 활동하는 전문가들을 모시고 다양한 주제에 대한 발표와 토론의 시간을 가질 예정입니다.</p>
      
      <h4>세미나 개요</h4>
      <ul>
        <li>일시: 2024년 11월 25일 (월) 15:00 - 18:00</li>
        <li>장소: 제2공학관 세미나실</li>
        <li>참가 대상: 정보의생명공학대학 학부생, 대학원생, 교수진</li>
        <li>참가비: 무료</li>
      </ul>
      
      <h4>발표 주제</h4>
      <ul>
        <li>인공지능과 머신러닝의 최신 트렌드</li>
        <li>바이오인포매틱스 연구 동향</li>
        <li>클라우드 컴퓨팅과 분산 시스템</li>
        <li>정보보안 기술의 발전 방향</li>
      </ul>
      
      <h4>프로그램</h4>
      <p>15:00 - 15:10: 개회사<br>
      15:10 - 16:10: 주제 발표 1, 2<br>
      16:10 - 16:30: 휴식 및 네트워킹<br>
      16:30 - 17:30: 주제 발표 3, 4<br>
      17:30 - 18:00: 종합 토론 및 폐회</p>
      
      <p>문의사항이 있으신 경우 학술부(051-510-4567)로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보의생명공학대학 학술부",
    contact: "051-510-4567",
    registrationRequired: true,
    registrationDeadline: "2024-11-20",
    gradient: "from-[#4B0082] to-[#800080]",
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
