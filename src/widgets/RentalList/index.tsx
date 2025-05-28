import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FirestoreRentalItem } from "../../shared/services/firestore";
import { useRentalItems } from "../../shared/services/hooks";

// 카테고리 목록
const categories = [
  "전체",
  "우산",
  "충전기",
  "C타입선",
  "8핀선",
  "HDMI케이블",
  "멀티허브",
  "기타",
];

// 캠퍼스 목록
const campuses = ["전체", "양산캠퍼스", "장전캠퍼스"];

// 상태 한글 변환
const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "대여 가능";
    case "rented":
      return "대여 중";
    case "maintenance":
      return "정비 중";
    case "lost":
      return "분실";
    case "damaged":
      return "파손";
    default:
      return "알 수 없음";
  }
};

// 카테고리별 통계 인터페이스
interface CategoryStats {
  category: string;
  total: number;
  available: number;
  rented: number;
  maintenance: number;
  yangsan: number;
  jangjeom: number;
}

// 대여 기록 인터페이스 (실제로는 백엔드에서 가져와야 함)
interface RentalRecord {
  id: string;
  itemId: string;
  itemName: string;
  renterName: string;
  renterStudentId: string;
  rentDate: Date;
  dueDate: Date;
  status: "active" | "overdue" | "returned";
}

