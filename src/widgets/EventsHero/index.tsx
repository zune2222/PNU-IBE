import React from "react";
import { motion } from "framer-motion";
import { useEvents } from "../../shared/services/hooks";

export function EventsHero() {
  const { data: events = [], isLoading } = useEvents();

  // 상태별 이벤트 개수 계산
  const ongoingCount = events.filter(
    (event) => event.status === "ongoing"
  ).length;
  const upcomingCount = events.filter(
    (event) => event.status === "upcoming"
  ).length;
  const completedCount = events.filter(
    (event) => event.status === "completed"
  ).length;

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
              행사 정보
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
                행사 정보
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
            정보의생명공학대학 학생회에서 주최하는 다양한 행사 정보를
            확인하세요.
            <br className="hidden sm:block" />
            학술행사부터 체육대회, 축제까지 모든 학생들이 참여할 수 있는
            <br className="hidden sm:block" />
            다채로운 행사를 소개합니다.
          </motion.p>

          {/* 이벤트 통계 카드들 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto px-4 sm:px-0"
          >
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    {isLoading ? "..." : ongoingCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    진행 중
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    {isLoading ? "..." : upcomingCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    예정
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-1 col-span-1">
              <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                <div className="bg-gradient-to-br from-purple-500 to-violet-500 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 mb-0 sm:mb-4 flex-shrink-0">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    {isLoading ? "..." : completedCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    완료
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
        transition={{ delay: 0.8, duration: 0.5 }}
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
