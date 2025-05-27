import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// 학생회 활동 데이터
const activitiesData = [
  {
    title: "신입생 환영회",
    description:
      "새로운 학기를 맞이하여 신입생들을 위한 환영 행사를 개최합니다. 선배들과의 만남을 통해 학교 생활에 빠르게 적응할 수 있도록 돕습니다.",
    image: "/images/activity1.jpg",
    category: "행사",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-400/20 to-cyan-400/20",
  },
  {
    title: "학술 세미나",
    description:
      "정보의생명공학 분야의 최신 트렌드와 연구 성과를 공유하는 학술 세미나를 정기적으로 개최합니다.",
    image: "/images/activity2.jpg",
    category: "학술",
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-400/20 to-teal-400/20",
  },
  {
    title: "취업 박람회",
    description:
      "학생들의 진로 탐색과 취업 준비를 위한 박람회를 개최하여 다양한 기업과 연결하는 기회를 제공합니다.",
    image: "/images/activity3.jpg",
    category: "진로",
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-400/20 to-violet-400/20",
  },
  {
    title: "체육대회",
    description:
      "학과 간 친목 도모와 건강한 대학 생활을 위한 체육대회를 개최합니다.",
    image: "/images/activity4.jpg",
    category: "친목",
    color: "from-orange-500 to-amber-500",
    bgColor: "from-orange-400/20 to-amber-400/20",
  },
  {
    title: "봉사활동",
    description:
      "지역 사회와 함께하는 다양한 봉사활동을 통해 사회적 책임을 실천합니다.",
    image: "/images/activity5.jpg",
    category: "봉사",
    color: "from-rose-500 to-pink-500",
    bgColor: "from-rose-400/20 to-pink-400/20",
  },
  {
    title: "간담회",
    description:
      "학생들의 의견을 수렴하고 학과 발전을 위한 정기 간담회를 개최합니다.",
    image: "/images/activity6.jpg",
    category: "소통",
    color: "from-indigo-500 to-blue-500",
    bgColor: "from-indigo-400/20 to-blue-400/20",
  },
];

export function AboutActivities() {
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
            <div className="w-2 h-2 bg-gradient-to-r from-secondary to-tertiary rounded-full animate-pulse"></div>
            <span className="text-secondary font-semibold text-sm korean-text">
              주요 활동
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
            <span className="bg-gradient-to-r from-secondary to-tertiary bg-clip-text text-transparent">
              활동 소개
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed korean-text px-4"
          >
            정보의생명공학대학 학생회는 학우들의 대학 생활을 더욱 풍요롭게
            <br className="hidden sm:block" />
            만들기 위해 다양한 활동을 진행하고 있습니다.
          </motion.p>
        </div>

        {/* 활동 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {activitiesData.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 },
              }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
            >
              {/* 배경 그라디언트 효과 */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={`absolute w-32 h-32 -top-16 -right-16 bg-gradient-to-br ${activity.bgColor} rounded-full blur-2xl group-hover:blur-xl transition-all duration-500`}
                ></div>
              </div>

              <div className="relative h-48 sm:h-56 overflow-hidden">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${activity.color} shadow-lg`}
                  >
                    {activity.category}
                  </span>
                </div>
              </div>

              <div className="relative p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-secondary transition-colors korean-text leading-tight">
                  {activity.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed korean-text">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 참여 유도 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative bg-gradient-to-r from-secondary to-tertiary rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden"
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
                  학생회 활동에 참여하세요!
                </h3>
                <p className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl korean-text">
                  정보의생명공학대학 학생회는 항상 새로운 아이디어와 열정적인
                  참여를 환영합니다.
                  <br className="hidden sm:block" />
                  다양한 행사와 활동에 참여하고 싶거나, 학생회 활동에 관심이
                  있다면 언제든지 연락해주세요.
                </p>
              </div>

              <div className="flex-shrink-0 w-full lg:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/95 backdrop-blur-sm text-secondary py-3 px-6 rounded-xl font-semibold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl w-full lg:w-auto korean-text"
                >
                  참여 문의하기
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
