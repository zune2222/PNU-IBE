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
      
      <p>사이트 이용 중 불편사항이나 개선 의견이 있으시면 학생회(pnu.ibe@gmail.com)로 연락주시기 바랍니다.</p>
      
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
