import React from "react";
import { motion } from "framer-motion";

export function RentalHero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800">
      {/* 배경 그래픽 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        {/* 물품 아이콘 패턴 */}
        <div className="absolute top-1/4 left-1/4 text-white/5 text-[200px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M5 8h14M5 8a2 2 0 100-4 2 2 0 000 4zm0 0v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0h14"
            />
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-white/5 text-[150px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            학생회 <span className="text-indigo-200">물품 대여</span> 서비스
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            정보의생명공학대학 학생회에서는 학우 여러분의 편의를 위해 다양한
            물품을 대여해드리고 있습니다. 필요한 물품을 확인하고 간편하게
            신청하세요. (추후 지원 예정)
          </motion.p>

          {/* 대여 안내 */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              대여 이용 안내
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-3 mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                <div>
                  <h4 className="font-medium text-white">대여 기간</h4>
                  <p className="text-sm text-white/80">
                    최대 7일까지 대여 가능
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-3 mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">대여 장소</h4>
                  <p className="text-sm text-white/80">
                    학생회실 (공학관 309호)
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white/20 rounded-full p-3 mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                <div>
                  <h4 className="font-medium text-white">운영 시간</h4>
                  <p className="text-sm text-white/80">평일 10:00 ~ 17:00</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 스크롤 표시기 */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-sm mb-2 text-white/70">
          아래로 스크롤하여 대여 가능한 물품 확인
        </p>
        <motion.div
          className="w-1 h-8 bg-white/20 rounded-full relative overflow-hidden"
          animate={{
            backgroundColor: [
              "rgba(255,255,255,0.2)",
              "rgba(255,255,255,0.5)",
              "rgba(255,255,255,0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="absolute top-0 left-0 right-0 h-full bg-indigo-300"
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
