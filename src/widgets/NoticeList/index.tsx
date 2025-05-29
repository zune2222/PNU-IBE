import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { event as gaEvent } from "../../shared/lib/analytics";
import { FirestoreNotice } from "../../shared/services/firestore";
import { getCategoryColor } from "../../shared/data/noticeData";
import { useNotices } from "../../shared/services/hooks";

export function NoticeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const { data: notices = [], isLoading: loading, error } = useNotices();
  const itemsPerPage = 5;

  // 중요 공지를 먼저 정렬하고 나머지는 날짜순으로 정렬
  const sortedNotices = React.useMemo(() => {
    return [...notices].sort((a, b) => {
      // 중요 공지를 먼저 보여줌
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;

      // 둘 다 중요 공지이거나 둘 다 일반 공지일 경우 날짜순으로 정렬
      const dateA =
        a.createdAt &&
        typeof a.createdAt === "object" &&
        "toDate" in a.createdAt
          ? (a.createdAt as { toDate: () => Date }).toDate()
          : new Date(a.createdAt as string | number | Date);
      const dateB =
        b.createdAt &&
        typeof b.createdAt === "object" &&
        "toDate" in b.createdAt
          ? (b.createdAt as { toDate: () => Date }).toDate()
          : new Date(b.createdAt as string | number | Date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [notices]);

  // 검색 및 필터링된 공지사항
  const filteredNotices = sortedNotices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "전체" || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 현재 페이지에 해당하는 공지사항만 필터링
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
  };

  // 공지사항 클릭 핸들러
  const handleNoticeClick = (notice: FirestoreNotice) => {
    // Google Analytics 이벤트 전송
    gaEvent({
      action: "click_notice",
      category: "notices",
      label: `${notice.id} - ${notice.title}`,
    });
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const categories = ["전체", "학사", "장학", "행사", "취업", "동아리"];

  // 날짜 포맷팅 함수
  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return "";

    // Firestore Timestamp 처리
    if (
      typeof timestamp === "object" &&
      timestamp !== null &&
      "toDate" in timestamp
    ) {
      const firestoreTimestamp = timestamp as { toDate: () => Date };
      return firestoreTimestamp.toDate().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    // 일반 Date 객체나 문자열 처리
    const date = new Date(timestamp as string | number | Date);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 korean-text">
                공지사항을 불러오는 중...
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
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
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
                공지사항을 불러오는데 실패했습니다.
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
    <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
      {/* 배경 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/10 to-tertiary/10 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
        {/* 검색 및 필터 섹션 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-12"
        >
          {/* 검색창 */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="공지사항 검색..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full py-4 sm:py-4 px-5 pl-12 sm:pl-14 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-white/60 shadow-lg korean-text text-base"
              />
              <svg
                className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white py-2 px-3 sm:px-4 rounded-xl text-sm font-semibold shadow-lg korean-text">
                {filteredNotices.length}개
              </div>
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 korean-text ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                    : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-white/60 shadow-sm hover:shadow-md"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 공지사항 목록 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 min-h-[600px]"
        >
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden min-h-[400px]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-5 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider w-16 korean-text"
                    >
                      번호
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider korean-text"
                    >
                      제목
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider w-24 korean-text"
                    >
                      분류
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider w-28 korean-text"
                    >
                      등록일
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider w-20 korean-text"
                    >
                      조회
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200/50">
                  {currentItems.length > 0 ? (
                    currentItems.map((notice) => (
                      <tr
                        key={notice.id}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <Link href={`/notice/${notice.id}`} legacyBehavior>
                          <a
                            className="contents"
                            onClick={() => handleNoticeClick(notice)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-center">
                                {notice.important ? (
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full text-red-700 font-bold text-xs korean-text">
                                    중요
                                  </span>
                                ) : (
                                  <span className="text-gray-500 korean-text">
                                    {filteredNotices.indexOf(notice) + 1}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <div className="text-sm font-medium text-gray-900 korean-text">
                                  {notice.title}
                                </div>
                                <div className="mt-1 text-xs text-gray-500 line-clamp-1 korean-text">
                                  {notice.preview}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                  notice.category
                                )}`}
                              >
                                {notice.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 korean-text">
                              {formatDate(notice.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 korean-text">
                              {notice.views}
                            </td>
                          </a>
                        </Link>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 text-center">
                        <div className="flex flex-col items-center justify-center min-h-[300px]">
                          <svg
                            className="w-12 h-12 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="text-gray-500 korean-text">
                            검색 결과가 없습니다.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden space-y-4 min-h-[600px]">
            {currentItems.length > 0 ? (
              currentItems.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notice/${notice.id}`}
                  className="block"
                  onClick={() => handleNoticeClick(notice)}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/50 p-4 transition-all"
                  >
                    <div className="flex items-center mb-2 gap-2">
                      {notice.important ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full text-red-700 font-bold text-xs korean-text">
                          중요
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-700 font-medium text-xs korean-text">
                          {filteredNotices.indexOf(notice) + 1}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ml-2 ${getCategoryColor(
                          notice.category
                        )}`}
                      >
                        {notice.category}
                      </span>
                      <span className="ml-auto text-xs text-gray-500 korean-text">
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1 korean-text">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1 korean-text">
                      {notice.preview}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 korean-text">
                      조회: {notice.views}
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/50">
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 korean-text">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mt-10"
          >
            <nav className="inline-flex shadow-sm rounded-lg overflow-hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium korean-text ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-blue-50 transition-colors"
                }`}
              >
                이전
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber =
                  currentPage > 3
                    ? currentPage - 2 + i < totalPages
                      ? currentPage - 2 + i
                      : totalPages - 4 + i
                    : i + 1;

                // 표시할 페이지의 범위 조정 (너무 많은 페이지가 있을 경우)
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    // 1, 2, 3, 4, 5를 보여줌
                    if (i >= 5) return null;
                  } else if (currentPage >= totalPages - 2) {
                    // 마지막 5개 페이지를 보여줌
                    const pageToShow = totalPages - 4 + i;
                    if (pageToShow <= 0) return null;
                    return pageToShow;
                  } else {
                    // 현재 페이지를 중심으로 -2 ~ +2를 보여줌
                    return currentPage - 2 + i;
                  }
                }

                return pageNumber;
              })
                .filter(Boolean)
                .map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum as number)}
                    className={`px-4 py-2 text-sm font-medium korean-text ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-50 transition-colors"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium korean-text ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-blue-50 transition-colors"
                }`}
              >
                다음
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </section>
  );
}
