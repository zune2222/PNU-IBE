import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  eventsData,
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

  // 필터링된 이벤트 목록
  const filteredEvents = eventsData.filter((event) => {
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* 필터 및 검색 */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 검색 */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                검색
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="행사명 또는 내용으로 검색"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </span>
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리
              </label>
              <select
                id="category"
                className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 상태 필터 */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                상태
              </label>
              <select
                id="status"
                className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 이벤트 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                {/* 이미지 */}
                <Link href={`/events/${event.id}`} className="block relative">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 p-3 flex gap-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(
                          event.category
                        )}`}
                      >
                        {event.category}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeStyle(
                          event.status
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {event.date.replace(/-/g, ".")} • {event.time}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-primary transition-colors">
                    <Link
                      href={`/events/${event.id}`}
                      className="hover:text-primary"
                    >
                      {event.title}
                    </Link>
                  </h3>

                  <p className="text-gray-500 text-sm mb-3 flex items-center">
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

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-primary font-medium hover:text-primary-dark flex items-center"
                    >
                      자세히 보기
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
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
            <div className="col-span-full py-16 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300 mb-4"
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
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-500">
                다른 검색어나 필터를 사용해 보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