export function RentalList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedCampus, setSelectedCampus] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<
    string | null
  >(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data: rentals = [], isLoading: loading, error } = useRentalItems();

  // 카테고리별 통계 계산
  const categoryStats = useMemo(() => {
    const stats: CategoryStats[] = [];

    categories.slice(1).forEach((category) => {
      const categoryItems = rentals.filter(
        (item) => item.category === category
      );
      const yangsanItems = categoryItems.filter(
        (item) => item.campus === "yangsan"
      );
      const jangjeomItems = categoryItems.filter(
        (item) => item.campus === "jangjeom"
      );

      stats.push({
        category,
        total: categoryItems.length,
        available: categoryItems.filter((item) => item.status === "available")
          .length,
        rented: categoryItems.filter((item) => item.status === "rented").length,
        maintenance: categoryItems.filter(
          (item) => item.status === "maintenance"
        ).length,
        yangsan: yangsanItems.length,
        jangjeom: jangjeomItems.length,
      });
    });

    return stats;
  }, [rentals]);

  // 필터링된 카테고리 통계
  const filteredCategoryStats = useMemo(() => {
    let filtered = categoryStats;

    if (selectedCategory !== "전체") {
      filtered = filtered.filter((stat) => stat.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((stat) =>
        stat.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [categoryStats, selectedCategory, searchTerm]);

  // 선택된 카테고리의 상세 물품 목록
  const selectedCategoryItems = useMemo(() => {
    if (!selectedCategoryForModal) return [];

    let items = rentals.filter(
      (item) => item.category === selectedCategoryForModal
    );

    if (selectedCampus !== "전체") {
      const campusKey =
        selectedCampus === "양산캠퍼스" ? "yangsan" : "jangjeom";
      items = items.filter((item) => item.campus === campusKey);
    }

    return items;
  }, [rentals, selectedCategoryForModal, selectedCampus]);

  // 모의 대여 기록 데이터 (실제로는 백엔드에서 가져와야 함)
  const mockRentalRecords: RentalRecord[] = [
    {
      id: "1",
      itemId: "item1",
      itemName: "아이폰 충전기 #001",
      renterName: "김철수",
      renterStudentId: "202012345",
      rentDate: new Date("2024-01-15"),
      dueDate: new Date("2024-01-16"),
      status: "active",
    },
    {
      id: "2",
      itemId: "item2",
      itemName: "우산 #003",
      renterName: "이영희",
      renterStudentId: "202098765",
      rentDate: new Date("2024-01-14"),
      dueDate: new Date("2024-01-15"),
      status: "overdue",
    },
  ];

  // 상세 모달 컴포넌트
  const DetailModal = () => {
    if (!selectedCategoryForModal) return null;

    const categoryRentalRecords = mockRentalRecords.filter((record) =>
      selectedCategoryItems.some((item) =>
        item.name.includes(record.itemName.split(" #")[0])
      )
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowDetailModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200/60 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 korean-text">
                {selectedCategoryForModal} 상세 현황
              </h3>
              <p className="text-sm text-gray-600 korean-text mt-1">
                {selectedCampus} • 총 {selectedCategoryItems.length}개 물품
              </p>
            </div>
            <motion.button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* 캠퍼스 필터 */}
            <div className="p-6 border-b border-gray-200/60">
              <div className="flex flex-wrap gap-3">
                {campuses.map((campus) => (
                  <motion.button
                    key={campus}
                    onClick={() => setSelectedCampus(campus)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 korean-text ${
                      selectedCampus === campus
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {campus}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 물품 목록 */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 korean-text">
                물품 목록
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategoryItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 korean-text text-sm">
                          {item.name}
                        </h5>
                        <p className="text-xs text-gray-500 korean-text">
                          {item.campus === "yangsan"
                            ? "양산캠퍼스"
                            : "장전캠퍼스"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium korean-text ${
                          item.status === "available"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "rented"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {getStatusText(item.status)}
                      </span>
                      <span className="text-xs text-gray-500 korean-text">
                        {item.location}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 대여 기록 */}
            {categoryRentalRecords.length > 0 && (
              <div className="p-6 border-t border-gray-200/60">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 korean-text">
                  현재 대여 기록
                </h4>
                <div className="space-y-3">
                  {categoryRentalRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/60"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="font-medium text-gray-900 korean-text">
                              {record.itemName}
                            </h5>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium korean-text ${
                                record.status === "active"
                                  ? "bg-blue-100 text-blue-700"
                                  : record.status === "overdue"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {record.status === "active"
                                ? "대여 중"
                                : record.status === "overdue"
                                ? "연체"
                                : "반납 완료"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 korean-text">
                            <p>
                              대여자: {record.renterName} (
                              {record.renterStudentId})
                            </p>
                            <p>
                              대여일:{" "}
                              {record.rentDate.toLocaleDateString("ko-KR")}
                            </p>
                            <p>
                              반납 예정일:{" "}
                              {record.dueDate.toLocaleDateString("ko-KR")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
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
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-secondary/50"></div>
              </div>
              <motion.div
                className="text-lg font-medium text-gray-700 korean-text"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                물품 현황을 불러오는 중...
              </motion.div>
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
                물품 현황을 불러오는데 실패했습니다.
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
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/10 to-tertiary/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container-custom relative z-10 px-6 sm:px-8 lg:px-12">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent korean-text mb-4">
            물품 대여 현황
          </h2>
          <p className="text-lg text-gray-600 korean-text max-w-2xl mx-auto">
            카테고리별 물품 현황을 확인하고 상세 정보를 조회하세요
          </p>
        </motion.div>

        {/* 필터 및 검색 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-white/60"
        >
          <div className="flex flex-col gap-6">
            {/* 검색 */}
            <div className="w-full">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-700 mb-3 korean-text"
              >
                카테고리 검색
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="카테고리명으로 검색..."
                  className="w-full px-5 py-4 pl-14 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm korean-text text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
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

            {/* 카테고리 필터 */}
            <div>
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
                    className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 korean-text ${
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
          </div>
        </motion.div>

        {/* 카테고리별 통계 카드 */}
        {filteredCategoryStats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCategoryStats.map((stat, index) => (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer"
                onClick={() => {
                  setSelectedCategoryForModal(stat.category);
                  setShowDetailModal(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 카테고리 헤더 */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-gray-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 korean-text group-hover:text-primary transition-colors duration-300">
                      {stat.category}
                    </h3>
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {stat.total}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 korean-text">
                    총 {stat.total}개 물품
                  </p>
                </div>

                {/* 통계 정보 */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* 상태별 통계 */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 korean-text">
                        상태별 현황
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600 korean-text">
                              대여 가능
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-emerald-600">
                            {stat.available}개
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600 korean-text">
                              대여 중
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-orange-600">
                            {stat.rented}개
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600 korean-text">
                              정비 중
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-600">
                            {stat.maintenance}개
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 캠퍼스별 통계 */}
                    <div className="border-t border-gray-200/60 pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 korean-text">
                        캠퍼스별 현황
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600 korean-text">
                              양산캠퍼스
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-blue-600">
                            {stat.yangsan}개
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600 korean-text">
                              장전캠퍼스
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-purple-600">
                            {stat.jangjeom}개
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 상세보기 버튼 */}
                  <div className="mt-6 pt-4 border-t border-gray-200/60">
                    <div className="flex items-center justify-center text-primary text-sm font-medium korean-text group-hover:text-secondary transition-colors duration-300">
                      <span>상세보기</span>
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 안내 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/60 p-6 sm:p-8"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2 korean-text">
              물품 대여 신청 안내
            </h3>
            <p className="text-blue-700 korean-text mb-4">
              물품 대여를 원하시면 별도의 대여 신청 페이지를 이용해주세요.
            </p>
            <motion.a
              href="/rental-application"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg korean-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              대여 신청하기
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* 상세 모달 */}
      <AnimatePresence>{showDetailModal && <DetailModal />}</AnimatePresence>
    </section>
  );
}
