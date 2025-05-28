import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRentalItems } from "../../shared/services/hooks";
import {
  rentalApplicationService,
  FirestoreRentalApplication,
} from "../../shared/services/firestore";

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

export function RentalList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedCampus, setSelectedCampus] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<
    string | null
  >(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rentalApplications, setRentalApplications] = useState<
    FirestoreRentalApplication[]
  >([]);
  const [isLoadingRentals, setIsLoadingRentals] = useState(false);

  const { data: rentals = [], isLoading: loading, error } = useRentalItems();

  // 실제 대여 기록과 사용자 정보 로드
  React.useEffect(() => {
    const loadRentalData = async () => {
      setIsLoadingRentals(true);
      try {
        const applicationsData =
          await rentalApplicationService.getAllApplications();
        setRentalApplications(applicationsData);
      } catch (error) {
        console.error("대여 데이터 로드 오류:", error);
      } finally {
        setIsLoadingRentals(false);
      }
    };

    loadRentalData();
  }, []);

  // 대여 중인 물품들 직접 가져오기
  const getRentedItemsForCategory = (category: string, campus?: string) => {
    // 해당 카테고리의 대여 중인 물품들 필터링
    let rentedItems = rentals.filter(
      (item) => item.category === category && item.status === "rented"
    );

    // 캠퍼스 필터링
    if (campus && campus !== "전체") {
      const campusKey = campus === "양산캠퍼스" ? "yangsan" : "jangjeom";
      rentedItems = rentedItems.filter((item) => item.campus === campusKey);
    }

    // 각 대여 중인 물품에 대한 대여 정보 찾기
    const rentedItemsWithInfo = rentedItems.map((item) => {
      // 해당 물품의 현재 대여 신청 찾기
      const currentRental = rentalApplications.find(
        (app) =>
          app.itemId === item.id && ["rented", "overdue"].includes(app.status)
      );

      if (currentRental) {
        const rentDate = new Date(currentRental.rentDate);
        const dueDate = new Date(currentRental.dueDate);
        const now = new Date();
        const overdueDays =
          now > dueDate
            ? Math.ceil(
                (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
              )
            : 0;

        return {
          id: item.id,
          itemName: item.name,
          itemImage: item.image,
          itemLocation: item.location,
          renterName: currentRental.studentName,
          renterStudentId: currentRental.studentId,
          rentDate,
          dueDate,
          status: overdueDays > 0 ? "overdue" : "rented",
          campus: item.campus,
          overdueDays: overdueDays > 0 ? overdueDays : undefined,
        };
      }

      // 대여 신청 정보가 없는 경우 (데이터 불일치)
      return {
        id: item.id,
        itemName: item.name,
        itemImage: item.image,
        itemLocation: item.location,
        renterName: "정보 없음",
        renterStudentId: "정보 없음",
        rentDate: new Date(),
        dueDate: new Date(),
        status: "rented" as const,
        campus: item.campus,
        dataInconsistency: true, // 데이터 불일치 표시
      };
    });

    return rentedItemsWithInfo;
  };

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

  // 상세 모달 컴포넌트
  const DetailModal = () => {
    if (!selectedCategoryForModal) return null;

    // 선택된 카테고리의 대여 중인 물품들 가져오기
    const categoryRentalRecords = getRentedItemsForCategory(
      selectedCategoryForModal,
      selectedCampus
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowDetailModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200/60 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 korean-text truncate">
                {selectedCategoryForModal} 상세 현황
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 korean-text mt-1">
                {selectedCampus} • 총 {selectedCategoryItems.length}개 물품 •
                대여 중 {categoryRentalRecords.length}개
              </p>
            </div>
            <motion.button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors ml-2 flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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

          <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)]">
            {/* 캠퍼스 필터 */}
            <div className="p-4 sm:p-6 border-b border-gray-200/60">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {campuses.map((campus) => (
                  <motion.button
                    key={campus}
                    onClick={() => setSelectedCampus(campus)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 korean-text ${
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

            {/* 현재 대여 기록 */}
            {categoryRentalRecords.length > 0 ? (
              <div className="p-4 sm:p-6 border-b border-gray-200/60">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 korean-text flex items-center">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full mr-2 sm:mr-3"></span>
                  현재 대여 중인 물품 ({categoryRentalRecords.length}개)
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  {categoryRentalRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-200/60"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        {/* 물품 이미지 */}
                        <div className="relative w-full h-32 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={record.itemImage}
                            alt={record.itemName}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* 대여 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                            <h5 className="font-semibold text-gray-900 korean-text text-sm sm:text-base">
                              {record.itemName}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium korean-text ${
                                  record.status === "rented"
                                    ? "bg-blue-100 text-blue-700"
                                    : record.status === "overdue"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {record.status === "rented"
                                  ? "대여 중"
                                  : record.status === "overdue"
                                  ? "연체"
                                  : "상태 불명"}
                              </span>
                              {record.status === "overdue" &&
                                record.overdueDays && (
                                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full animate-pulse">
                                    ⚠️ {record.overdueDays}일 연체
                                  </span>
                                )}
                              {record.dataInconsistency && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                  ⚠️ 데이터 불일치
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 text-xs sm:text-sm text-gray-600 korean-text">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-800">
                                대여자 정보
                              </p>
                              <p>이름: {record.renterName}</p>
                              <p>학번: {record.renterStudentId}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-gray-800">
                                대여 정보
                              </p>
                              {!record.dataInconsistency ? (
                                <>
                                  <p>
                                    대여일:{" "}
                                    {record.rentDate.toLocaleDateString(
                                      "ko-KR"
                                    )}{" "}
                                    {record.rentDate.toLocaleTimeString(
                                      "ko-KR",
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </p>
                                  <p
                                    className={
                                      record.status === "overdue"
                                        ? "text-red-600 font-semibold"
                                        : ""
                                    }
                                  >
                                    반납 예정일:{" "}
                                    {record.dueDate.toLocaleDateString("ko-KR")}{" "}
                                    {record.dueDate.toLocaleTimeString(
                                      "ko-KR",
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </p>
                                </>
                              ) : (
                                <p className="text-yellow-600">
                                  대여 신청 정보를 찾을 수 없습니다
                                </p>
                              )}
                              <p>
                                캠퍼스:{" "}
                                {record.campus === "yangsan"
                                  ? "양산캠퍼스"
                                  : "장전캠퍼스"}
                              </p>
                              <p>보관 위치: {record.itemLocation}</p>
                            </div>
                          </div>

                          {/* 연체 경고 */}
                          {record.status === "overdue" && (
                            <div className="mt-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-700 text-xs sm:text-sm font-medium korean-text">
                                ⚠️ 반납 기한이 {record.overdueDays}일
                                지났습니다. 즉시 반납해주세요.
                              </p>
                              <p className="text-red-600 text-xs korean-text mt-1">
                                연체 시 벌점이 부과되며, 추가 대여가 제한될 수
                                있습니다.
                              </p>
                            </div>
                          )}

                          {/* 데이터 불일치 경고 */}
                          {record.dataInconsistency && (
                            <div className="mt-3 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-yellow-700 text-xs sm:text-sm font-medium korean-text">
                                ⚠️ 물품은 대여 중 상태이지만 대여 신청 정보가
                                없습니다.
                              </p>
                              <p className="text-yellow-600 text-xs korean-text mt-1">
                                관리자에게 문의하여 데이터를 확인해주세요.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 border-b border-gray-200/60">
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-gray-900 korean-text mb-2">
                    현재 대여 중인 물품이 없습니다
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 korean-text">
                    모든 {selectedCategoryForModal} 물품이 반납되었습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 로딩 상태
  if (loading || isLoadingRentals) {
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

      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent korean-text mb-3 sm:mb-4">
            물품 대여 현황
          </h2>
          <p className="text-base sm:text-lg text-gray-600 korean-text max-w-2xl mx-auto px-4">
            카테고리별 물품 현황을 확인하고 상세 정보를 조회하세요
          </p>
        </motion.div>

        {/* 필터 및 검색 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-12 bg-white/90 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg border border-white/60"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* 검색 */}
            <div className="w-full">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3 korean-text"
              >
                카테고리 검색
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="카테고리명으로 검색..."
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm korean-text text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3 korean-text">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 korean-text ${
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
            className="text-center py-12 sm:py-16"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 sm:p-8 max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-3 sm:mb-4"
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
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 korean-text">
                검색 결과가 없습니다
              </h3>
              <p className="text-sm sm:text-base text-gray-600 korean-text">
                다른 조건으로 검색해보세요.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
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
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6 border-b border-gray-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 korean-text group-hover:text-primary transition-colors duration-300">
                      {stat.category}
                    </h3>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">
                        {stat.total}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 korean-text">
                    총 {stat.total}개 물품
                  </p>
                </div>

                {/* 통계 정보 */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {/* 상태별 통계 */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 korean-text">
                        상태별 현황
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full mr-2"></div>
                            <span className="text-xs sm:text-sm text-gray-600 korean-text">
                              대여 가능
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-emerald-600">
                            {stat.available}개
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full mr-2"></div>
                            <span className="text-xs sm:text-sm text-gray-600 korean-text">
                              대여 중
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-orange-600">
                            {stat.rented}개
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-500 rounded-full mr-2"></div>
                            <span className="text-xs sm:text-sm text-gray-600 korean-text">
                              정비 중
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-600">
                            {stat.maintenance}개
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 캠퍼스별 통계 */}
                    <div className="border-t border-gray-200/60 pt-3 sm:pt-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 korean-text">
                        캠퍼스별 현황
                      </h4>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-xs sm:text-sm text-gray-600 korean-text">
                              양산캠퍼스
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-blue-600">
                            {stat.yangsan}개
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-xs sm:text-sm text-gray-600 korean-text">
                              장전캠퍼스
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-purple-600">
                            {stat.jangjeom}개
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 상세보기 버튼 */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/60">
                    <div className="flex items-center justify-center text-primary text-xs sm:text-sm font-medium korean-text group-hover:text-secondary transition-colors duration-300">
                      <span>상세보기</span>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
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
          className="mt-12 sm:mt-16 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/60 p-4 sm:p-6 lg:p-8"
        >
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2 korean-text">
              물품 대여 신청 안내
            </h3>
            <p className="text-sm sm:text-base text-blue-700 korean-text mb-3 sm:mb-4">
              물품 대여를 원하시면 별도의 대여 신청 페이지를 이용해주세요.
            </p>
            <motion.a
              href="/rental-application"
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg korean-text text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
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
