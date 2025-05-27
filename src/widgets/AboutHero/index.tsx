import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function AboutHero() {
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
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* 텍스트 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 lg:space-y-8"
          >
            {/* 상단 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
            >
              <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-semibold text-primary korean-text">
                학생회 소개
              </span>
            </motion.div>

            {/* 메인 제목 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight korean-text"
            >
              <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                함께하는{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  학생회
                </span>
                <br className="block sm:hidden" />
                <span className="hidden sm:inline">,</span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">
                  더 나은 미래
                </span>
                <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                  를 향해
                </span>
              </span>
            </motion.h1>

            {/* 설명 텍스트 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl korean-text"
            >
              부산대학교 정보의생명공학대학 제2대 학생회{" "}
              <span className="font-semibold text-primary">
                &apos;정의&apos;
              </span>
              는
              <br className="hidden sm:block" />
              모든 학우들의 권익을 대변하고, 더 나은 대학 생활을 만들기 위해
              <br className="hidden sm:block" />
              활동하고 있습니다. 학생들의 목소리에 귀 기울이며, 함께 성장하는
              <br className="hidden sm:block" />
              공동체를 지향합니다.
            </motion.p>

            {/* 통계 카드들 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 gap-4 sm:gap-6 pt-4"
            >
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-gradient-to-br from-primary to-secondary p-2.5 sm:p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-dark korean-text">
                      20+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 korean-text">
                      학생회원
                    </div>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="bg-gradient-to-br from-secondary to-tertiary p-2.5 sm:p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-dark korean-text">
                      10+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 korean-text">
                      연간 행사
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 이미지 섹션 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative lg:mt-0 mt-8"
          >
            {/* 메인 이미지 컨테이너 */}
            <div className="relative">
              {/* 배경 장식 요소들 */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-tertiary to-secondary rounded-2xl rotate-12 opacity-80"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl -rotate-12 opacity-80"></div>

              {/* 메인 이미지 */}
              <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                <Image
                  src="/images/student-council.jpg"
                  alt="부산대학교 정보의생명공학대학 학생회 단체 사진"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* 플로팅 카드 - 모바일 최적화 */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-4 -right-2 sm:-bottom-8 sm:-right-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 sm:p-6 z-20 w-[calc(100%-1rem)] max-w-[280px] sm:max-w-sm border border-white/50"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-gradient-to-br from-primary to-secondary p-2.5 sm:p-4 rounded-xl shadow-lg flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-8 sm:w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-dark font-bold text-sm sm:text-lg korean-text leading-tight">
                    학생 중심 운영
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm korean-text leading-relaxed mt-1">
                    학우들의 목소리를 최우선으로
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
