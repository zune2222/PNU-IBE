// 공지사항 데이터 타입 정의
export interface Notice {
  id: number;
  title: string;
  category: string;
  date: string;
  views: number;
  important: boolean;
  preview: string;
  content: string;
}

// 공지사항 데이터
export const noticeData: Notice[] = [
  {
    id: 1,
    title: "웹사이트 베타 버전 안내",
    category: "공지",
    date: "2024-03-22",
    views: 325,
    important: true,
    preview:
      "현재 학생회 웹사이트는 베타 버전으로 운영 중입니다. 일부 기능이 제한적이거나 정보가 정확하지 않을 수 있습니다.",
    content: `
      <h3>웹사이트 베타 버전 안내</h3>
      <p>부산대학교 정보의생명공학대학 학우 여러분, 안녕하십니까?</p>
      <p>현재 학생회 웹사이트는 베타 버전으로 운영 중임을 알려드립니다.</p>
      
      <h4>베타 버전 안내사항</h4>
      <ul>
        <li>현재 사이트에는 일부 기능이 제한적으로 제공되고 있습니다.</li>
        <li>콘텐츠와 정보가 정확하지 않거나 완전하지 않을 수 있습니다.</li>
        <li>사이트 이용 중 오류가 발생할 수 있으며, 지속적으로 개선 중입니다.</li>
        <li>일부 페이지는 아직 개발 중이거나, 준비 중인 상태입니다.</li>
      </ul>
      
      <h4>향후 계획</h4>
      <ul>
        <li>단계적으로 기능을 추가하고 콘텐츠를 업데이트할 예정입니다.</li>
        <li>학우분들의 의견을 수렴하여 지속적으로 개선해 나가겠습니다.</li>
        <li>정식 버전 출시는 추후 공지를 통해 안내드리겠습니다.</li>
      </ul>
      
      <p>사이트 이용 중 불편사항이나 개선 의견이 있으시면 학생회(@pnu_ibe)로 연락주시기 바랍니다.</p>
      
      <p>감사합니다.</p>
    `,
  },
  {
    id: 2,
    title: "2024 정의대 바람막이 단체 구매 안내",
    category: "학생회",
    date: "2024-03-22",
    views: 148,
    important: true,
    preview:
      "정의대 바람막이를 단체 구매합니다. 신청 기간: 3월 24일(월) ~ 3월 30일(일), 가격: 57,000원, 입금 후 신청 폼 작성 부탁드립니다.",
    content: `
      <h3>2024 정의대 바람막이 단체 구매 안내</h3>
      <p>안녕하세요, 부산대학교 정보의생명공학대학 학생회 정의입니다.</p>
      <p>정의대 바람막이를 단체 구매하니, 구매를 원하시는 분들께서는 입금 후 신청 폼 작성부탁드립니다.</p>
      
      <h4>구매 안내</h4>
      <ul>
        <li><strong>신청 기간:</strong> 3월 24일(월) ~ 3월 30일(일)</li>
        <li><strong>상품 가격:</strong> 57,000원</li>
        <li><strong>입금 계좌:</strong> KB국민은행 275601-04-533239 (손정훈)</li>
        <li><strong>입금자명:</strong> 이름 + 전화번호 뒷 4자리 (예: 신태일1234)</li>
      </ul>
      
      <p><strong>(*원활한 확인을 위해, 입금 후 폼 작성 부탁드립니다.)</strong></p>
      <p><a href="https://forms.gle/FBoUCH1Qk42DA6qg8" target="_blank" class="text-primary hover:underline">신청 폼 작성하기</a></p>
      
      <p>날이 따뜻해지고 있어 빠르게 진행하기 위해 신청 기간을 일주일로 한정한 점 양해 부탁드립니다.</p>
      <p>디자인 및 사이즈 표는 첨부된 이미지를 참고해주시고, 바람막이 제작 기간은 최대 4주 소요될 예정입니다.</p>
      
      <h4>문의사항</h4>
      <p>문의사항은 학생회장에게 연락해 주시면 빠르게 답변드리겠습니다.</p>
      <p>많은 관심과 참여 부탁드립니다.</p>
    `,
  },
  {
    id: 3,
    title: "2025 정의전 모집 안내",
    category: "행사",
    date: "2025-04-01",
    views: 210,
    important: true,
    preview:
      "정보의생명공학대학 체육 축제 '2025 정의전'이 개최됩니다. 행사 일시: 2025.05.02.(금) 11:00~20:00, 참가 신청: 2025.04.07.(월)~2025.04.13.(일)",
    content: `
      <h3>2025 정의전 모집 안내</h3>
      <p>안녕하세요, 정보의생명공학대학 학생회 '정의'입니다.</p>
      <p>건강한 경쟁과 협동을 통해 하나 된 마음으로 함께하는 정의대 체육 축제, "2025 정의전"을 개최합니다.</p>
      
      <h4>▶️ 행사 안내</h4>
      <ul>
        <li><strong>행사 일시:</strong> 2025.05.02.(금) 11:00~20:00</li>
        <li><strong>행사 장소:</strong> 부산대학교 양산캠퍼스 운동장</li>
        <li>** 청팀(정컴) vs 백팀(의생공 + 자전)으로 진행</li>
      </ul>
      
      <h4>▶️ 참가 신청</h4>
      <ul>
        <li><strong>모집 대상:</strong> 정보의생명공학대학 재·휴학생</li>
        <li><strong>모집 기간:</strong> 2025.04.07.(월)~2025.04.13.(일) 자정까지</li>
        <li><strong>신청 방법:</strong> <a href="https://forms.gle/urdUotTqphVSKeCa8" target="_blank" class="text-primary hover:underline">구글 폼 작성</a></li>
      </ul>
      
      <h4>▶️ 행사 프로그램</h4>
      <p><strong>[스포츠 경기]</strong></p>
      <ul>
        <li>농구, 풋살, 발야구, 피구</li>
      </ul>
      <p><strong>[레크레이션]</strong></p>
      <ul>
        <li>보물찾기, 줄다리기, 미션릴레이 등</li>
      </ul>
      <p><strong>[부스 운영]</strong></p>
      <ul>
        <li>소개팅 부스(부제: 하트시그NULL), 도전 부스 등</li>
      </ul>
      
      <h4>▶️ 참가자 혜택</h4>
      <ul>
        <li>점심, 저녁 식사 제공</li>
        <li>장전 캠퍼스 ↔ 양산 캠퍼스 이동 버스 제공</li>
        <li>다양한 상품과 상금 기회 제공</li>
      </ul>
      
      <h4>▶️ 유의사항</h4>
      <p>본 신청 폼은 스포츠 종목 신청 폼과 별개이며, 정의전 일정 참여를 원하는 분들은 반드시 작성하셔야 합니다.</p>
      <p>장전 캠퍼스에서 출발하는 버스 이용을 원하시면, 선택 질문에서 '예'를 선택해 주십시오.</p>
      <p>버스를 신청하시면 왕복 탑승(장전↔양산)으로 간주합니다.</p>
      
      <p>문의 사항은 오픈 채팅방 또는 인스타 DM(<a href="https://instagram.com/pnu_ibe" target="_blank" class="text-primary hover:underline">@pnu_ibe</a>)으로 문의 바랍니다.</p>
      <p>많은 관심과 적극적인 참여 부탁드립니다!</p>
    `,
  },
  {
    id: 4,
    title: "2025 정의전 풋살 종목 모집 안내",
    category: "행사",
    date: "2025-04-01",
    views: 158,
    important: false,
    preview:
      "정의전 스포츠 경기 중 풋살 종목 참가팀을 모집합니다. 모집 기간: 2025.04.07.(월)~2025.04.13.(일), 예선전: 4월 27일, 본선: 5월 2일",
    content: `
      <h3>2025 정의전 풋살 종목 모집 안내</h3>
      <p>안녕하세요, 정보의생명공학대학 학생회 '정의'입니다.</p>
      <p>정의전 스포츠 경기 중 풋살 종목 참가팀을 모집합니다.</p>
      <p>(*본 종목은 남학우 대상 종목입니다.)</p>
      
      <h4>▶️ 경기 장소 및 일정</h4>
      <ul>
        <li><strong>장소:</strong> 부산대학교 양산 캠퍼스 풋살장</li>
        <li><strong>예선전:</strong> 4월 27일 (일) 14:00부터 진행 (*5팀 이상 신청 시)</li>
        <li><strong>4강전:</strong> 5월 2일 (금) 11:30~12:30 / 13:30~14:30</li>
        <li><strong>결승전:</strong> 5월 2일 (금) 15:30~16:30</li>
        <li>(*참가 팀 수에 따라 예선 진행 여부 및 일정이 변동될 수 있습니다.)</li>
      </ul>
      
      <h4>▶️ 상금 안내</h4>
      <ul>
        <li><strong>1등팀:</strong> 30만원</li>
        <li><strong>2등팀:</strong> 15만원</li>
      </ul>
      
      <h4>▶️ 신청 안내</h4>
      <ul>
        <li><strong>모집 기간:</strong> 2025.04.07(월)~2025.04.13(일) 자정까지</li>
        <li><strong>신청 방법:</strong> <a href="https://forms.gle/8JKnqFWek3mKwDeM7" target="_blank" class="text-primary hover:underline">구글 폼 작성</a></li>
        <li>** 팀당 5인 구성 (개별 신청 불가)</li>
        <li>** 팀장 1인이 신청 폼을 작성(팀원 학번과 이름 필수 기재)</li>
        <li>** 같은 팀(청팀, 백팀) 학생들로만 팀 구성 가능</li>
        <li>** 풋살, 농구 중복 신청 불가능</li>
      </ul>
      
      <h4>▶️ 유의사항</h4>
      <p>진행 방식 및 주의 사항은 카드뉴스를 반드시 참고해 주십시오.</p>
      <p>추가 문의사항은 오픈 채팅방 또는 인스타 DM(<a href="https://instagram.com/pnu_ibe" target="_blank" class="text-primary hover:underline">@pnu_ibe</a>)으로 문의 부탁드립니다.</p>
      <p>여러분들의 많은 관심과 적극적인 참여를 기다립니다!</p>
    `,
  },
  {
    id: 5,
    title: "2025 정의전 농구 종목 모집 안내",
    category: "행사",
    date: "2025-04-01",
    views: 142,
    important: false,
    preview:
      "정의전 스포츠 경기 중 농구 종목 참가팀을 모집합니다. 모집 기간: 2025.04.07.(월)~2025.04.13.(일), 예선전: 4월 27일, 본선: 5월 2일",
    content: `
      <h3>2025 정의전 농구 종목 모집 안내</h3>
      <p>안녕하세요, 정보의생명공학대학 학생회 '정의'입니다.</p>
      <p>정의전 스포츠 경기 중 농구 종목 참가팀을 모집합니다.</p>
      <p>(*본 종목은 남학우 대상 종목입니다.)</p>
      
      <h4>▶️ 경기 장소 및 일정</h4>
      <ul>
        <li><strong>장소:</strong> 부산대학교 양산 캠퍼스 농구장</li>
        <li><strong>예선전:</strong> 4월 27일 (일) 14:00부터 진행 (*5팀 이상 신청 시)</li>
        <li><strong>4강전:</strong> 5월 2일 (금) 11:30~12:30 / 13:30~14:30</li>
        <li><strong>결승전:</strong> 5월 2일 (금) 16:30~17:30</li>
        <li>(*참가 팀 수에 따라 예선 진행 여부 및 일정이 변동될 수 있습니다.)</li>
      </ul>
      
      <h4>▶️ 상금 안내</h4>
      <ul>
        <li><strong>1등팀:</strong> 30만원</li>
        <li><strong>2등팀:</strong> 15만원</li>
      </ul>
      
      <h4>▶️ 신청 안내</h4>
      <ul>
        <li><strong>모집 기간:</strong> 2025.04.07(월)~2025.04.13(일) 자정까지</li>
        <li><strong>신청 방법:</strong> <a href="https://forms.gle/sJ6uiWqf4zv3LfB68" target="_blank" class="text-primary hover:underline">구글 폼 작성</a></li>
        <li>** 팀당 5인 구성 (개별 신청 불가)</li>
        <li>** 팀장 1인이 신청 폼을 작성(팀원 학번과 이름 필수 기재)</li>
        <li>** 같은 팀(청팀, 백팀) 학생들로만 팀 구성 가능</li>
        <li>** 풋살, 농구 중복 신청 불가능</li>
      </ul>
      
      <h4>▶️ 유의사항</h4>
      <p>진행 방식 및 주의 사항은 카드뉴스를 반드시 참고해 주십시오.</p>
      <p>추가 문의사항은 오픈 채팅방 또는 인스타 DM(<a href="https://instagram.com/pnu_ibe" target="_blank" class="text-primary hover:underline">@pnu_ibe</a>)으로 문의 부탁드립니다.</p>
      <p>여러분들의 많은 관심과 적극적인 참여를 기다립니다!</p>
    `,
  },
  {
    id: 6,
    title: "2025 정의전 피구&발야구 종목 모집 안내",
    category: "행사",
    date: "2025-04-01",
    views: 137,
    important: false,
    preview:
      "정의전 스포츠 경기 중 피구&발야구 종목 참가팀을 모집합니다. 모집 기간: 2025.04.07.(월)~2025.04.13.(일), 본선: 5월 2일",
    content: `
      <h3>2025 정의전 피구&발야구 종목 모집 안내</h3>
      <p>안녕하세요, 정보의생명공학대학 학생회 '정의'입니다.</p>
      <p>정의전 스포츠 경기 중 피구&발야구 종목 참가팀을 모집합니다.</p>
      <p>(*본 종목은 여학우 대상 종목입니다.)</p>
      
      <h4>▶️ 경기 장소 및 일정</h4>
      <ul>
        <li><strong>장소:</strong> 부산대학교 양산 캠퍼스 운동장</li>
        <li><strong>발야구 본선:</strong> 5월 2일 (금) 13:30~14:30</li>
        <li><strong>피구 본선:</strong> 5월 2일 (금) 14:30~15:30</li>
        <li>(*참가 인원에 따라 일정이 변동될 수 있습니다.)</li>
      </ul>
      
      <h4>▶️ 상금 안내</h4>
      <ul>
        <li><strong>1등팀:</strong> 20만원</li>
        <li><strong>2등팀:</strong> 10만원</li>
      </ul>
      
      <h4>▶️ 신청 안내</h4>
      <ul>
        <li><strong>모집 기간:</strong> 2025.04.07(월)~2025.04.13(일) 자정까지</li>
        <li><strong>신청 방법:</strong> <a href="https://forms.gle/cq3pqs9y2XnzqYGs9" target="_blank" class="text-primary hover:underline">구글 폼 작성</a></li>
        <li>** 별개의 종목이므로, 참여하실 종목에만 체크하시면 됩니다.</li>
        <li>** 피구, 발야구 중복 신청 가능</li>
      </ul>
      
      <h4>▶️ 유의 사항</h4>
      <p>진행 방식 및 주의 사항은 카드뉴스를 반드시 참고해 주십시오.</p>
      <p>추가 문의사항은 오픈 채팅방 또는 인스타 DM(<a href="https://instagram.com/pnu_ibe" target="_blank" class="text-primary hover:underline">@pnu_ibe</a>)으로 문의 부탁드립니다.</p>
      <p>여러분들의 많은 관심과 적극적인 참여를 기다립니다!</p>
    `,
  },
];

// 유틸리티 함수들

// 카테고리별 색상 스타일 반환 함수
export function getCategoryColor(category: string): string {
  switch (category) {
    case "학사":
      return "bg-blue-100 text-blue-700";
    case "장학":
      return "bg-green-100 text-green-700";
    case "행사":
      return "bg-purple-100 text-purple-700";
    case "취업":
      return "bg-amber-100 text-amber-700";
    case "동아리":
      return "bg-teal-100 text-teal-700";
    case "공지":
      return "bg-red-100 text-red-700";
    case "학생회":
      return "bg-indigo-100 text-indigo-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
