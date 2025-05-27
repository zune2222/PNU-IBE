import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { event as gaEvent } from "../../shared/lib/analytics";
import {
  noticeService,
  FirestoreNotice,
} from "../../shared/services/firestore";
import { getCategoryColor } from "../../shared/data/noticeData";

export function NoticeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [notices, setNotices] = useState<FirestoreNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Firestore에서 공지사항 데이터 로드
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true);
        const noticesData = await noticeService.getAll();
        setNotices(noticesData);
        setError(null);
      } catch (err) {
        console.error("공지사항 로드 실패:", err);
        setError("공지사항을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  // 검색 및 필터링된 공지사항
  const filteredNotices = notices.filter((notice) => {
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
              <p className="text-gray-600 korean-text mb-4">{error}</p>
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
          className="mb-12"
        >
          {/* 데스크톱 테이블 뷰 */}
          <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
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
                      className="px-6 py-5 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider w-24 korean-text"
                    >
                      조회수
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/30">
                  {currentItems.map((notice, index) => {
                    // 전체 목록에서의 실제 순서 번호 계산
                    const displayNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <motion.tr
                        key={notice.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="hover:bg-white/80 cursor-pointer group transition-all duration-300"
                      >
                        <td className="px-6 py-6 whitespace-nowrap text-center relative">
                          <div className="relative">
                            <span
                              className={`inline-flex items-center justify-center h-10 w-10 rounded-full text-sm font-semibold transition-all duration-300 ${
                                notice.important
                                  ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110"
                                  : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-primary/20 group-hover:to-secondary/20 group-hover:text-primary group-hover:scale-110"
                              }`}
                            >
                              {displayNumber}
                            </span>
                            {notice.important && (
                              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div>
                            <Link
                              href={`/notice/${notice.id}`}
                              className="text-gray-900 font-semibold hover:text-primary transition-colors line-clamp-1 text-lg korean-text group-hover:text-primary"
                              onClick={() => handleNoticeClick(notice)}
                            >
                              {notice.important && (
                                <span className="inline-block mr-2 text-red-500 font-bold">
                                  [중요]
                                </span>
                              )}
                              {notice.title}
                            </Link>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-1 korean-text">
                              {notice.preview}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-center">
                          <span
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${getCategoryColor(
                              notice.category
                            )} group-hover:scale-105 transition-transform duration-300`}
                          >
                            {notice.category}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500 text-center korean-text">
                          {formatDate(notice.createdAt)}
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500 text-center">
                          <div className="flex items-center justify-center group-hover:text-primary transition-colors duration-300">
                            <svg
                              className="w-4 h-4 mr-1 text-gray-400 group-hover:text-primary transition-colors duration-300"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                              <path
                                fillRule="evenodd"
                                d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="korean-text">{notice.views}</span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden space-y-4 sm:space-y-6">
            {currentItems.map((notice, index) => {
              // 전체 목록에서의 실제 순서 번호 계산
              const displayNumber =
                (currentPage - 1) * itemsPerPage + index + 1;

              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-5 sm:p-6 hover:shadow-xl transition-all duration-300 group mx-2 sm:mx-0"
                >
                  <div className="flex items-start gap-4">
                    {/* 번호 아이콘 */}
                    <div className="flex-shrink-0 relative">
                      <span
                        className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl text-base font-bold transition-all duration-300 ${
                          notice.important
                            ? "bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110"
                            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-primary/20 group-hover:to-secondary/20 group-hover:text-primary group-hover:scale-110"
                        }`}
                      >
                        {displayNumber}
                      </span>
                      {notice.important && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                      )}
                    </div>

                    {/* 콘텐츠 */}
                    <div className="flex-1 min-w-0">
                      {/* 제목과 카테고리 */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Link
                          href={`/notice/${notice.id}`}
                          className="text-gray-900 font-bold hover:text-primary transition-colors text-lg korean-text group-hover:text-primary flex-1 leading-tight"
                          onClick={() => handleNoticeClick(notice)}
                        >
                          {notice.important && (
                            <span className="inline-block mr-2 text-red-500 font-bold">
                              [중요]
                            </span>
                          )}
                          <span className="line-clamp-2">{notice.title}</span>
                        </Link>
                        <span
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm flex-shrink-0 ${getCategoryColor(
                            notice.category
                          )} group-hover:scale-105 transition-transform duration-300`}
                        >
                          {notice.category}
                        </span>
                      </div>

                      {/* 미리보기 */}
                      <p className="text-sm text-gray-600 line-clamp-2 korean-text mb-4 leading-relaxed">
                        {notice.preview}
                      </p>

                      {/* 하단 정보 */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="korean-text font-medium">
                          {formatDate(notice.createdAt)}
                        </span>
                        <div className="flex items-center group-hover:text-primary transition-colors duration-300">
                          <svg
                            className="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-primary transition-colors duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                            <path
                              fillRule="evenodd"
                              d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="korean-text font-medium">
                            {notice.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 검색 결과가 없을 때 */}
          {filteredNotices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8 sm:p-12 max-w-md mx-auto">
                <svg
                  className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 korean-text">
                  검색 결과가 없습니다
                </h3>
                <p className="text-sm sm:text-base text-gray-500 korean-text">
                  다른 검색어나 카테고리를 시도해보세요.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <nav className="inline-flex items-center gap-2 rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border border-white/60 p-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:text-primary disabled:hover:text-gray-500"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 korean-text ${
                      currentPage === page
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg transform hover:scale-105"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:text-primary disabled:hover:text-gray-500"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </motion.div>
        )}

        {/* 글쓰기 버튼 */}
      </div>
    </section>
  );
}
