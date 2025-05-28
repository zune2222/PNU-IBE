import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// 학생회 구성원 데이터
const membersData = [
  {
    name: "신태일",
    position: "학생회장",
    department: "정보의생명공학대학",
    grade: "21학번",
    image: "/images/member1.jpg",
    quote: "모든 학우들의 목소리에 귀 기울이는 학생회가 되겠습니다.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "강재한",
    position: "부학생회장",
    department: "정보의생명공학대학",
    grade: "20학번",
    image: "/images/member2.jpg",
    quote: "학우들의 권익 향상을 위해 최선을 다하겠습니다.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "김혜은",
    position: "문화기획국장",
    department: "정보의생명공학대학",
    grade: "22학번",
    image: "/images/member3.jpg",
    quote: "다양한 문화 행사로 즐거운 대학 생활을 만들겠습니다.",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "서호영",
    position: "재정사무국장",
    department: "정보의생명공학대학",
    grade: "20학번",
    image: "/images/member4.jpg",
    quote: "투명한 재정 관리로 신뢰받는 학생회를 만들겠습니다.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "윤대한",
    position: "학생복지국장",
    department: "정보의생명공학대학",
    grade: "21학번",
    image: "/images/member5.jpg",
    quote: "학우들의 복지 향상을 위해 최선을 다하겠습니다.",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "이연지",
    position: "소통홍보국장",
    department: "정보의생명공학대학",
    grade: "22학번",
    image: "/images/member6.jpg",
    quote: "학생회의 활동을 널리 알리고 학우들과 소통하겠습니다.",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "손정훈",
    position: "총무",
    department: "정보의생명공학대학",
    grade: "23학번",
    image: "/images/member5.jpg",
    quote: "체계적인 행정 지원으로 학생회 활동을 뒷받침하겠습니다.",
    color: "from-slate-500 to-gray-500",
  },
];

// 학생회 조직도 데이터
const departments = [
  {
    name: "학생회장단",
    description: "학생회를 대표하고 전체적인 운영과 방향성을 결정",
    members: 2,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-6 sm:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    memberList: "회장: 신태일(21학번), 부회장: 강재한(20학번)",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-400/20 to-cyan-400/20",
  },
  {
    name: "소통홍보국",
    description: "학생회 활동 홍보 및 소통 창구 역할",
    members: 4,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-6 sm:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
        />
      </svg>
    ),
    memberList:
      "국장: 이연지(22학번), 국원: 설대연(25학번), 김현지(24학번), 박준이(21학번)",
    color: "from-violet-500 to-purple-500",
    bgColor: "from-violet-400/20 to-purple-400/20",
  },
  {
    name: "문화기획국",
    description: "다양한 문화 행사 기획 및 운영",
    members: 6,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-6 sm:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    memberList:
      "국장: 김혜은(22학번), 국원: 전동훈(21학번), 이현호(22학번), 현승민(22학번), 황보원(25학번), 허민(25학번)",
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-400/20 to-rose-400/20",
  },
  {
    name: "재정사무국",
    description: "학생회비 관리 및 재정 운영, 회계 담당",
    members: 6,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-6 sm:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    memberList:
      "국장: 서호영(20학번), 총무: 손정훈(23학번), 국원: 이나연(24학번), 홍지수(23학번), 우영지(25학번), 김도훈(25학번)",
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-400/20 to-teal-400/20",
  },
  {
    name: "학생복지국",
    description: "학생 복지 향상 및 편의 시설 관리",
    members: 5,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 sm:h-6 sm:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    memberList:
      "국장: 윤대한(21학번), 국원: 서완준(21학번), 박영주(21학번), 이지혜(25학번), 최지우(25학번)",
    color: "from-orange-500 to-amber-500",
    bgColor: "from-orange-400/20 to-amber-400/20",
  },
];

export function AboutMembers() {
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
              구성원 소개
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
              구성원
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed korean-text px-4"
          >
            정보의생명공학대학 학생회는 학우들의 더 나은 대학 생활을 위해
            <br className="hidden sm:block" />
            헌신하는 열정적인 구성원들로 이루어져 있습니다.
          </motion.p>
        </div>

        {/* 주요 구성원 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {membersData.map((member, index) => (
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
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src={member.image}
                  alt={`${member.name} - ${member.position}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold korean-text leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base korean-text">
                    {member.position}
                  </p>
                </div>
                {/* 그라데이션 장식 */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${member.color} opacity-20 blur-2xl`}
                ></div>
              </div>

              <div className="relative p-4 sm:p-6">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-xs sm:text-sm text-gray-600 korean-text">
                    {member.department}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}
                  >
                    {member.grade}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed korean-text">
                  &quot;{member.quote}&quot;
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 학생회 조직도 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-white/50"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center korean-text">
            학생회 조직도
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.3 },
                }}
                className="group relative bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* 배경 그라디언트 효과 */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div
                    className={`absolute w-24 h-24 -top-12 -right-12 bg-gradient-to-br ${dept.bgColor} rounded-full blur-2xl group-hover:blur-xl transition-all duration-500`}
                  ></div>
                </div>

                <div className="relative">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-white mr-3 sm:mr-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      {dept.icon}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 korean-text">
                      {dept.name}
                    </h4>
                  </div>

                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 flex-grow leading-relaxed korean-text">
                    {dept.description}
                  </p>

                  <div className="text-xs sm:text-sm text-gray-700 mt-2">
                    <p className="font-medium leading-relaxed korean-text">
                      {dept.memberList}
                    </p>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-500 flex items-center mt-3 sm:mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="korean-text">
                      {dept.members}명의 구성원
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
