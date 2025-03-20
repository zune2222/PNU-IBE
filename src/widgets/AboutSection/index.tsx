import React from "react";
import { motion } from "framer-motion";

// 학생회 가치 데이터
const values = [
  {
    id: 1,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "학생 중심",
    description:
      "모든 결정과 활동에서 학생들의 필요와 의견을 최우선으로 고려합니다.",
    color: "#00BFFF",
    delay: 0,
  },
  {
    id: 2,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
      </svg>
    ),
    title: "정의와 공정",
    description:
      "모든 학생이 공정하게 대우받고, 정의로운 학교 환경을 만들기 위해 노력합니다.",
    color: "#87CEFA",
    delay: 0.1,
  },
  {
    id: 3,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "소통과 협력",
    description:
      "학생회는 학생들과 학교 사이의 다리 역할을 하며, 원활한 소통과 협력을 추구합니다.",
    color: "#ADD8E6",
    delay: 0.2,
  },
];

export function AboutSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23485493' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4"
          >
            우리의 핵심 가치
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-6 tracking-tight"
          >
            학생회 <span className="text-primary">&ldquo;정의&rdquo;</span>가
            추구하는 가치
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            정보의생명공학대학 학생들의 더 나은 대학 생활을 위해 다음과 같은
            핵심 가치를 추구합니다.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
          {values.map((value) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                delay: value.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:translate-y-[-5px]">
                <div
                  className="h-2"
                  style={{ backgroundColor: value.color }}
                ></div>
                <div className="p-8">
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded-full mb-6 text-white"
                    style={{ backgroundColor: value.color }}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-dark mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>

                {/* 장식적 요소 */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                  <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: value.color }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 통계 섹션 추가 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-dark/10 rounded-3xl"></div>
          <div className="relative py-16 px-8 rounded-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Stat number="2대" label="현 학생회" />
              <Stat number="1,200+" label="재학생" />
              <Stat number="15+" label="학과 행사" />
              <Stat number="100%" label="학생 참여율" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 100,
          delay: Math.random() * 0.3,
        }}
      >
        <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
          {number}
        </div>
        <div className="text-gray-600">{label}</div>
      </motion.div>
    </div>
  );
}
