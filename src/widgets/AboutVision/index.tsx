import React from "react";
import { motion } from "framer-motion";

const visionData = [
  {
    title: "소통하는 학생회",
    description: "학우들의 의견을 적극적으로 수렴하고, 투명하게 소통합니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
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
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "행동하는 학생회",
    description:
      "학우들의 권익을 위해 적극적으로 행동하고, 문제 해결에 앞장섭니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "from-green-400 to-green-600",
  },
  {
    title: "함께하는 학생회",
    description:
      "모든 학우들이 함께 성장하고 즐거운 대학 생활을 누릴 수 있도록 지원합니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
        />
      </svg>
    ),
    color: "from-purple-400 to-purple-600",
  },
];

export function AboutVision() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4"
          >
            비전 & 미션
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-dark mb-6"
          >
            정보의생명공학대학 학생회의{" "}
            <span className="text-primary">비전</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            우리는 모든 학우들의 권익을 보장하고, 함께 성장하는 대학 문화를
            만들기 위해 노력합니다. 학우들의 목소리에 귀 기울이고, 더 나은 대학
            생활을 위해 앞장서겠습니다.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visionData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6 text-primary">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl mt-16 overflow-hidden"
        >
          <div className="p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  우리의 목표
                </h3>
                <p className="text-white/90 max-w-2xl">
                  정보의생명공학대학 학생회 &ldquo;정의&rdquo;는 학우들의 행복한
                  대학 생활과 성공적인 미래를 위한 든든한 지원자가 되겠습니다.
                  학우들의 권익 보호, 다양한 학술 및 문화 활동 지원, 효과적인
                  소통 창구 역할을 통해 더 나은 학교를 만들기 위해 최선을
                  다하겠습니다.
                </p>
              </div>

              <div className="flex-shrink-0 w-full md:w-auto">
                <button className="bg-white text-primary py-3 px-6 rounded-lg font-medium hover:bg-white/90 transition-colors shadow-lg w-full md:w-auto">
                  활동 자세히 보기
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
