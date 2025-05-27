// 대여 물품 데이터 타입 정의
export interface RentalItem {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  available: boolean;
  condition: string;
  location: string;
  contact: string;
}

// 대여 물품 데이터
export const rentalData: RentalItem[] = [
  {
    id: 1,
    name: "노트북",
    category: "전자기기",
    description: "학회 활동 및 프레젠테이션용 노트북입니다.",
    image: "/images/rental/laptop.jpg",
    available: true,
    condition: "양호",
    location: "학생회실",
    contact: "학생회장 010-1234-5678",
  },
  {
    id: 2,
    name: "프로젝터",
    category: "전자기기",
    description: "발표 및 행사용 프로젝터입니다.",
    image: "/images/rental/projector.jpg",
    available: true,
    condition: "양호",
    location: "학생회실",
    contact: "학생회장 010-1234-5678",
  },
  {
    id: 3,
    name: "스피커",
    category: "전자기기",
    description: "행사 및 모임용 블루투스 스피커입니다.",
    image: "/images/rental/speaker.jpg",
    available: false,
    condition: "양호",
    location: "학생회실",
    contact: "학생회장 010-1234-5678",
  },
  {
    id: 4,
    name: "카메라",
    category: "전자기기",
    description: "행사 촬영용 디지털 카메라입니다.",
    image: "/images/rental/camera.jpg",
    available: true,
    condition: "양호",
    location: "학생회실",
    contact: "학생회장 010-1234-5678",
  },
  {
    id: 5,
    name: "테이블",
    category: "가구",
    description: "행사용 접이식 테이블입니다.",
    image: "/images/rental/desk.jpg",
    available: true,
    condition: "양호",
    location: "창고",
    contact: "총무 010-2345-6789",
  },
  {
    id: 6,
    name: "의자",
    category: "가구",
    description: "행사용 접이식 의자입니다.",
    image: "/images/rental/chair.jpg",
    available: true,
    condition: "양호",
    location: "창고",
    contact: "총무 010-2345-6789",
  },
  {
    id: 7,
    name: "돗자리",
    category: "기타",
    description: "야외 행사용 돗자리입니다.",
    image: "/images/rental/mat.jpg",
    available: true,
    condition: "양호",
    location: "창고",
    contact: "총무 010-2345-6789",
  },
  {
    id: 8,
    name: "체육용품",
    category: "스포츠",
    description: "축구공, 농구공, 배드민턴 라켓 등 체육용품 세트입니다.",
    image: "/images/rental/sports.jpg",
    available: true,
    condition: "양호",
    location: "체육관 창고",
    contact: "체육부장 010-3456-7890",
  },
];

// 카테고리별 색상 정의
export function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    전자기기: "bg-blue-100 text-blue-800",
    가구: "bg-green-100 text-green-800",
    스포츠: "bg-orange-100 text-orange-800",
    기타: "bg-gray-100 text-gray-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}

// 사용 가능한 물품만 가져오기
export function getAvailableItems(): RentalItem[] {
  return rentalData.filter((item) => item.available);
}

// 카테고리별 물품 가져오기
export function getItemsByCategory(category: string): RentalItem[] {
  return rentalData.filter((item) => item.category === category);
}

// 특정 물품 가져오기
export function getItemById(id: number): RentalItem | undefined {
  return rentalData.find((item) => item.id === id);
}
