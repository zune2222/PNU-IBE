import React from "react";
import { RentalStep } from "../types";

interface ProgressIndicatorProps {
  step: RentalStep;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  step,
}) => {
  return (
    <>
      {/* 진행 단계 표시 - 모바일 뷰 */}
      <div className="bg-white border-b md:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="py-4">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    step === "verify"
                      ? "w-1/3 bg-blue-500"
                      : step === "select"
                      ? "w-2/3 bg-green-500"
                      : step === "password"
                      ? "w-full bg-green-500"
                      : step === "photos"
                      ? "w-full bg-green-500"
                      : "w-full bg-green-500"
                  }`}
                ></div>
              </div>
              <div className="flex justify-between">
                <div
                  className={`${
                    step === "verify"
                      ? "text-blue-600 font-medium"
                      : step === "select"
                      ? "text-green-600"
                      : step === "password"
                      ? "text-blue-600"
                      : step === "photos"
                      ? "text-blue-600"
                      : "text-gray-400"
                  } text-xs`}
                >
                  학생증 인증
                </div>
                <div
                  className={`${
                    step === "select"
                      ? "text-blue-600 font-medium"
                      : step === "password"
                      ? "text-green-600"
                      : step === "photos"
                      ? "text-green-600"
                      : "text-gray-400"
                  } text-xs`}
                >
                  물품 선택
                </div>
                <div
                  className={`${
                    step === "password"
                      ? "text-blue-600 font-medium"
                      : step === "photos"
                      ? "text-green-600"
                      : "text-gray-400"
                  } text-xs`}
                >
                  비밀번호 제공
                </div>
                <div
                  className={`${
                    step === "photos"
                      ? "text-blue-600 font-medium"
                      : "text-gray-400"
                  } text-xs`}
                >
                  사진 촬영
                </div>
                <div
                  className={`${
                    step === "complete"
                      ? "text-blue-600 font-medium"
                      : "text-gray-400"
                  } text-xs`}
                >
                  신청 완료
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 진행 단계 표시 - 데스크톱 뷰 */}
      <div className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div
                className={`flex items-center ${
                  step === "verify"
                    ? "text-blue-600"
                    : step === "select" ||
                      step === "password" ||
                      step === "photos" ||
                      step === "complete"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "verify"
                      ? "bg-blue-100"
                      : step === "select" ||
                        step === "password" ||
                        step === "photos" ||
                        step === "complete"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  1
                </div>
                <span className="ml-2">학생증 인증</span>
              </div>
              <div
                className={`w-8 h-px ${
                  step === "select" ||
                  step === "password" ||
                  step === "photos" ||
                  step === "complete"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
              <div
                className={`flex items-center ${
                  step === "select"
                    ? "text-blue-600"
                    : step === "password"
                    ? "text-green-600"
                    : step === "photos"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "select"
                      ? "bg-blue-100"
                      : step === "password"
                      ? "bg-green-100"
                      : step === "photos"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  2
                </div>
                <span className="ml-2">물품 선택</span>
              </div>
              <div
                className={`w-8 h-px ${
                  step === "password" ||
                  step === "photos" ||
                  step === "complete"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
              <div
                className={`flex items-center ${
                  step === "password"
                    ? "text-blue-600"
                    : step === "photos"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "password" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  3
                </div>
                <span className="ml-2">비밀번호 제공</span>
              </div>
              <div
                className={`w-8 h-px ${
                  step === "photos" ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <div
                className={`flex items-center ${
                  step === "photos" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "photos" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  4
                </div>
                <span className="ml-2">사진 촬영</span>
              </div>
              <div
                className={`w-8 h-px ${
                  step === "complete" ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <div
                className={`flex items-center ${
                  step === "complete" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "complete" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  5
                </div>
                <span className="ml-2">신청 완료</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
