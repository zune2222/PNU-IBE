import React from "react";
import { motion } from "framer-motion";

export function EventsHero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-primary/80 to-primary">
      {/* 배경 그래픽 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 top-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 bottom-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>

        {/* 원형 패턴 */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/10"
            style={{
              width: `${(i + 2) * 100}px`,
              height: `${(i + 2) * 100}px`,
              left: "calc(50% - " + (i + 2) * 50 + "px)",
              top: "calc(60% - " + (i + 2) * 50 + "px)",
            }}
          ></div>
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            학생회 <span className="text-tertiary">행사 정보</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            정보의생명공학대학 학생회에서 주최하는 다양한 행사 정보를
            확인하세요. 학술행사부터 체육대회, 축제까지 모든 학생들이 참여할 수
            있는 다채로운 행사를 소개합니다.
          </motion.p>

          {/* 이벤트 통계 */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-36">
              <h3 className="text-xl font-bold text-white mb-1">진행 중</h3>
              <p className="text-3xl font-bold text-tertiary">3</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-36">
              <h3 className="text-xl font-bold text-white mb-1">예정</h3>
              <p className="text-3xl font-bold text-tertiary">7</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-36">
              <h3 className="text-xl font-bold text-white mb-1">완료</h3>
              <p className="text-3xl font-bold text-tertiary">25</p>
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
        <p className="text-sm mb-2 text-white/70">스크롤하여 더 보기</p>
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
            className="absolute top-0 left-0 right-0 h-full bg-tertiary"
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
