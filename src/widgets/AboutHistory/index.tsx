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
  },
];

export function AboutHistory() {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* 배경 요소 */}
      <div className="absolute -right-20 bottom-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -left-20 top-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>

      <div className="container-custom relative">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4"
          >
            연혁
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-dark mb-6"
          >
            학생회 <span className="text-primary">발자취</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            정보의생명공학대학 학생회가 걸어온 길과 이루어낸 성과들을
            소개합니다.
          </motion.p>
        </div>

        {/* 타임라인 */}
        <div className="relative">
          {/* 중앙 선 */}
          {/* <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div> */}

          <div className="space-y-12">
            {historyData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="relative"
              >
                <div
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* 년도 표시 - 모바일에서는 항상 위에 표시 */}
                  <div className="mb-4 md:mb-0 md:w-1/2 flex md:justify-center md:items-center">
                    <div
                      className={`
                      text-center px-4 py-2 rounded-full bg-white shadow-lg text-dark font-bold text-xl
                      md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:z-10
                      flex items-center
                    `}
                    >
                      <span>{item.year}</span>
                    </div>
                  </div>

                  {/* 내용 */}
                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                      <h3 className="text-xl font-bold text-dark mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>

                      <div className="space-y-2">
                        <h4 className="font-medium text-dark">주요 성과:</h4>
                        <ul className="space-y-1">
                          {item.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="text-center mt-16">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
          >
            전체 연혁 보기
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
