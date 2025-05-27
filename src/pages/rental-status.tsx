import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  rentalApplicationService,
  rentalItemService,
  userService,
  FirestoreRentalApplication,
  FirestoreRentalItem,
  FirestoreUser,
} from "../shared/services/firestore";

export default function RentalStatus() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [currentUser, setCurrentUser] = useState<FirestoreUser | null>(null);
  const [rentalApplications, setRentalApplications] = useState<
    FirestoreRentalApplication[]
  >([]);
  const [rentalItems, setRentalItems] = useState<{
    [id: string]: FirestoreRentalItem;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError("학번을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setHasSearched(false);

    try {
      // 학번으로 사용자 찾기
      const user = await userService.getByStudentId(studentId.trim());
      if (!user) {
        setError("해당 학번으로 등록된 사용자를 찾을 수 없습니다.");
        setCurrentUser(null);
        setRentalApplications([]);
        setRentalItems({});
        setHasSearched(true);
        return;
      }

      setCurrentUser(user);

      // 대여 신청 내역 로드
      const applications = await rentalApplicationService.getByUserId(user.uid);
      setRentalApplications(applications);

      // 물품 정보 로드
      const itemsMap: { [id: string]: FirestoreRentalItem } = {};
      for (const application of applications) {
        try {
          const item = await rentalItemService.getById(application.itemId);
          if (item && item.id) {
            itemsMap[item.id] = item;
          }
        } catch (error) {
          console.error(`물품 ${application.itemId} 로드 오류:`, error);
        }
      }
      setRentalItems(itemsMap);
      setHasSearched(true);
    } catch (error) {
      console.error("대여 현황 조회 오류:", error);
      setError("대여 현황 조회 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "returned":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "lost":
        return "bg-gray-100 text-gray-800";
      case "damaged":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "rented":
        return "대여 중";
      case "returned":
        return "반납 완료";
      case "overdue":
        return "연체";
      case "lost":
        return "분실";
      case "damaged":
        return "파손";
      default:
        return "알 수 없음";
    }
  };

  const getDaysOverdue = (rental: FirestoreRentalApplication) => {
    const today = new Date();
    const endDate = new Date(rental.dueDate);
    const diffTime = today.getTime() - endDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 최근 신청 필터링
  const currentRentals = rentalApplications.filter(
    (app) => app.status === "rented"
  );
  const recentReturns = rentalApplications.filter(
    (app) => app.status === "returned"
  );

  return (
    <>
      <Head>
        <title>대여 현황 조회 - PNU IBE</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  대여 현황 조회
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  학번을 입력하여 대여 현황을 확인하세요
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 학번 입력 폼 */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleSearch} className="flex gap-4 items-end">
              <div className="flex-1">
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  학번
                </label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="학번을 입력하세요 (예: 202012345)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "조회 중..." : "조회"}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 결과 영역 */}
          {hasSearched && (
            <>
              {currentUser ? (
                <>
                  {/* 사용자 정보 카드 */}
                  <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {currentUser.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {currentUser.studentId} •{" "}
                          {currentUser.campus === "yangsan"
                            ? "양산캠퍼스"
                            : "장전캠퍼스"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {currentUser.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-gray-600">학생증 인증</p>
                            <p
                              className={`text-sm font-medium ${
                                currentUser.studentIdVerified
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {currentUser.studentIdVerified
                                ? "완료"
                                : "미완료"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">누적 벌점</p>
                            <p
                              className={`text-sm font-medium ${
                                currentUser.penaltyPoints > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {currentUser.penaltyPoints}점
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 대여 통계 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-8 w-8 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              전체 신청
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {rentalApplications.length}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-8 w-8 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              현재 대여
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {currentRentals.length}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-8 w-8 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              완료된 대여
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {
                                rentalApplications.filter(
                                  (app) => app.status === "returned"
                                ).length
                              }
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-8 w-8 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              연체
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {
                                currentRentals.filter(
                                  (app) => getDaysOverdue(app) > 0
                                ).length
                              }
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 탭 네비게이션 */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                      <nav className="flex -mb-px">
                        <button
                          onClick={() => setActiveTab("current")}
                          className={`py-4 px-6 text-sm font-medium border-b-2 ${
                            activeTab === "current"
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          현재 대여 ({currentRentals.length})
                        </button>
                        <button
                          onClick={() => setActiveTab("history")}
                          className={`py-4 px-6 text-sm font-medium border-b-2 ${
                            activeTab === "history"
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          대여 이력 ({recentReturns.length})
                        </button>
                      </nav>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className="p-6">
                      {/* 현재 대여 탭 */}
                      {activeTab === "current" && (
                        <div className="space-y-4">
                          {currentRentals.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="mb-4">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                  />
                                </svg>
                              </div>
                              <div className="text-gray-500">
                                현재 대여 중인 물품이 없습니다.
                              </div>
                            </div>
                          ) : (
                            currentRentals.map((rental) => {
                              const item = rentalItems[rental.itemId];
                              const overdueStatus = getDaysOverdue(rental) > 0;
                              const daysOverdue = overdueStatus
                                ? getDaysOverdue(rental)
                                : 0;

                              return (
                                <div
                                  key={rental.id}
                                  className="border border-gray-200 rounded-lg p-4"
                                >
                                  <div className="flex items-start space-x-4">
                                    {item?.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-gray-900">
                                          {item?.name || "물품 정보 없음"}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                          <span
                                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                              rental.status
                                            )}`}
                                          >
                                            {getStatusText(rental.status)}
                                          </span>
                                          {overdueStatus && (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                              연체 {daysOverdue}일
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {item?.description || "설명 없음"}
                                      </p>
                                      <div className="mt-2 text-sm text-gray-500">
                                        <p>
                                          대여 기간: {rental.rentDate} ~{" "}
                                          {rental.dueDate}
                                        </p>
                                        <p>대여 목적: {rental.purpose}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}

                      {/* 대여 이력 탭 */}
                      {activeTab === "history" && (
                        <div className="space-y-4">
                          {recentReturns.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              완료된 대여 기록이 없습니다.
                            </div>
                          ) : (
                            recentReturns.map((rental) => {
                              const item = rentalItems[rental.itemId];

                              return (
                                <div
                                  key={rental.id}
                                  className="border border-gray-200 rounded-lg p-4"
                                >
                                  <div className="flex items-start space-x-4">
                                    {item?.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-gray-900">
                                          {item?.name || "물품 정보 없음"}
                                        </h3>
                                        <span
                                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                            rental.status
                                          )}`}
                                        >
                                          {getStatusText(rental.status)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {item?.description || "설명 없음"}
                                      </p>
                                      <div className="mt-2 text-sm text-gray-500">
                                        <p>
                                          대여 기간: {rental.rentDate} ~{" "}
                                          {rental.dueDate}
                                        </p>
                                        {rental.actualReturnDate && (
                                          <p>
                                            실제 반납일:{" "}
                                            {rental.actualReturnDate}
                                          </p>
                                        )}
                                        <p>대여 목적: {rental.purpose}</p>
                                      </div>
                                      <div className="mt-2 text-xs text-gray-400">
                                        신청일:{" "}
                                        {rental.createdAt
                                          ?.toDate()
                                          .toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      검색 결과가 없습니다
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      입력하신 학번으로 등록된 사용자를 찾을 수 없습니다.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
