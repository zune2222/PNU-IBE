import React from "react";
import { motion } from "framer-motion";
import { useNotices, useImportantNotices } from "../../shared/services/hooks";

export function NoticeHero() {
  const { data: notices = [] } = useNotices();
  const { data: importantNotices = [] } = useImportantNotices();

  // 긴급 공지 수
  const urgentCount = importantNotices.length;

  // 일반 공지 수 (전체 - 중요)
  const regularCount = notices.length - urgentCount;

  // 전체 공지 수
  const totalCount = notices.length;

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      {/* 개선된 배경 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/20 to-tertiary/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* 상단 배지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-semibold text-primary korean-text">
              공지사항
            </span>
          </motion.div>

          {/* 메인 제목 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight korean-text mb-6"
          >
            <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
              학생회{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                공지사항
              </span>
            </span>
          </motion.h1>

          {/* 설명 텍스트 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto korean-text mb-12"
          >
            정보의생명공학대학 학생회의 중요 소식과 공지사항을 확인하세요.
            <br className="hidden sm:block" />
            학우 여러분께 항상 정확하고 빠른 정보를 전달하겠습니다.
          </motion.p>

          {/* 공지사항 통계 카드들 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto px-4 sm:px-0"
          >
            <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                <div className="bg-gradient-to-br from-red-500 to-pink-500 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 mb-0 sm:mb-4 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    {urgentCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    긴급 공지
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 mb-0 sm:mb-4 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white"
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
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    {regularCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    일반 공지
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 mb-0 sm:mb-4 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h10V5H4v2z"
                    />
                  </svg>
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    {totalCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    전체 공지
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 개선된 스크롤 표시기 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <p className="text-sm mb-3 text-gray-500 korean-text">
          스크롤하여 더 보기
        </p>
        <motion.div
          className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
          animate={{
            borderColor: ["#d1d5db", "#6366f1", "#d1d5db"],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-gradient-to-b from-primary to-secondary rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
