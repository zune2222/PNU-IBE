import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// 공지사항 더미 데이터
const noticeData = [
  {
    id: 1,
    title: "2025학년도 1학기 등록금 납부 안내",
    category: "학사",
    date: "2024-12-15",
    views: 256,
    important: true,
    preview:
      "2025학년도 1학기 등록금 납부와 관련하여 아래와 같이 안내드립니다. 등록 기간 및 납부 방법을 확인하시기 바랍니다.",
  },
  {
    id: 2,
    title: "정보의생명공학대학 제2회 학술제 개최 안내",
    category: "행사",
    date: "2024-12-10",
    views: 198,
    important: true,
    preview:
      "정보의생명공학대학 제2회 학술제가 다가오는 1월 15일에 개최됩니다. 학우 여러분의 많은 참여 바랍니다.",
  },
  {
    id: 3,
    title: "동계 방학 기숙사 신청 안내",
    category: "학사",
    date: "2024-12-08",
    views: 175,
    important: false,
    preview:
      "동계 방학 중 기숙사 이용을 원하는 학생들은 아래 내용을 참고하여 신청해주시기 바랍니다.",
  },
  {
    id: 4,
    title: "2025-1학기 장학금 신청 안내",
    category: "장학",
    date: "2024-12-05",
    views: 223,
    important: true,
    preview:
      "2025학년도 1학기 장학금 신청과 관련하여 다음과 같이 안내해드립니다. 신청 기간 및 방법을 확인하시기 바랍니다.",
  },
  {
    id: 5,
    title: "동아리 지원금 신청 방법 안내",
    category: "동아리",
    date: "2024-12-03",
    views: 142,
    important: false,
    preview:
      "2025학년도 1학기 동아리 지원금 신청 방법을 안내해드립니다. 신청 자격 및 제출 서류를 확인하시기 바랍니다.",
  },
  {
    id: 6,
    title: "겨울방학 프로그래밍 특강 안내",
    category: "학사",
    date: "2024-12-01",
    views: 187,
    important: false,
    preview:
      "정보의생명공학대학에서는 겨울방학 기간 동안 프로그래밍 특강을 진행합니다. 관심있는 학생들의 많은 신청 바랍니다.",
  },
  {
    id: 7,
    title: "2024년 동계 인턴십 프로그램 안내",
    category: "취업",
    date: "2024-11-28",
    views: 201,
    important: false,
    preview:
      "2024년 동계 인턴십 프로그램에 참여할 학생을 모집합니다. 지원 자격 및 신청 방법을 확인하시기 바랍니다.",
  },
  {
    id: 8,
    title: "학생회비 납부 안내",
    category: "학생회",
    date: "2024-11-25",
    views: 159,
    important: false,
    preview:
      "2025학년도 1학기 학생회비 납부와 관련하여 안내드립니다. 납부 기간 및 방법을 확인하시기 바랍니다.",
  },
  {
    id: 9,
    title: "제3회 정보의생명공학대학 체육대회 결과 안내",
    category: "행사",
    date: "2024-11-20",
    views: 168,
    important: false,
    preview:
      "지난 11월 15일에 진행된 제3회 정보의생명공학대학 체육대회 결과를 안내드립니다.",
  },
  {
    id: 10,
    title: "미납 도서 반납 안내",
    category: "학사",
    date: "2024-11-15",
    views: 132,
    important: false,
    preview:
      "중앙도서관에서 미납 도서 반납을 독려하고 있습니다. 대출 중인 도서의 반납 기한을 확인해주시기 바랍니다.",
  },
];

export function NoticeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 현재 페이지에 해당하는 공지사항만 필터링
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = noticeData.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(noticeData.length / itemsPerPage);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* 공지사항 목록 */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                  >
                    번호
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    제목
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                  >
                    분류
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
                  >
                    등록일
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                  >
                    조회수
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((notice) => (
                  <motion.tr
                    key={notice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 cursor-pointer group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-center relative">
                      <div className="relative">
                        <span
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium transition-all ${
                            notice.important
                              ? "bg-red-100 text-red-600 group-hover:bg-red-200"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          }`}
                        >
                          {notice.id}
                        </span>
                        {notice.important && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <Link
                          href={`/notice/${notice.id}`}
                          className="text-gray-900 font-medium hover:text-primary transition-colors line-clamp-1 text-lg"
                        >
                          {notice.important && (
                            <span className="inline-block mr-2 text-red-500 font-bold">
                              [중요]
                            </span>
                          )}
                          {notice.title}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                          {notice.preview}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          notice.category === "학사"
                            ? "bg-blue-100 text-blue-700"
                            : notice.category === "장학"
                            ? "bg-green-100 text-green-700"
                            : notice.category === "행사"
                            ? "bg-purple-100 text-purple-700"
                            : notice.category === "취업"
                            ? "bg-amber-100 text-amber-700"
                            : notice.category === "동아리"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {notice.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 text-center">
                      {notice.date}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 text-center">
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                          <path
                            fillRule="evenodd"
                            d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {notice.views}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === page
                    ? "text-white bg-primary border-primary z-10"
                    : "text-gray-500 hover:bg-gray-50"
                } transition-colors`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>

        {/* 글쓰기 버튼 */}
        <div className="flex justify-end mt-8">
          <Link
            href="/notice/write"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            공지사항 작성
            <svg
              className="ml-2 -mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
