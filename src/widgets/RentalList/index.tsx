import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FirestoreRentalItem } from "../../shared/services/firestore";
import { useRentalItems } from "../../shared/services/hooks";

// 카테고리 목록
const categories = ["전체", "전자기기", "가구", "생활용품", "스포츠"];

// 상태 목록
const statuses = ["전체", "대여 가능", "대여 중", "점검 중"];

export function RentalList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<FirestoreRentalItem | null>(
    null
  );
  const [showRentalForm, setShowRentalForm] = useState(false);
  const { data: rentals = [], isLoading: loading, error } = useRentalItems();

  // 필터링된 물품 목록
  const filteredItems = rentals.filter((item) => {
    // 카테고리 필터링
    const categoryMatch =
      selectedCategory === "전체" || item.category === selectedCategory;

    // 상태 필터링
    const statusMatch =
      selectedStatus === "전체" ||
      (selectedStatus === "대여 가능" && item.status === "available") ||
      (selectedStatus === "대여 중" && item.status === "rented") ||
      (selectedStatus === "점검 중" && item.status === "maintenance");

    // 검색어 필터링
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && statusMatch && searchMatch;
  });

  // 대여 신청 폼
  const RentalForm = () => {
    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [phone, setPhone] = useState("");
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
                    {selectedItem.status === "available"
                      ? "대여 가능"
                      : "대여 불가"}{" "}
                    -{" "}
                    {selectedItem.status === "maintenance"
                      ? "점검 중"
                      : selectedItem.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    연락처: {selectedItem.contact}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    * 대여 전 학생회 담당자와 연락 후 진행됩니다. <br />
                    * 대여는 최대 7일까지 가능합니다. <br />* 파손 또는 분실 시
                    배상 책임이 있습니다.
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

  // 로딩 상태
  if (loading) {
    return (
      <section className="py-20 sm:py-24 md:py-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
        <div className="container-custom relative z-10 px-6 sm:px-8 lg:px-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 korean-text">
                물품 정보를 불러오는 중...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <section className="py-20 sm:py-24 md:py-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
        <div className="container-custom relative z-10 px-6 sm:px-8 lg:px-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8">
              <svg
                className="mx-auto h-12 w-12 text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 korean-text">
                데이터 로드 실패
              </h3>
              <p className="text-gray-600 korean-text mb-4">
                물품 정보를 불러오는데 실패했습니다.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors korean-text"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-24 md:py-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
      {/* 배경 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/10 to-tertiary/10 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10 px-6 sm:px-8 lg:px-12">
        {/* 필터 및 검색 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 bg-white/90 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-white/60"
        >
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* 검색 */}
            <div className="w-full">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-700 mb-3 korean-text"
              >
                검색
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="물품명 또는 설명으로 검색..."
                  className="w-full px-5 py-4 pl-14 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm korean-text text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
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
              </div>
            </div>

            {/* 필터 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* 카테고리 필터 */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-3 korean-text">
                  카테고리
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 korean-text min-h-[44px] ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                          : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-gray-200 shadow-sm hover:shadow-md"
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 상태 필터 */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-3 korean-text">
                  상태
                </label>
                <div className="flex flex-wrap gap-3">
                  {statuses.map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 korean-text min-h-[44px] ${
                        selectedStatus === status
                          ? "bg-gradient-to-r from-secondary to-tertiary text-white shadow-lg shadow-secondary/25"
                          : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-gray-200 shadow-sm hover:shadow-md"
                      }`}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 물품 목록 */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8 max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 korean-text">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-600 korean-text">
                다른 조건으로 검색해보세요.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                {/* 이미지 섹션 */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* 상태 배지 */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm korean-text ${
                        item.status === "available"
                          ? "bg-emerald-100/90 text-emerald-700 border border-emerald-200"
                          : "bg-red-100/90 text-red-700 border border-red-200"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          item.status === "available"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {item.status === "available" ? "대여 가능" : "대여 불가"}
                    </span>
                  </div>

                  {/* 카테고리 배지 */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm border border-white/60 korean-text">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* 콘텐츠 섹션 */}
                <div className="p-6 sm:p-8">
                  {/* 제목과 상태 */}
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 korean-text group-hover:text-primary transition-colors duration-300">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="korean-text">
                        상태:{" "}
                        {item.status === "maintenance"
                          ? "점검 중"
                          : item.status}
                      </span>
                      <span className="korean-text">위치: {item.location}</span>
                    </div>
                  </div>

                  {/* 설명 */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 korean-text line-clamp-3">
                    {item.description}
                  </p>

                  {/* 액션 버튼 */}
                  <div className="flex justify-end">
                    <motion.button
                      onClick={() => {
                        if (item.status === "available") {
                          setSelectedItem(item);
                          setShowRentalForm(true);
                        }
                      }}
                      disabled={item.status !== "available"}
                      whileHover={
                        item.status === "available" ? { scale: 1.02 } : {}
                      }
                      whileTap={
                        item.status === "available" ? { scale: 0.98 } : {}
                      }
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 korean-text min-h-[44px] ${
                        item.status === "available"
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {item.status === "available" ? "대여 신청" : "대여 불가"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 문의 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 sm:mt-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 sm:p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 korean-text">
              대여 문의
            </h3>
            <p className="text-gray-600 korean-text">
              물품 대여에 대해 궁금한 점이 있으시면 아래로 문의해주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <div className="bg-gradient-to-br from-purple-500 to-violet-500 p-3 rounded-xl mb-3">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <span className="text-sm font-semibold text-gray-900 korean-text">
                카카오톡 오픈채팅
              </span>
              <span className="text-sm text-gray-600 mt-1">
                @pnu_ibe_rental
              </span>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900 korean-text">
                인스타그램
              </span>
              <span className="text-sm text-gray-600 mt-1">@pnu_ibe</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 대여 신청 폼 모달 */}
      {showRentalForm && <RentalForm />}
    </section>
  );
}
