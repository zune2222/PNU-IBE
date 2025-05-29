import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const visionData = [
  {
    title: "소통하는 학생회",
    description: "학우들의 의견을 적극적으로 수렴하고, 투명하게 소통합니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 sm:h-10 sm:w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-400/20 to-cyan-400/20",
  },
  {
    title: "행동하는 학생회",
    description:
      "학우들의 권익을 위해 적극적으로 행동하고, 문제 해결에 앞장섭니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 sm:h-10 sm:w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-400/20 to-teal-400/20",
  },
  {
    title: "함께하는 학생회",
    description:
      "모든 학우들이 함께 성장하고 즐거운 대학 생활을 누릴 수 있도록 지원합니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 sm:h-10 sm:w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-400/20 to-pink-400/20",
  },
];

export function AboutVision() {
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
              비전 & 미션
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight korean-text"
          >
            정보의생명공학대학 학생회의{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              비전
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed korean-text px-4"
          >
            우리는 모든 학우들의 권익을 보장하고, 함께 성장하는 대학 문화를
            만들기 위해 노력합니다.
            <br className="hidden sm:block" />
            학우들의 목소리에 귀 기울이고, 더 나은 대학 생활을 위해
            앞장서겠습니다.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {visionData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 },
              }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* 배경 그라디언트 효과 */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={`absolute w-32 h-32 -top-16 -right-16 bg-gradient-to-br ${item.bgColor} rounded-full blur-2xl group-hover:blur-xl transition-all duration-500`}
                ></div>
              </div>

              <div className={`h-1 bg-gradient-to-r ${item.color}`}></div>

              <div className="relative p-6 sm:p-8">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  {item.icon}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 korean-text leading-tight">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed korean-text">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative bg-gradient-to-r from-primary to-secondary rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden"
        >
          {/* 배경 패턴 */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative p-6 sm:p-8 md:p-12 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 korean-text">
                  우리의 목표
                </h3>
                <p className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl korean-text">
                  정보의생명공학대학 학생회 &ldquo;정의&rdquo;는 학우들의 행복한
                  대학 생활과 성공적인 미래를 위한 든든한 지원자가 되겠습니다.
                  <br className="hidden sm:block" />
                  학우들의 권익 보호, 다양한 학술 및 문화 활동 지원, 효과적인
                  소통 창구 역할을 통해 더 나은 학교를 만들기 위해 최선을
                  다하겠습니다.
                </p>
              </div>

              <div className="flex-shrink-0 w-full lg:w-auto">
                <Link href="/events">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/95 backdrop-blur-sm text-primary py-3 px-6 rounded-xl font-semibold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl w-full lg:w-auto korean-text"
                  >
                    활동 자세히 보기
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
