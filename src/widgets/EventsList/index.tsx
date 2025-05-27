import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { eventService, FirestoreEvent } from "../../shared/services/firestore";
import {
  getCategoryColor,
  getStatusBadgeStyle,
  getStatusText,
} from "../../shared/data/eventsData";

// 카테고리 목록
const categories = ["전체", "학술", "체육", "문화", "취업"];

// 상태 목록
const statuses = ["전체", "진행 예정", "진행 중", "종료"];

export function EventsList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firestore에서 행사 데이터 로드
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await eventService.getAll();
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error("행사 로드 실패:", err);
        setError("행사 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // 필터링된 이벤트 목록
  const filteredEvents = events.filter((event) => {
    // 카테고리 필터링
    const categoryMatch =
      selectedCategory === "전체" || event.category === selectedCategory;

    // 상태 필터링
    const statusMatch =
      selectedStatus === "전체" ||
      (selectedStatus === "진행 예정" && event.status === "upcoming") ||
      (selectedStatus === "진행 중" && event.status === "ongoing") ||
      (selectedStatus === "종료" && event.status === "completed");

    // 검색어 필터링
    const searchMatch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && statusMatch && searchMatch;
  });

  // 로딩 상태
  if (loading) {
    return (
      <section className="py-20 sm:py-24 md:py-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
        <div className="container-custom relative z-10 px-6 sm:px-8 lg:px-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 korean-text">
                행사 정보를 불러오는 중...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <section className="py-20 sm:py-24 md:py-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
        <div className="container-custom relative z-10 px-6 sm:px-8 lg:px-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8">
              <svg
                className="mx-auto h-12 w-12 text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 korean-text">
                데이터 로드 실패
              </h3>
              <p className="text-gray-600 korean-text mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors korean-text"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-24 md:py-28 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
      {/* 배경 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/10 to-tertiary/10 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10 px-6 sm:px-8 lg:px-12">
        {/* 필터 및 검색 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 bg-white/90 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-white/60"
        >
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* 검색 */}
            <div className="w-full">
              <label
                htmlFor="search"
                className="block text-sm font-semibold text-gray-700 mb-3 korean-text"
              >
                검색
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="행사명 또는 내용으로 검색..."
                  className="w-full px-5 py-4 pl-14 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm korean-text text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* 필터 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* 카테고리 필터 */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-3 korean-text">
                  카테고리
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 korean-text min-h-[44px] ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                          : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-gray-200 shadow-sm hover:shadow-md"
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 상태 필터 */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-3 korean-text">
                  상태
                </label>
                <div className="flex flex-wrap gap-3">
                  {statuses.map((status) => (
                    <motion.button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 korean-text min-h-[44px] ${
                        selectedStatus === status
                          ? "bg-gradient-to-r from-secondary to-tertiary text-white shadow-lg shadow-secondary/25"
                          : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-gray-200 shadow-sm hover:shadow-md"
                      }`}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 이벤트 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
              >
                {/* 이미지 */}
                <Link href={`/events/${event.id}`} className="block relative">
                  <div className="relative h-52 sm:h-56 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${getCategoryColor(
                          event.category
                        )} shadow-lg`}
                      >
                        {event.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${getStatusBadgeStyle(
                          event.status
                        )} shadow-lg`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-6 sm:p-7 flex-grow flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-400"
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
                    <span className="korean-text font-medium">
                      {event.date.replace(/-/g, ".")} • {event.time}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                    <Link
                      href={`/events/${event.id}`}
                      className="hover:text-primary korean-text"
                    >
                      {event.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0"
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
                    <span className="korean-text font-medium">
                      {event.location}
                    </span>
                  </p>

                  <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed korean-text">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors duration-300 group/link korean-text"
                    >
                      자세히 보기
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1"
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
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="col-span-full py-16 sm:py-20 text-center"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-10 sm:p-14 max-w-md mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 sm:h-18 sm:w-18 mx-auto text-gray-400 mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3 korean-text">
                  검색 결과가 없습니다
                </h3>
                <p className="text-base sm:text-lg text-gray-500 korean-text">
                  다른 검색어나 필터를 사용해 보세요.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
