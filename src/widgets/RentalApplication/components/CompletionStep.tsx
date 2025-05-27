import React from "react";
import { NextRouter } from "next/router";
import { FirestoreRentalItem } from "../../../shared/services/firestore";

interface CompletionStepProps {
  selectedItem: FirestoreRentalItem | null;
  rentalDueDate: Date | null;
  router: NextRouter;
  onReset: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  selectedItem,
  rentalDueDate,
  router,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          대여 완료! 🎉
        </h2>
        <button
          onClick={onReset}
          className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 py-1 px-2 border border-gray-300 rounded"
        >
          추가 대여
        </button>
      </div>

      {/* 신청 완료 메시지 */}
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            대여가 완료되었습니다!
          </h3>
          <p className="text-sm text-green-700">
            이제 물품을 사용하실 수 있습니다. 반납 기한을 꼭 지켜주세요!
          </p>
        </div>

        {/* 반납 기한 강조 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-red-800 mb-3 text-base">
            ⏰ 반납 기한
          </h4>
          <div className="bg-white border-2 border-red-300 rounded-lg p-4">
            <p className="text-2xl font-bold text-red-800 mb-1">
              {rentalDueDate
                ? rentalDueDate.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })
                : new Date(
                    new Date().getTime() + 24 * 60 * 60 * 1000
                  ).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
            </p>
            <p className="text-lg font-semibold text-red-700 mb-2">
              {rentalDueDate
                ? rentalDueDate.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : new Date(
                    new Date().getTime() + 24 * 60 * 60 * 1000
                  ).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
            </p>
            <p className="text-sm text-red-700 mb-2">
              (현재 시간으로부터 정확히 24시간 후)
            </p>
            <p className="text-xs text-red-600">
              ⚠️ 반납 기한을 넘기면 연체료 및 벌점이 부과됩니다
            </p>
          </div>
        </div>

        {selectedItem && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-left">
            <h4 className="font-medium text-gray-800 mb-3">
              📦 대여 물품 정보
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">물품명:</span>
                <span>{selectedItem.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">위치:</span>
                <span>
                  {selectedItem.campus === "yangsan"
                    ? "양산캠퍼스"
                    : "장전캠퍼스"}{" "}
                  {selectedItem.location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">대여일:</span>
                <span>{new Date().toLocaleDateString("ko-KR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">반납일:</span>
                <span className="text-red-600 font-medium">
                  {rentalDueDate
                    ? rentalDueDate.toLocaleDateString("ko-KR")
                    : new Date(
                        new Date().getTime() + 24 * 60 * 60 * 1000
                      ).toLocaleDateString("ko-KR")}
                  <br />
                  {rentalDueDate
                    ? rentalDueDate.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : new Date(
                        new Date().getTime() + 24 * 60 * 60 * 1000
                      ).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 반납 방법 및 주의사항 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-4">
          <h4 className="font-medium text-blue-800 mb-3">
            📋 반납 방법 및 주의사항
          </h4>
          <div className="text-sm text-blue-700 space-y-2">
            <div>
              <span className="font-medium">1. 반납 장소:</span>
              <span className="ml-1">
                {selectedItem?.campus === "yangsan"
                  ? "양산캠퍼스"
                  : "장전캠퍼스"}{" "}
                {selectedItem?.location} (대여한 곳과 동일)
              </span>
            </div>
            <div>
              <span className="font-medium">2. 반납 방법:</span>
              <span className="ml-1">
                물품을 원래 보관함에 넣고 자물쇠로 잠그기
              </span>
            </div>
            <div>
              <span className="font-medium">3. 연체 시:</span>
              <span className="ml-1 text-red-600">
                하루당 벌점 1점, 3회 연체 시 한 달 이용 정지
              </span>
            </div>
            <div>
              <span className="font-medium">4. 분실/파손 시:</span>
              <span className="ml-1 text-red-600">
                즉시 학생회에 연락, 수리비/구매비 본인 부담
              </span>
            </div>
            <div>
              <span className="font-medium">5. 문의:</span>
              <span className="ml-1">
                정보대학 학생회 (인스타그램 @pnu_ibe)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/rental-status")}
            className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium text-sm"
          >
            내 대여 현황 확인
          </button>
          <button
            onClick={onReset}
            className="bg-gray-100 text-gray-700 py-3 rounded-md hover:bg-gray-200 font-medium text-sm border"
          >
            추가 물품 대여하기
          </button>
        </div>
      </div>
    </div>
  );
};
