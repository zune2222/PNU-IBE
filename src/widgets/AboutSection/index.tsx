import React, { useState, useEffect, useRef, useCallback } from "react";
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
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23485493' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 플로팅 배경 요소들 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-xl"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/20 text-primary font-semibold text-sm mb-4 shadow-lg"
          >
            우리의 핵심 가치
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark mb-4 sm:mb-6 tracking-wide px-4 korean-text"
          >
            학생회{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              &ldquo;정의&rdquo;
            </span>
            가 <br className="sm:hidden" />
            추구하는 가치
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg px-4 korean-text leading-relaxed"
          >
            정보의생명공학대학 학생들의 더 나은 대학 생활을 위해 다음과 같은
            핵심 가치를 추구합니다.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mt-12 sm:mt-16 md:mt-20 px-4 sm:px-0">
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
              <div className="relative bg-white/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:translate-y-[-8px] group-hover:bg-white/70">
                {/* 글래스모피즘 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent"></div>

                {/* 상단 그림자 효과 */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl sm:rounded-t-3xl"></div>

                {/* 하단 그림자 효과 */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 to-transparent rounded-b-2xl sm:rounded-b-3xl"></div>

                <div className="relative p-6 sm:p-8">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full sm:rounded-2xl mb-4 sm:mb-6 text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}dd 100%)`,
                    }}
                  >
                    <div className="scale-75 sm:scale-100">{value.icon}</div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-dark mb-3 sm:mb-4 leading-tight korean-text">
                    {value.title}
                  </h3>

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed korean-text">
                    {value.description}
                  </p>
                </div>

                {/* 장식적 요소 - 항상 보이도록 */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 sm:w-20 sm:h-20 opacity-20 group-hover:opacity-40 transition-all duration-500">
                  <div
                    className="w-full h-full rounded-full blur-xl"
                    style={{ backgroundColor: value.color }}
                  ></div>
                </div>

                {/* 글로우 효과 - 항상 보이도록 */}
                <div
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-xl"
                  style={{
                    background: `radial-gradient(circle at center, ${value.color}30, transparent 70%)`,
                  }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 통계 섹션 - 글래스모피즘 적용 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 sm:mt-28 md:mt-32 relative mx-4 sm:mx-0"
        >
          {/* 배경 그라디언트 효과 */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute w-[200px] h-[200px] -top-[100px] -left-[100px] bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute w-[200px] h-[200px] -bottom-[100px] -right-[100px] bg-purple-400/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative bg-white/40 backdrop-blur-lg border border-white/20 py-12 sm:py-16 px-6 sm:px-8 rounded-2xl sm:rounded-3xl shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
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
  const [displayValue, setDisplayValue] = useState("0");
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const startCountAnimation = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const numericPart = number.replace(/[^0-9]/g, "");
    const targetValue = parseInt(numericPart);
    const duration = 2000; // 2초로 늘림
    const frameRate = 60; // 60fps
    const totalFrames = (duration / 1000) * frameRate;
    let currentFrame = 0;

    const animate = () => {
      currentFrame++;

      // easeOutQuart 이징 함수로 부드러운 감속
      const progress = currentFrame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(targetValue * easeProgress);

      let formattedValue;
      if (number.includes("+")) {
        formattedValue = `${currentValue.toLocaleString()}+`;
      } else if (number.includes("%")) {
        formattedValue = `${currentValue}%`;
      } else if (number.includes("대")) {
        formattedValue = `${currentValue}대`;
      } else {
        formattedValue = currentValue.toLocaleString();
      }

      setDisplayValue(formattedValue);

      if (currentFrame < totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, number]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            // 랜덤 딜레이 후 시작
            setTimeout(() => {
              startCountAnimation();
            }, Math.random() * 500 + 300);
          }
        });
      },
      {
        threshold: 0.5, // 50% 보일 때 시작
        rootMargin: "0px 0px -50px 0px", // 약간 더 들어와야 시작
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasStarted, startCountAnimation]);

  useEffect(() => {
    startCountAnimation();
  }, [startCountAnimation]);

  return (
    <div className="text-center" ref={elementRef}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 100,
          delay: Math.random() * 0.3,
        }}
        style={{
          willChange: "transform, opacity",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <div
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1 sm:mb-2 drop-shadow-lg korean-text"
          style={{
            willChange: "contents",
            transform: "translate3d(0, 0, 0)",
          }}
        >
          {displayValue}
        </div>
        <div className="text-gray-700 text-sm sm:text-base font-medium korean-text">
          {label}
        </div>
      </motion.div>
    </div>
  );
}
