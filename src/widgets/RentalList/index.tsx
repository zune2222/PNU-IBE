import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// 대여 가능한 물품 타입 정의
interface RentalItem {
  id: number;
  name: string;
  category: string;
  image: string;
  totalQuantity: number;
  availableQuantity: number;
  deposit: number;
  description: string;
}

// 더미 대여 물품 데이터
const rentalItems: RentalItem[] = [
  {
    id: 1,
    name: "노트북",
    category: "전자기기",
    image: "/images/rental/laptop.jpg",
    totalQuantity: 5,
    availableQuantity: 3,
    deposit: 50000,
    description:
      "학생회에서 대여 가능한 노트북입니다. 프레젠테이션, 과제 등을 위해 대여할 수 있습니다.",
  },
  {
    id: 2,
    name: "프로젝터",
    category: "전자기기",
    image: "/images/rental/projector.jpg",
    totalQuantity: 3,
    availableQuantity: 2,
    deposit: 30000,
    description:
      "소모임, 스터디, 발표를 위한 프로젝터입니다. HDMI 케이블도 함께 대여됩니다.",
  },
  {
    id: 3,
    name: "카메라",
    category: "전자기기",
    image: "/images/rental/camera.jpg",
    totalQuantity: 2,
    availableQuantity: 1,
    deposit: 50000,
    description:
      "행사나 활동 기록을 위한 DSLR 카메라입니다. SD 카드는 별도로 준비하셔야 합니다.",
  },
  {
    id: 4,
    name: "스피커",
    category: "전자기기",
    image: "/images/rental/speaker.jpg",
    totalQuantity: 4,
    availableQuantity: 4,
    deposit: 20000,
    description:
      "블루투스 연결이 가능한 포터블 스피커입니다. 야외 활동이나 소모임에 활용하기 좋습니다.",
  },
  {
    id: 5,
    name: "책상",
    category: "가구",
    image: "/images/rental/desk.jpg",
    totalQuantity: 10,
    availableQuantity: 8,
    deposit: 10000,
    description:
      "접이식 책상으로, 행사나 부스 운영 시 유용하게 사용할 수 있습니다.",
  },
  {
    id: 6,
    name: "의자",
    category: "가구",
    image: "/images/rental/chair.jpg",
    totalQuantity: 20,
    availableQuantity: 15,
    deposit: 5000,
    description: "접이식 의자로, 행사나 모임에 활용할 수 있습니다.",
  },
  {
    id: 7,
    name: "돗자리",
    category: "생활용품",
    image: "/images/rental/mat.jpg",
    totalQuantity: 8,
    availableQuantity: 8,
    deposit: 5000,
    description: "야외 활동이나 피크닉에 활용할 수 있는 대형 돗자리입니다.",
  },
  {
    id: 8,
    name: "운동 기구",
    category: "스포츠",
    image: "/images/rental/sports.jpg",
    totalQuantity: 15,
    availableQuantity: 10,
    deposit: 10000,
    description:
      "축구공, 농구공, 배구공, 배드민턴 세트 등 다양한 운동 기구를 대여할 수 있습니다.",
  },
];

// 카테고리 목록
const categories = ["전체", "전자기기", "가구", "생활용품", "스포츠"];

export function RentalList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [showRentalForm, setShowRentalForm] = useState(false);

  // 필터링된 물품 목록
  const filteredItems = rentalItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "전체" || item.category === selectedCategory;
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // 대여 신청 폼
  const RentalForm = () => {
    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [phone, setPhone] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [purpose, setPurpose] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // 실제로는 여기서 API 호출 등의 처리를 해야 함
      alert(
        "대여 신청이 완료되었습니다. 학생회 담당자가 확인 후 연락드릴 예정입니다."
      );
      setShowRentalForm(false);
      setSelectedItem(null);

      // 폼 초기화
      setName("");
      setStudentId("");
      setPhone("");
      setQuantity(1);
      setStartDate("");
      setEndDate("");
      setPurpose("");
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">물품 대여 신청</h3>
            <button
              onClick={() => setShowRentalForm(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {selectedItem && (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden mr-4">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-medium">{selectedItem.name}</h4>
                  <p className="text-sm text-gray-500">
                    {selectedItem.availableQuantity}개 대여 가능 / 보증금{" "}
                    {selectedItem.deposit.toLocaleString()}원
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      이름
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="studentId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      학번
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="학번을 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    연락처
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="010-0000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      수량
                    </label>
                    <select
                      id="quantity"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {Array.from(
                        { length: selectedItem.availableQuantity },
                        (_, i) => i + 1
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num}개
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      대여 시작일
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      반납 예정일
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="purpose"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    대여 목적
                  </label>
                  <textarea
                    id="purpose"
                    rows={3}
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="대여 목적을 자세히 기재해주세요"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    * 대여 시 보증금 {selectedItem.deposit.toLocaleString()}원이
                    필요하며, 반납 시 환불됩니다. <br />
                    * 대여는 최대 7일까지 가능합니다. <br />* 파손 또는 분실 시
                    보증금에서 차감될 수 있습니다.
                  </p>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowRentalForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      신청하기
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* 필터 및 검색 */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 검색 */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                검색
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="물품명 또는 설명으로 검색"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리
              </label>
              <select
                id="category"
                className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 물품 목록 */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full 
                      ${
                        item.availableQuantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.availableQuantity > 0 ? "대여 가능" : "대여 불가"}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.availableQuantity}/{item.totalQuantity}개
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-gray-600">
                      보증금:{" "}
                      <span className="font-semibold">
                        {item.deposit.toLocaleString()}원
                      </span>
                    </span>
                    <button
                      onClick={() => {
                        if (item.availableQuantity > 0) {
                          setSelectedItem(item);
                          setShowRentalForm(true);
                        }
                      }}
                      disabled={item.availableQuantity === 0}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          item.availableQuantity > 0
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      대여 신청
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-gray-500 text-xl font-medium">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-400 mt-2">
              다른 검색어나 필터를 사용해 보세요.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("전체");
                setSearchTerm("");
              }}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* 문의 안내 */}
        <div className="mt-16 bg-indigo-50 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-indigo-800 mb-3">대여 문의</h3>
          <p className="text-indigo-700 mb-4">
            물품 대여에 대해 궁금한 점이 있으시면 아래로 문의해주세요.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-indigo-600 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-indigo-700">
                student_council@pusan.ac.kr
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-indigo-600 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-indigo-700">051-123-4567</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-indigo-600 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              <span className="text-indigo-700">
                카카오톡 채널: @pnu_student_council
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 대여 신청 폼 모달 */}
      {showRentalForm && <RentalForm />}
    </section>
  );
}
