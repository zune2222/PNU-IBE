import React from "react";
import { FirestoreRentalApplication } from "../../../shared/services/firestore";
import { discordService } from "../../../shared/services/discordService";
import { penaltySystem } from "../../../shared/services/penaltySystem";
import { DashboardStats, ActiveTab } from "../types/dashboard";

interface DashboardOverviewProps {
  dashboardStats: DashboardStats;
  rentalApplications: FirestoreRentalApplication[];
  setActiveTab: (tab: ActiveTab) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadData: () => void;
}

export default function DashboardOverview({
  dashboardStats,
  rentalApplications,
  setActiveTab,
  isLoading,
  setIsLoading,
  loadData,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  전체 사용자
                </dt>
                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                  {dashboardStats.totalUsers}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-green-500"
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
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  총 신청
                </dt>
                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                  {dashboardStats.totalApplications}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500"
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
            </div>
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  오늘 대여
                </dt>
                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                  {dashboardStats.pendingApplications}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500"
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
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  대여 중
                </dt>
                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                  {
                    rentalApplications.filter((app) => app.status === "rented")
                      .length
                  }
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-red-500"
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
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  연체
                </dt>
                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                  {dashboardStats.overdueRentals}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  전체 물품
                </dt>
                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                  {dashboardStats.totalItems}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-teal-500"
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
            <div className="ml-3 sm:ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  대여 가능
                </dt>
                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                  {dashboardStats.availableItems}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* 2열 레이아웃: 인기 물품 + 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 인기 물품 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              📈 인기 대여 물품
            </h3>
          </div>
          <div className="p-6">
            {dashboardStats.popularItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                데이터가 없습니다
              </p>
            ) : (
              <div className="space-y-3">
                {dashboardStats.popularItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-orange-400"
                            : "bg-blue-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.count}회
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 알림 센터 (최근 활동) */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">🔔 알림 센터</h3>
            <p className="text-sm text-gray-600 mt-1">
              최근 30초마다 자동 업데이트
            </p>
          </div>
          <div className="p-6">
            {dashboardStats.recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                최근 활동이 없습니다
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {dashboardStats.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        activity.status === "error"
                          ? "bg-red-500"
                          : activity.status === "warning"
                          ? "bg-yellow-500"
                          : activity.status === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 셀프 서비스 시스템 현황 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            🤖 셀프 서비스 시스템 현황
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            즉시 대여 시스템의 주요 지표들
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 학생증 인증 현황 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-600"
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
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">
                    학생증 인증률
                  </p>
                  <p className="text-lg font-semibold text-blue-600">
                    {rentalApplications.length > 0
                      ? Math.round(
                          (rentalApplications.filter(
                            (app) => app.studentIdVerified
                          ).length /
                            rentalApplications.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* 평균 대여 시간 */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">
                    평균 대여기간
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    {(() => {
                      const returnedRentals = rentalApplications.filter(
                        (app) =>
                          app.status === "returned" &&
                          app.actualReturnDate &&
                          app.rentDate
                      );
                      if (returnedRentals.length === 0) return "0시간";

                      const totalHours = returnedRentals.reduce((sum, app) => {
                        const rentDate = new Date(app.rentDate);
                        const returnDate = new Date(app.actualReturnDate!);
                        const hours =
                          (returnDate.getTime() - rentDate.getTime()) /
                          (1000 * 60 * 60);
                        return sum + hours;
                      }, 0);

                      return (
                        Math.round(totalHours / returnedRentals.length) + "시간"
                      );
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* 벌점 현황 */}
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-600"
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
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-900">총 벌점</p>
                  <p className="text-lg font-semibold text-red-600">
                    {rentalApplications.reduce(
                      (sum, app) => sum + (app.penaltyPoints || 0),
                      0
                    )}
                    점
                  </p>
                </div>
              </div>
            </div>

            {/* 만족도 평균 */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-900">
                    평균 만족도
                  </p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {(() => {
                      const ratedRentals = rentalApplications.filter(
                        (app) => app.rating
                      );
                      if (ratedRentals.length === 0) return "N/A";

                      const avgRating =
                        ratedRentals.reduce(
                          (sum, app) => sum + (app.rating || 0),
                          0
                        ) / ratedRentals.length;
                      return avgRating.toFixed(1) + "/5";
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 버튼 */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
          ⚡ 빠른 액션
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab("rentals")}
            className="flex flex-col sm:flex-row items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2 text-red-500"
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
            <span className="text-center">연체 관리</span>
          </button>
          <button
            onClick={() => setActiveTab("lockboxes")}
            className="flex flex-col sm:flex-row items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span className="text-center">보관함 관리</span>
          </button>
          <button
            onClick={() => setActiveTab("notices")}
            className="flex flex-col sm:flex-row items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            <span className="text-center">공지사항 작성</span>
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className="flex flex-col sm:flex-row items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="text-center">물품 관리</span>
          </button>
          <button
            onClick={() => window.open("/rental-status", "_blank")}
            className="flex flex-col sm:flex-row items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-center">현황 조회</span>
          </button>
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                const success = await discordService.sendTestMessage();
                if (success) {
                  alert("Discord 테스트 메시지가 전송되었습니다!");
                } else {
                  alert(
                    "Discord 메시지 전송에 실패했습니다. Webhook URL을 확인해주세요."
                  );
                }
              } catch (error) {
                console.error("Discord 테스트 오류:", error);
                alert("Discord 테스트 중 오류가 발생했습니다.");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="flex flex-col sm:flex-row items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 col-span-2 sm:col-span-1"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-center">Discord 테스트</span>
          </button>
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                const result = await penaltySystem.processOverdueItems();
                alert(
                  `벌점 시스템 실행 완료!\n` +
                    `처리된 항목: ${result.totalProcessed}개\n` +
                    `새로운 연체: ${result.newOverdueItems.length}개\n` +
                    `벌점 부과: ${result.penaltiesApplied.length}건\n` +
                    `알림 전송: ${result.notificationsSent}건\n` +
                    `오류: ${result.errors.length}건`
                );
                if (result.errors.length > 0) {
                  console.error("벌점 시스템 오류들:", result.errors);
                }
                // 데이터 새로고침
                loadData();
              } catch (error) {
                console.error("벌점 시스템 실행 오류:", error);
                alert("벌점 시스템 실행 중 오류가 발생했습니다.");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="flex flex-col sm:flex-row items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-2 text-red-500"
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
            <span className="text-center">벌점 시스템 실행</span>
          </button>
        </div>
      </div>
    </div>
  );
}
