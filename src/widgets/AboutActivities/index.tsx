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
  },
  {
    title: "학술 세미나",
    description:
      "정보의생명공학 분야의 최신 트렌드와 연구 성과를 공유하는 학술 세미나를 정기적으로 개최합니다.",
    image: "/images/activity2.jpg",
    category: "학술",
  },
  {
    title: "취업 박람회",
    description:
      "학생들의 진로 탐색과 취업 준비를 위한 박람회를 개최하여 다양한 기업과 연결하는 기회를 제공합니다.",
    image: "/images/activity3.jpg",
    category: "진로",
  },
  {
    title: "체육대회",
    description:
      "학과 간 친목 도모와 건강한 대학 생활을 위한 체육대회를 개최합니다.",
    image: "/images/activity4.jpg",
    category: "친목",
  },
  {
    title: "봉사활동",
    description:
      "지역 사회와 함께하는 다양한 봉사활동을 통해 사회적 책임을 실천합니다.",
    image: "/images/activity5.jpg",
    category: "봉사",
  },
  {
    title: "간담회",
    description:
      "학생들의 의견을 수렴하고 학과 발전을 위한 정기 간담회를 개최합니다.",
    image: "/images/activity6.jpg",
    category: "소통",
  },
];

// 카테고리별 색상
const categoryColors: Record<string, string> = {
  행사: "bg-blue-500",
  학술: "bg-green-500",
  진로: "bg-purple-500",
  친목: "bg-orange-500",
  봉사: "bg-red-500",
  소통: "bg-cyan-500",
};

export function AboutActivities() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* 배경 요소 */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="container-custom relative">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-4"
          >
            주요 활동
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-dark mb-6"
          >
            학생회 <span className="text-secondary">활동 소개</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            정보의생명공학대학 학생회는 학우들의 대학 생활을 더욱 풍요롭게
            만들기 위해 다양한 활동을 진행하고 있습니다.
          </motion.p>
        </div>

        {/* 활동 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activitiesData.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                      categoryColors[activity.category]
                    }`}
                  >
                    {activity.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-secondary transition-colors">
                  {activity.title}
                </h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 참여 유도 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                학생회 활동에 참여하세요!
              </h3>
              <p className="text-gray-600 max-w-2xl">
                정보의생명공학대학 학생회는 항상 새로운 아이디어와 열정적인
                참여를 환영합니다. 다양한 행사와 활동에 참여하고 싶거나, 학생회
                활동에 관심이 있다면 언제든지 연락해주세요.
              </p>
            </div>

            <div className="flex-shrink-0">
              <button className="bg-secondary text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary/90 transition-colors shadow-lg">
                참여 문의하기
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
