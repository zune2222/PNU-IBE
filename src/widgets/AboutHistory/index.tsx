import React from "react";
import { motion } from "framer-motion";

// 학생회 연혁 데이터
const historyData = [
  {
    year: "2025",
    title: '제2대 학생회 "정의" 출범',
    description:
      '새로운 비전과 목표로 제2대 정보의생명공학대학 학생회 "정의"가 출범했습니다.',
    achievements: [
      "신입생 환영회 성공적 개최",
      "학과 간 교류 프로그램 확대",
      "동아리 지원 체계 개선",
    ],
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-400/20 to-cyan-400/20",
  },
  {
    year: "2024",
    title: '제1대 학생회 "정의" 출범',
    description:
      '정보의생명공학대학 첫 번째 학생회 "정의"가 출범하여 새로운 시작을 알렸습니다.',
    achievements: [
      "학생회 조직 체계 구축",
      "학생 복지 프로그램 도입",
      "단과대학 교류 행사 개최",
    ],
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-400/20 to-violet-400/20",
  },
];

export function AboutHistory() {
  return (
    <section className="relative py-20 sm:py-24 bg-white overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg mb-6"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
            <span className="text-primary font-semibold text-sm korean-text">
              연혁
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight korean-text"
          >
            학생회{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              발자취
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed korean-text px-4"
          >
            정보의생명공학대학 학생회가 걸어온 길과
            <br className="hidden sm:block" />
            이루어낸 성과들을 소개합니다.
          </motion.p>
        </div>

        {/* 타임라인 */}
        <div className="relative mb-16 sm:mb-20">
          {/* 중앙 선 - 데스크톱에서만 표시 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/30 to-secondary/30 hidden md:block"></div>

          <div className="space-y-8 sm:space-y-12">
            {historyData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                <div
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* 년도 표시 */}
                  <div className="mb-6 md:mb-0 md:w-1/2 flex md:justify-center md:items-center">
                    <div
                      className={`
                      relative px-6 py-3 rounded-2xl bg-gradient-to-r ${item.color} text-white font-bold text-lg sm:text-xl shadow-lg
                      md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:z-10
                      flex items-center justify-center min-w-[100px]
                    `}
                    >
                      <span className="korean-text">{item.year}</span>
                      {/* 중앙 점 표시 - 데스크톱에서만 */}
                      <div className="hidden md:block absolute inset-0 rounded-2xl border-4 border-white shadow-xl"></div>
                    </div>
                  </div>

                  {/* 내용 */}
                  <div
                    className={`md:w-1/2 w-full ${
                      index % 2 === 0 ? "md:pr-8 lg:pr-12" : "md:pl-8 lg:pl-12"
                    }`}
                  >
                    <motion.div
                      whileHover={{
                        y: -3,
                        transition: { duration: 0.3 },
                      }}
                      className="group relative bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                    >
                      {/* 배경 그라디언트 효과 */}
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <div
                          className={`absolute w-24 h-24 -top-12 -right-12 bg-gradient-to-br ${item.bgColor} rounded-full blur-2xl group-hover:blur-xl transition-all duration-500`}
                        ></div>
                      </div>

                      <div className="relative">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 korean-text leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed korean-text">
                          {item.description}
                        </p>

                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base korean-text flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} mr-2`}
                            ></div>
                            주요 성과
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {item.achievements.map((achievement, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.1 * i }}
                                className="flex items-start"
                              >
                                <div
                                  className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gradient-to-r ${item.color} flex-shrink-0 mr-3 mt-0.5 flex items-center justify-center`}
                                >
                                  <svg
                                    className="h-2 w-2 sm:h-3 sm:w-3 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span className="text-sm sm:text-base text-gray-700 korean-text leading-relaxed">
                                  {achievement}
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
