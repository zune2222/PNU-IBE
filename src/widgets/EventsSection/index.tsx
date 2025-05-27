import React from "react";
import { motion } from "framer-motion";
import Button from "../../shared/ui/Button";
import Link from "next/link";
import {
  getUpcomingEvents,
  getFeaturedEvents,
  getStatusText,
} from "../../shared/data/eventsData";

export function EventsSection() {
  // 피처링된 행사 및 일반 행사 가져오기
  const featuredEvents = getFeaturedEvents();
  const featuredEvent = featuredEvents.length > 0 ? featuredEvents[0] : null;

  // 다가오는 행사 (featuredEvent를 제외하고 최대 3개)
  const upcomingEvents = getUpcomingEvents(4)
    .filter((event) => !featuredEvent || event.id !== featuredEvent.id)
    .slice(0, 3);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute left-0 top-0 w-full h-64 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl"></div>
      <div className="absolute -right-20 top-40 w-80 h-80 rounded-full bg-purple-400/10 blur-3xl"></div>

      {/* 플로팅 배경 요소들 */}
      <div className="absolute top-32 left-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-20 w-48 h-48 bg-indigo-400/10 rounded-full blur-xl"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/20 text-primary font-semibold text-sm mb-4 shadow-lg"
          >
            일정 안내
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark mb-4 sm:mb-6 tracking-wide px-4 korean-text"
          >
            다가오는{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              행사
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg px-4 korean-text leading-relaxed"
          >
            정보의생명공학대학 학생회에서 준비한 다양한 행사에 참여해보세요.
          </motion.p>
        </div>

        {/* 피처드 이벤트 - 글래스모피즘 적용 */}
        {featuredEvent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12 sm:mb-16 mt-8 sm:mt-14 mx-4 sm:mx-0"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group">
              {/* 배경 그라디언트 효과 */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="absolute w-[300px] h-[300px] -top-[150px] -left-[150px] bg-blue-400/30 rounded-full blur-3xl"></div>
                <div className="absolute w-[300px] h-[300px] -bottom-[150px] -right-[150px] bg-purple-400/30 rounded-full blur-3xl"></div>
              </div>

              <div
                className={`absolute inset-0 bg-gradient-to-r ${featuredEvent.gradient}`}
              ></div>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

              {/* 글래스모피즘 오버레이 */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-lg border border-white/20"></div>

              <div className="relative p-6 sm:p-8 md:p-12 z-10 flex flex-col h-full text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                  <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold shadow-lg">
                    주요 행사
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
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
                    <span className="text-sm">
                      {featuredEvent.date.replace(/-/g, ".")} •{" "}
                      {featuredEvent.time}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-300 drop-shadow-lg korean-text">
                  {featuredEvent.title}
                </h3>

                <div className="mb-6 flex items-center bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
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
                  <span className="text-sm korean-text">
                    {featuredEvent.location}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-white/90 mb-8 max-w-3xl drop-shadow-md korean-text leading-relaxed">
                  {featuredEvent.description}
                </p>

                <div className="mt-auto">
                  <Link href={`/events/${featuredEvent.id}`}>
                    <Button
                      variant="outline"
                      className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 hover:text-white font-medium shadow-xl transition-all duration-300"
                    >
                      행사 참여하기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 일반 이벤트 그리드 - 글래스모피즘 적용 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group"
            >
              <div className="relative bg-white/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:translate-y-[-8px] group-hover:bg-white/70 h-full flex flex-col">
                {/* 글래스모피즘 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent"></div>

                {/* 상단 그림자 효과 */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl sm:rounded-t-3xl"></div>

                {/* 하단 그림자 효과 */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 to-transparent rounded-b-2xl sm:rounded-b-3xl"></div>

                <div className="relative p-6 sm:p-8 flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600 text-sm bg-white/30 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
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
                      <span>{event.date.replace(/-/g, ".")}</span>
                    </div>

                    <div className="text-xs font-medium bg-white/40 backdrop-blur-md text-gray-700 px-3 py-1 rounded-full border border-white/30">
                      {event.time}
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors leading-tight korean-text">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 flex items-center bg-white/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/20 w-fit korean-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-gray-500"
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

                  <p className="text-gray-700 text-sm sm:text-base mb-6 line-clamp-3 leading-relaxed korean-text">
                    {event.description}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium inline-block px-3 py-1 rounded-full bg-blue-400/20 backdrop-blur-md text-blue-700 border border-blue-200/30">
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button
                          variant="outline"
                          className="text-primary bg-white/30 backdrop-blur-md border-white/30 hover:bg-white/50 text-sm"
                        >
                          상세 정보
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 장식적 요소 - 항상 보이도록 */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 sm:w-20 sm:h-20 opacity-20 group-hover:opacity-40 transition-all duration-500">
                  <div className="w-full h-full rounded-full blur-xl bg-primary/50"></div>
                </div>

                {/* 글로우 효과 - 항상 보이도록 */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-xl bg-gradient-radial from-primary/20 to-transparent"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 더 많은 행사 보기 버튼 - 글래스모피즘 적용 */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="relative inline-block">
            {/* 배경 그라디언트 효과 */}
            <div className="absolute inset-0 -m-2 rounded-2xl overflow-hidden">
              <div className="absolute w-[100px] h-[100px] -top-[50px] -left-[50px] bg-blue-400/20 rounded-full blur-2xl"></div>
              <div className="absolute w-[100px] h-[100px] -bottom-[50px] -right-[50px] bg-purple-400/20 rounded-full blur-2xl"></div>
            </div>

            <Link href="/events">
              <Button
                variant="outline"
                className="relative bg-white/60 backdrop-blur-lg border-white/30 hover:bg-white/80 shadow-xl transition-all duration-300"
              >
                더 많은 행사 보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
