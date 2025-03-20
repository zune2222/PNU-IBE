import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* 배경 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary to-secondary"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>

      <div className="container-custom relative">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
                <span className="text-lg md:text-xl font-medium text-primary block mb-3">
                  학생회 소개
                </span>
                함께하는 <span className="text-primary">학생회</span>,<br />
                <span className="text-secondary">더 나은 미래</span>를 향해
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                부산대학교 정보의생명공학대학 제2대 학생회 '정의'는 모든
                학우들의 권익을 대변하고, 더 나은 대학 생활을 만들기 위해
                활동하고 있습니다. 학생들의 목소리에 귀 기울이며, 함께 성장하는
                공동체를 지향합니다.
              </p>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
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
                  <span className="text-lg text-dark font-medium">
                    20+ 학생회원
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-secondary"
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
                  <span className="text-lg text-dark font-medium">
                    10+ 연간 행사
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl transform rotate-3 scale-105"></div>
              <div className="overflow-hidden rounded-2xl shadow-xl border-8 border-white relative z-10">
                <Image
                  src="/images/student-council.jpg"
                  alt="부산대학교 정보의생명공학대학 학생회 단체 사진"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-lg p-4 z-20 max-w-xs">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-primary"
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
                  <div className="ml-4">
                    <h3 className="text-dark font-bold">학생 중심 운영</h3>
                    <p className="text-sm text-gray-600">
                      학우들의 목소리를 최우선으로
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
