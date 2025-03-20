import React from "react";
import { motion } from "framer-motion";

export function NoticeHero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* 배경 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
      <div className="absolute top-0 right-0 opacity-20">
        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="250" cy="250" r="250" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0"
              y1="0"
              x2="500"
              y2="500"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 opacity-20">
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="200" fill="url(#paint1_linear)" />
          <defs>
            <linearGradient
              id="paint1_linear"
              x1="0"
              y1="0"
              x2="400"
              y2="400"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">공지사항</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              정보의생명공학대학 학생회의 중요 소식과 공지사항을 확인하세요.
              학우 여러분께 항상 정확하고 빠른 정보를 전달하겠습니다.
            </p>
          </motion.div>

          {/* 검색창 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-lg mx-auto mt-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="공지사항 검색..."
                className="w-full py-3 px-6 pl-12 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary border border-white/20"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300"
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
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white py-1 px-4 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                검색
              </button>
            </div>
          </motion.div>

          {/* 키워드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 justify-center mt-6"
          >
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 hover:bg-white/20 cursor-pointer transition-colors">
              전체
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 hover:bg-white/20 cursor-pointer transition-colors">
              학사
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 hover:bg-white/20 cursor-pointer transition-colors">
              장학
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 hover:bg-white/20 cursor-pointer transition-colors">
              행사
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 hover:bg-white/20 cursor-pointer transition-colors">
              취업
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 hover:bg-white/20 cursor-pointer transition-colors">
              동아리
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
