import React from "react";
import { FirestoreRentalItem } from "../../../shared/services/firestore";
import { RentalApplicationForm } from "../types";

interface PasswordStepProps {
  selectedItem: FirestoreRentalItem;
  applicationForm: RentalApplicationForm;
  errors: { [key: string]: string };
  onApplicationFormChange: (form: RentalApplicationForm) => void;
  onNextStep: () => void;
  onReset: () => void;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  selectedItem,
  applicationForm,
  errors,
  onApplicationFormChange,
  onNextStep,
  onReset,
}) => {
  const handleSubmit = () => {
    // 신청 정보 유효성 검사
    const newErrors: { [key: string]: string } = {};

    if (!applicationForm.agreement) {
      newErrors.agreement = "약관에 동의해주세요.";
    }

    if (Object.keys(newErrors).length === 0) {
      onNextStep();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          자물쇠 비밀번호 확인
        </h2>
        <button
          onClick={onReset}
          className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 py-1 px-2 border border-gray-300 rounded"
        >
          물품 다시 선택
        </button>
      </div>

      {/* 선택된 물품 정보 */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
          선택한 물품
        </h3>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <img
            src={selectedItem.image}
            alt={selectedItem.name}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
          />
          <div>
            <p className="font-medium text-sm sm:text-base">
              {selectedItem.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
              {selectedItem.description}
            </p>
            <p className="text-xs text-gray-500">
              {selectedItem.campus === "yangsan" ? "양산캠퍼스" : "장전캠퍼스"}
            </p>
          </div>
        </div>
      </div>

      {/* 자물쇠 비밀번호 표시 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-800 mb-3">🔒 자물쇠 비밀번호</h3>
        <div className="bg-white border border-blue-300 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-600 mb-2">보관함 자물쇠 비밀번호</p>
          <p className="text-3xl font-mono font-bold text-blue-800 mb-2">
            {selectedItem.lockboxPassword || "1234"}
          </p>
          <p className="text-xs text-blue-600">
            위치:{" "}
            {selectedItem.campus === "yangsan" ? "양산캠퍼스" : "장전캠퍼스"}{" "}
            {selectedItem.location}
          </p>
        </div>
        <div className="mt-3 text-xs text-blue-700">
          💡 이 비밀번호로 보관함을 열고 물품을 확인한 후 다음 단계로
          진행해주세요.
        </div>
      </div>

      {/* 대여 신청 정보 */}
      <div className="border-t pt-4 sm:pt-6">
        <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
          대여 신청 정보
        </h3>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start space-x-3">
            <div
              className={`flex items-center justify-center w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 ${
                applicationForm.agreement
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300 hover:border-blue-400"
              }`}
              onClick={() =>
                onApplicationFormChange({
                  ...applicationForm,
                  agreement: !applicationForm.agreement,
                })
              }
            >
              {applicationForm.agreement && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="text-sm">
              <label
                className="font-medium text-gray-700 cursor-pointer"
                onClick={() =>
                  onApplicationFormChange({
                    ...applicationForm,
                    agreement: !applicationForm.agreement,
                  })
                }
              >
                대여 약관에 동의합니다
              </label>
              <p className="text-xs text-gray-500 mt-1">
                물품 손상 시 수리비 부담, 연체 시 벌점 부과 등에 동의합니다
              </p>
            </div>
          </div>
          {errors.agreement && (
            <p className="text-red-600 text-xs mt-1">{errors.agreement}</p>
          )}

          {/* 상세 약관 내용 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs">
            <h4 className="font-medium text-gray-900 mb-2">
              📋 대여 약관 상세 내용
            </h4>
            <div className="space-y-2 text-gray-700">
              <div>
                <strong>1. 대여 기간:</strong> 24시간 (익일 같은 시간까지)
              </div>
              <div>
                <strong>2. 연체 시:</strong> 하루당 벌점 1점 부과, 3회 연체 시
                한 달 이용 정지
              </div>
              <div>
                <strong>3. 물품 손상 시:</strong> 수리비 실비 부담 (영수증 제공)
              </div>
              <div>
                <strong>4. 물품 분실 시:</strong> 동일 물품 재구매 비용 부담
              </div>
              <div>
                <strong>5. 주의사항:</strong> 대여 중 제3자에게 양도 금지, 타인
                명의 대여 금지
              </div>
              <div>
                <strong>6. 문의:</strong> 정보대학 학생회 (양산캠퍼스 학생회실)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 shadow-sm"
        >
          사진 촬영하기
        </button>
      </div>
    </div>
  );
};
