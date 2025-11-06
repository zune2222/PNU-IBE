import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Event {
  eventId: number;
  eventName: string;
  status: string;
  registerStartDate: string;
  registerEndDate: string;
  predictionStartDate: string;
  predictionEndDate: string;
}

export function ESportsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // 추후 실제 API 연동
      setEvents([
        {
          eventId: 1,
          eventName: "제1회 PNU E-Sports 대회",
          status: "REGISTRATION_OPEN",
          registerStartDate: "2024-11-01T00:00:00",
          registerEndDate: "2024-11-15T23:59:59",
          predictionStartDate: "2024-11-16T00:00:00",
          predictionEndDate: "2024-11-20T18:00:00",
        },
      ]);
    } catch (error) {
      console.error("이벤트 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PREPARING":
        return "준비중";
      case "REGISTRATION_OPEN":
        return "참가신청중";
      case "PREDICTION_OPEN":
        return "승부예측진행중";
      case "IN_PROGRESS":
        return "경기진행중";
      case "COMPLETED":
        return "종료";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PREPARING":
        return "bg-gray-100 text-gray-600";
      case "REGISTRATION_OPEN":
        return "bg-blue-100 text-blue-600";
      case "PREDICTION_OPEN":
        return "bg-green-100 text-green-600";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-600";
      case "COMPLETED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container-custom">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-semibold text-primary korean-text">
              진행중인 대회
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold korean-text mb-4">
            <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
              참여 가능한{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                대회
              </span>
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto korean-text">
            현재 진행 중인 E-Sports 대회에 참가하거나 승부 예측에 참여해보세요
          </p>
        </motion.div>

        {/* 이벤트 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 korean-text">로딩 중...</p>
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 015 3h1m-1 4v1a3 3 0 01-6 0v-1m3-4.5V9.5a2.5 2.5 0 00-5 0V12h2.5a2.5 2.5 0 002.5-2.5z"
                />
              </svg>
            </div>
            <p className="text-gray-600 korean-text text-lg">
              진행중인 대회가 없습니다.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {events.map((event, index) => (
              <motion.div
                key={event.eventId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-dark korean-text mb-2">
                        {event.eventName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium korean-text">
                        참가 신청:
                      </span>
                      <span className="ml-2 korean-text">
                        {new Date(event.registerStartDate).toLocaleDateString()}{" "}
                        ~ {new Date(event.registerEndDate).toLocaleDateString()}
                      </span>
                    </div>
                    {event.predictionStartDate && (
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-secondary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        <span className="font-medium korean-text">
                          승부 예측 기간:
                        </span>
                        <span className="ml-2 korean-text">
                          {new Date(
                            event.predictionStartDate
                          ).toLocaleDateString()}{" "}
                          ~{" "}
                          {new Date(event.predictionEndDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {event.status === "REGISTRATION_OPEN" && (
                      <button
                        onClick={() =>
                          (window.location.href = `/esports/register?eventId=${event.eventId}`)
                        }
                        className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <svg
                          className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        <span className="korean-text font-medium">
                          참가 신청
                        </span>
                      </button>
                    )}

                    {event.status === "PREDICTION_OPEN" && (
                      <button
                        onClick={() =>
                          (window.location.href = `/esports/betting?eventId=${event.eventId}`)
                        }
                        className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <svg
                          className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        <span className="korean-text font-medium">
                          승부 예측 참여
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        (window.location.href = `/esports/ranking?eventId=${event.eventId}`)
                      }
                      className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <svg
                        className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <span className="korean-text font-medium">순위표</span>
                    </button>

                    <button
                      onClick={() =>
                        (window.location.href = `/esports/teams?eventId=${event.eventId}`)
                      }
                      className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <svg
                        className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="korean-text font-medium">참가팀</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 승부 예측 시스템 설명 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-3xl p-6 sm:p-8 md:p-10 border border-blue-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-dark korean-text mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                승부 예측 시스템
              </span>{" "}
              안내
            </h2>
            <p className="text-gray-600 korean-text">
              안전하고 재미있는 승부 예측 시스템을 소개합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-xl shadow-lg mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-dark korean-text">
                  게임 방식
                </h3>
              </div>
              <ul className="text-gray-600 space-y-2 korean-text">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  게임당 100포인트 지급 (총 300포인트)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                  여러 팀에 자유롭게 분배 가능
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tertiary rounded-full mr-3"></span>
                  최소 1포인트 단위로 승부 예측
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-secondary to-tertiary p-3 rounded-xl shadow-lg mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-dark korean-text">
                  배수 시스템
                </h3>
              </div>
              <ul className="text-gray-600 space-y-2 korean-text">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  1등: 5.0배 (항상 고정)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  중간등수: 참가팀 수에 따라 자동 조절
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  꼴등: 1.0배 (원금 보장)
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
