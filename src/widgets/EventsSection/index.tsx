import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../shared/ui/Button";

const events = [
  {
    id: 1,
    title: "신입생 환영회",
    date: "2025년 3월 15일",
    time: "오후 2:00 - 5:00",
    location: "부산대학교 정보의생명공학관 강당",
    description:
      "신입생들을 위한 환영 행사입니다. 학과 소개와 선배들과의 만남을 통해 학교 생활에 빠르게 적응할 수 있는 시간을 가질 예정입니다.",
    image: "/images/event-welcome.jpg",
    gradient: "from-[#00BFFF] to-[#0077B6]",
    featured: true,
  },
  {
    id: 2,
    title: "학술 세미나",
    date: "2025년 4월 10일",
    time: "오후 3:30 - 6:00",
    location: "부산대학교 정보의생명공학관 세미나실",
    description:
      "정보의생명공학 분야의 최신 트렌드와 연구 성과를 공유하는 학술 세미나입니다. 관련 분야 전문가들의 강연이 예정되어 있습니다.",
    image: "/images/event-seminar.jpg",
    gradient: "from-[#87CEFA] to-[#4A6FA5]",
    featured: false,
  },
  {
    id: 3,
    title: "체육대회",
    date: "2025년 5월 20일",
    time: "오전 10:00 - 오후 4:00",
    location: "부산대학교 대운동장",
    description:
      "정보의생명공학대학 학생들이 함께하는 체육대회입니다. 다양한 경기와 이벤트를 통해 학과 간 친목을 도모할 수 있는 행사입니다.",
    image: "/images/event-sports.jpg",
    gradient: "from-[#485493] to-[#2C3968]",
    featured: false,
  },
  {
    id: 4,
    title: "취업 박람회",
    date: "2025년 9월 5일",
    time: "오전 11:00 - 오후 5:00",
    location: "부산대학교 대강당",
    description:
      "정보의생명공학 분야 기업들이 참여하는 취업 박람회입니다. 채용 정보 확인 및 현장 면접 기회가 제공됩니다.",
    image: "/images/event-career.jpg",
    gradient: "from-[#ADD8E6] to-[#5B8DA0]",
    featured: false,
  },
];

export function EventsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const featuredEvent = events.find((event) => event.featured);
  const regularEvents = events.filter((event) => !event.featured);

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute left-0 top-0 w-full h-64 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -right-20 top-40 w-80 h-80 rounded-full bg-dark/5 blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4"
          >
            일정 안내
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-dark mb-6 tracking-tight"
          >
            다가오는 <span className="text-primary">행사</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            정보의생명공학대학 학생회에서 준비한 다양한 행사에 참여해보세요.
          </motion.p>
        </div>

        {/* 피처드 이벤트 */}
        {featuredEvent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 mt-14"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-xl group">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${featuredEvent.gradient} opacity-90`}
              ></div>
              <div className="absolute inset-0 bg-black opacity-40"></div>

              <div className="relative p-8 md:p-12 z-10 flex flex-col h-full text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                  <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
                    주요 행사
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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
                    <span>
                      {featuredEvent.date} • {featuredEvent.time}
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-300">
                  {featuredEvent.title}
                </h3>

                <div className="mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{featuredEvent.location}</span>
                </div>

                <p className="text-lg text-white/80 mb-8 max-w-3xl">
                  {featuredEvent.description}
                </p>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="bg-white text-primary hover:bg-white/90 hover:text-secondary font-medium shadow-xl border-2 border-transparent hover:border-white transition-all duration-300"
                  >
                    행사 참여하기
                  </Button>
                </div>

                {/* 장식적인 요소들 */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-16 -mr-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-dark/10 rounded-full -mb-20 -ml-20 blur-3xl"></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 일반 이벤트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regularEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group"
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div
                  className={`h-2 w-full bg-gradient-to-r ${
                    event.gradient
                  } transition-all duration-300 ${
                    hoveredId === event.id ? "h-3" : "h-2"
                  }`}
                ></div>

                <div className="p-6 flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
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
                      <span>{event.date}</span>
                    </div>

                    <div className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {event.time}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {event.location}
                  </p>

                  <p className="text-gray-600 mb-6">{event.description}</p>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                  >
                    자세히 보기
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button
            variant="primary"
            className="shadow-lg hover:shadow-primary/20 hover:shadow-xl mt-4 px-8 rounded-full transition-all duration-300 hover:-translate-y-1"
          >
            모든 행사 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
