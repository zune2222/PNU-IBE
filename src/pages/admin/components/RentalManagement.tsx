import React from "react";
import {
  FirestoreRentalApplication,
  FirestoreRentalItem,
  rentalApplicationService,
} from "../../../shared/services/firestore";

interface RentalManagementProps {
  rentalApplications: FirestoreRentalApplication[];
  rentalItems: { [id: string]: FirestoreRentalItem };
  isLoading: boolean;
  loadData: () => void;
  openPhotoModal: (imageUrl: string, title: string) => void;
}

export default function RentalManagement({
  rentalApplications,
  rentalItems,
  isLoading,
  loadData,
  openPhotoModal,
}: RentalManagementProps) {
  return (
    <div className="space-y-6">
      {/* 대여 현황 관리 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">대여 현황 관리</h2>
          <p className="text-sm text-gray-600 mt-1">
            현재 대여 중인 물품과 반납 처리를 관리합니다
          </p>
        </div>

        {/* 필터 및 검색 */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {["rented", "returned", "overdue", "lost", "damaged"].map(
              (status) => (
                <button
                  key={status}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    status === "rented"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : status === "returned"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : status === "overdue"
                      ? "bg-red-100 text-red-800 border-red-200"
                      : status === "lost"
                      ? "bg-gray-100 text-gray-800 border-gray-200"
                      : "bg-orange-100 text-orange-800 border-orange-200"
                  }`}
                >
                  {status === "rented"
                    ? "대여중"
                    : status === "returned"
                    ? "반납완료"
                    : status === "overdue"
                    ? "연체"
                    : status === "lost"
                    ? "분실"
                    : "파손"}
                  (
                  {
                    rentalApplications.filter((app) => app.status === status)
                      .length
                  }
                  )
                </button>
              )
            )}
          </div>
        </div>

        {/* 대여 목록 */}
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              데이터를 불러오는 중...
            </div>
          ) : rentalApplications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              대여 기록이 없습니다.
            </div>
          ) : (
            rentalApplications.map((application) => {
              const item = rentalItems[application.itemId];

              return (
                <div key={application.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            application.status === "rented"
                              ? "bg-blue-100 text-blue-800"
                              : application.status === "returned"
                              ? "bg-green-100 text-green-800"
                              : application.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : application.status === "lost"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {application.status === "rented"
                            ? "대여중"
                            : application.status === "returned"
                            ? "반납완료"
                            : application.status === "overdue"
                            ? "연체"
                            : application.status === "lost"
                            ? "분실"
                            : "파손"}
                        </span>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item?.name || "물품 정보 없음"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          #{application.itemUniqueId}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <strong>대여자:</strong> {application.studentName} (
                          {application.studentId})
                        </p>
                        <p>
                          <strong>학과:</strong> {application.department}
                        </p>
                        <p>
                          <strong>캠퍼스:</strong>{" "}
                          {application.campus === "yangsan"
                            ? "양산캠퍼스"
                            : "장전캠퍼스"}
                        </p>
                        <p>
                          <strong>휴대폰:</strong> {application.phoneNumber}
                        </p>
                        <p>
                          <strong>학생증 인증:</strong>{" "}
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              application.studentIdVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {application.studentIdVerified
                              ? "인증완료"
                              : "미인증"}
                          </span>
                        </p>
                        <p>
                          <strong>대여일:</strong>{" "}
                          {new Date(application.rentDate).toLocaleString(
                            "ko-KR"
                          )}
                        </p>
                        <p>
                          <strong>반납 예정일:</strong>{" "}
                          {new Date(application.dueDate).toLocaleString(
                            "ko-KR"
                          )}
                        </p>
                        <p>
                          <strong>대여 목적:</strong> {application.purpose}
                        </p>
                        {application.actualReturnDate && (
                          <p>
                            <strong>실제 반납일:</strong>{" "}
                            {new Date(
                              application.actualReturnDate
                            ).toLocaleString("ko-KR")}
                          </p>
                        )}
                        {application.overdueDays &&
                          application.overdueDays > 0 && (
                            <p className="text-red-600">
                              <strong>연체일:</strong> {application.overdueDays}
                              일
                              {application.penaltyPoints && (
                                <span className="ml-2">
                                  (벌점: {application.penaltyPoints}점)
                                </span>
                              )}
                            </p>
                          )}
                        {(application.lostReason ||
                          application.damageReason) && (
                          <p className="text-red-600">
                            <strong>
                              {application.status === "lost" ? "분실" : "파손"}{" "}
                              사유:
                            </strong>{" "}
                            {application.lostReason || application.damageReason}
                          </p>
                        )}
                        {application.rating && (
                          <p className="text-blue-600">
                            <strong>만족도:</strong>{" "}
                            {"⭐".repeat(application.rating)} (
                            {application.rating}/5)
                            {application.feedback && (
                              <span className="block mt-1 text-gray-500">
                                &ldquo;{application.feedback}&rdquo;
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 text-xs text-gray-400">
                        대여 시작:{" "}
                        {application.createdAt?.toDate().toLocaleString()}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {/* 사진 미리보기 썸네일들 */}
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {application.studentIdPhotoUrl && (
                          <div className="relative group">
                            <img
                              src={application.studentIdPhotoUrl}
                              alt="학생증"
                              className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                              onClick={() =>
                                openPhotoModal(
                                  application.studentIdPhotoUrl!,
                                  "학생증 사진"
                                )
                              }
                            />
                            <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white text-xs px-1 rounded">
                              📄
                            </div>
                          </div>
                        )}
                        {application.itemConditionPhotoUrl && (
                          <div className="relative group">
                            <img
                              src={application.itemConditionPhotoUrl}
                              alt="대여 시 물품 상태"
                              className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                              onClick={() =>
                                openPhotoModal(
                                  application.itemConditionPhotoUrl!,
                                  "대여 시 물품 상태"
                                )
                              }
                            />
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded">
                              📷
                            </div>
                          </div>
                        )}
                        {application.lockboxSecuredPhotoUrl && (
                          <div className="relative group">
                            <img
                              src={application.lockboxSecuredPhotoUrl}
                              alt="대여 시 자물쇠"
                              className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-purple-500 transition-colors"
                              onClick={() =>
                                openPhotoModal(
                                  application.lockboxSecuredPhotoUrl!,
                                  "대여 시 자물쇠 확인"
                                )
                              }
                            />
                            <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs px-1 rounded">
                              🔒
                            </div>
                          </div>
                        )}
                        {application.returnItemConditionPhotoUrl && (
                          <div className="relative group">
                            <img
                              src={application.returnItemConditionPhotoUrl}
                              alt="반납 시 물품 상태"
                              className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-green-500 transition-colors"
                              onClick={() =>
                                openPhotoModal(
                                  application.returnItemConditionPhotoUrl!,
                                  "반납 시 물품 상태"
                                )
                              }
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-1 rounded">
                              📷
                            </div>
                          </div>
                        )}
                        {application.returnLockboxSecuredPhotoUrl && (
                          <div className="relative group">
                            <img
                              src={application.returnLockboxSecuredPhotoUrl}
                              alt="반납 시 자물쇠"
                              className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-teal-500 transition-colors"
                              onClick={() =>
                                openPhotoModal(
                                  application.returnLockboxSecuredPhotoUrl!,
                                  "반납 시 자물쇠 확인"
                                )
                              }
                            />
                            <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-xs px-1 rounded">
                              🔒
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 액션 버튼들 */}
                      <div className="flex flex-col space-y-1 ml-2 sm:ml-4">
                        {application.status === "rented" && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  await rentalApplicationService.processReturn(
                                    application.id!,
                                    {
                                      returnItemConditionPhotoUrl: "", // TODO: 반납 사진 처리
                                      returnLockboxSecuredPhotoUrl: "",
                                    }
                                  );
                                  loadData();
                                  alert("반납 처리가 완료되었습니다.");
                                } catch (error) {
                                  console.error("반납 처리 오류:", error);
                                  alert("반납 처리 중 오류가 발생했습니다.");
                                }
                              }}
                              className="bg-green-600 text-white px-2 sm:px-3 py-1 text-xs rounded hover:bg-green-700"
                            >
                              반납 처리
                            </button>
                            <button
                              onClick={async () => {
                                const reason =
                                  prompt("분실 사유를 입력해주세요:");
                                if (reason) {
                                  try {
                                    await rentalApplicationService.markAsLost(
                                      application.id!,
                                      reason
                                    );
                                    loadData();
                                    alert("분실 처리가 완료되었습니다.");
                                  } catch (error) {
                                    console.error("분실 처리 오류:", error);
                                    alert("분실 처리 중 오류가 발생했습니다.");
                                  }
                                }
                              }}
                              className="bg-red-600 text-white px-2 sm:px-3 py-1 text-xs rounded hover:bg-red-700"
                            >
                              분실 처리
                            </button>
                            <button
                              onClick={async () => {
                                const reason =
                                  prompt("파손 사유를 입력해주세요:");
                                if (reason) {
                                  try {
                                    await rentalApplicationService.markAsDamaged(
                                      application.id!,
                                      reason
                                    );
                                    loadData();
                                    alert("파손 처리가 완료되었습니다.");
                                  } catch (error) {
                                    console.error("파손 처리 오류:", error);
                                    alert("파손 처리 중 오류가 발생했습니다.");
                                  }
                                }
                              }}
                              className="bg-orange-600 text-white px-2 sm:px-3 py-1 text-xs rounded hover:bg-orange-700"
                            >
                              파손 처리
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 대여 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  현재 대여 중
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {
                    rentalApplications.filter((app) => app.status === "rented")
                      .length
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
                  반납 완료
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
                    rentalApplications.filter((app) => app.status === "overdue")
                      .length
                  }
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
