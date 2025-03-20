import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// 이벤트 데이터 타입 정의
interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
  description: string;
}

// 더미 이벤트 데이터
const eventsData: Event[] = [
  {
    id: 1,
    title: "정보의생명공학대학 체육대회",
    category: "체육",
    date: "2025-04-15",
    location: "부산대학교 대운동장",
    image: "/images/events/sports.jpg",
    status: "upcoming",
    description:
      "매년 진행되는 정보의생명공학대학 체육대회입니다. 학과별 축구, 농구, 발야구 등 다양한 종목이 준비되어 있습니다.",
  },
  {
    id: 2,
    title: "프로그래밍 경진대회",
    category: "학술",
    date: "2025-03-10",
    location: "제2공학관 강당",
    image: "/images/events/programming.jpg",
    status: "upcoming",
    description:
      "알고리즘 문제 해결 능력을 겨루는 프로그래밍 경진대회입니다. 다양한 상품과 상금이 마련되어 있습니다.",
  },
  {
    id: 3,
    title: "새내기 환영회",
    category: "문화",
    date: "2025-03-02",
    location: "학생회관 대강당",
    image: "/images/events/welcome.jpg",
    status: "ongoing",
    description:
      "신입생들을 환영하는 행사로, 학과 소개 및 선배들과의 만남의 시간이 준비되어 있습니다.",
  },
  {
    id: 4,
    title: "진로 탐색 워크샵",
    category: "취업",
    date: "2025-02-28",
    location: "제1공학관 세미나실",
    image: "/images/events/career.jpg",
    status: "ongoing",
    description:
      "다양한 기업의 현직자들을 초청하여 진로 탐색에 도움을 주는 워크샵입니다.",
  },
  {
    id: 5,
    title: "종강 파티",
    category: "문화",
    date: "2024-12-20",
    location: "학생회관",
    image: "/images/events/party.jpg",
    status: "ongoing",
    description:
      "한 학기 동안 고생한 학우들을 위한 종강 파티입니다. 다양한 음식과 게임이 준비되어 있습니다.",
  },
  {
    id: 6,
    title: "학술 세미나",
    category: "학술",
    date: "2024-11-25",
    location: "제2공학관 세미나실",
    image: "/images/events/seminar.jpg",
    status: "completed",
    description: "최신 기술 트렌드와 연구 동향을 공유하는 학술 세미나입니다.",
  },
  {
    id: 7,
    title: "가을 축제",
    category: "문화",
    date: "2024-10-15",
    location: "부산대학교 대운동장",
    image: "/images/events/festival.jpg",
    status: "completed",
    description:
      "가을을 맞이하여 진행되는 축제로, 공연 및 다양한 부스가 운영됩니다.",
  },
  {
    id: 8,
    title: "코딩 부트캠프",
    category: "학술",
    date: "2024-09-10",
    location: "제1공학관 컴퓨터실",
    image: "/images/events/bootcamp.jpg",
    status: "completed",
    description:
      "실무 프로젝트를 통해 개발 능력을 향상시키는 코딩 부트캠프입니다.",
  },
  {
    id: 9,
    title: "기업 채용설명회",
    category: "취업",
    date: "2024-08-20",
    location: "학생회관 대강당",
    image: "/images/events/job.jpg",
    status: "completed",
    description:
      "다양한 기업들이 참여하는 채용설명회로, 취업 정보를 얻을 수 있는 기회입니다.",
  },
];

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

  // 상태별 배지 스타일
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 상태 한글 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "진행 예정";
      case "ongoing":
        return "진행 중";
      case "completed":
        return "종료";
      default:
        return status;
    }
  };

  // 카테고리별 배지 스타일
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "학술":
        return "bg-purple-100 text-purple-700";
      case "체육":
        return "bg-red-100 text-red-700";
      case "문화":
        return "bg-amber-100 text-amber-700";
      case "취업":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(
                        event.status
                      )}`}
                    >
                      {getStatusText(event.status)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryBadgeStyle(
                        event.category
                      )}`}
                    >
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex flex-col space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href={`/events/${event.id}`} legacyBehavior>
                      <a className="inline-block w-full text-center py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-colors">
                        자세히 보기
                      </a>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              xmlns="http://www.w3.org/2000/svg"
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
            <h3 className="text-gray-500 text-xl font-medium">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-400 mt-2">
              다른 검색어나 필터를 사용해 보세요.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("전체");
                setSelectedStatus("전체");
                setSearchTerm("");
              }}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
