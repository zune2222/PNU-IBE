import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../shared/ui/Button";
import Link from "next/link";
import {
  getUpcomingEvents,
  getFeaturedEvents,
  getStatusText,
} from "../../shared/data/eventsData";

export function EventsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // 피처링된 행사 및 일반 행사 가져오기
  const featuredEvents = getFeaturedEvents();
  const featuredEvent = featuredEvents.length > 0 ? featuredEvents[0] : null;

  // 다가오는 행사 (featuredEvent를 제외하고 최대 3개)
  const upcomingEvents = getUpcomingEvents(4)
    .filter((event) => !featuredEvent || event.id !== featuredEvent.id)
    .slice(0, 3);

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
                className={`absolute inset-0 bg-gradient-to-r ${featuredEvent.gradient}`}
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
                      {featuredEvent.date.replace(/-/g, ".")} •{" "}
                      {featuredEvent.time}
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
                  <Link href={`/events/${featuredEvent.id}`}>
                    <Button
                      variant="outline"
                      className="bg-white text-primary hover:bg-white/90 hover:text-secondary font-medium shadow-xl border-2 border-transparent hover:border-white transition-all duration-300"
                    >
                      행사 참여하기
                    </Button>
                  </Link>
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
          {upcomingEvents.map((event, index) => (
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
                    event.gradient || "from-primary to-tertiary"
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
                      <span>{event.date.replace(/-/g, ".")}</span>
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

                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" className="text-primary">
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
              </div>
            </motion.div>
          ))}
        </div>

        {/* 더 많은 행사 보기 버튼 */}
        <div className="text-center mt-12">
          <Link href="/events">
            <Button variant="outline" className="mx-auto">
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
    </section>
  );
}
