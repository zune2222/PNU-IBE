import React from "react";
import { motion } from "framer-motion";

export function ESportsHero() {
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
            <svg
              className="w-4 h-4 text-primary mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <span className="text-sm font-semibold text-primary korean-text">
              E-Sports 대회
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
              게임의{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                열정
              </span>
              <br className="block sm:hidden" />
              <span className="hidden sm:inline"> </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">
                승부
              </span>
              <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                를 펼쳐보세요
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
            부산대학교 정보의생명공학대학 학생회에서 주최하는 E-Sports 대회에
            참여하세요.
            <br className="hidden sm:block" />
            다양한 게임 종목으로 실력을 겨루고 새로운 친구들과 만나보세요!
            <br className="hidden sm:block" />
            <span className="font-semibold text-primary">
              참가와 관전 모두 즐거운
            </span>{" "}
            대회로 모든 학생이 함께할 수 있습니다.
          </motion.p>

          {/* 게임 종목 카드들 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto px-4 sm:px-0"
          >
            <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 mb-0 sm:mb-4 flex-shrink-0">
                  <img
                    src="/lol.svg"
                    alt="League of Legends"
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  />
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    League of Legends
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    문도 피구 (개인전)
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 mb-0 sm:mb-4 flex-shrink-0">
                  <img
                    src="https://pngimg.com/d/pubg_PNG55.png"
                    alt="PUBG"
                    className="w-12 h-12 sm:w-12 sm:h-12 md:w-12 md:h-12"
                  />
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    PUBG
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    스쿼드 (최대 4명)
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-1 col-span-1">
              <div className="flex flex-row sm:flex-col items-center sm:items-center gap-3 sm:gap-0">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 mb-0 sm:mb-4 flex-shrink-0">
                  <img
                    src="/fconline.svg"
                    alt="FIFA Online 4"
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  />
                </div>
                <div className="text-left sm:text-center flex-1 sm:flex-none">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-dark korean-text mb-0 sm:mb-1">
                    FC Online
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 korean-text">
                    개인전
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
