import React from "react";
import Head from "next/head";
import { StudentIdUpload } from "../widgets/StudentIdUpload";
import useRentalApplication from "../widgets/RentalApplication/hooks";
import { ProgressIndicator } from "../widgets/RentalApplication/components/ProgressIndicator";
import { ItemSelection } from "../widgets/RentalApplication/components/ItemSelection";
import { PasswordStep } from "../widgets/RentalApplication/components/PasswordStep";
import { PhotoCapture } from "../widgets/RentalApplication/components/PhotoCapture";
import { CompletionStep } from "../widgets/RentalApplication/components/CompletionStep";
import { MessageDisplay } from "../widgets/RentalApplication/components/MessageDisplay";

export default function RentalApplication() {
  const {
    // 상태
    loading,
    availableItems,
    selectedItem,
    isLoading,
    step,
    applicationForm,
    photos,
    errors,
    successMessage,
    rentalDueDate,
    router,

    // 액션
    setStep,
    setApplicationForm,
    setPhotos,
    handleStudentIdSuccess,
    handleStudentIdError,
    handleItemSelect,
    handleRentalProcess,
    resetApplication,
  } = useRentalApplication();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <div className="text-base sm:text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>물품 대여 신청 - PNU IBE</title>
      </Head>

      <div className="min-h-screen bg-gray-50 pb-16">
        {/* 헤더 */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 sm:py-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  물품 대여 신청
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  PNU 정보대학 학생회 복지 프로그램
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>

        {/* 진행 단계 표시 */}
        <ProgressIndicator step={step} />

        {/* 메인 컨텐츠 */}
        <div className="max-w-xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* 메시지 표시 */}
          <MessageDisplay errors={errors} successMessage={successMessage} />

          {/* 단계별 컨텐츠 */}
          {step === "verify" && (
            <StudentIdUpload
              onSuccess={handleStudentIdSuccess}
              onError={handleStudentIdError}
            />
          )}

          {step === "select" && (
            <ItemSelection
              availableItems={availableItems}
              isLoading={isLoading}
              onItemSelect={handleItemSelect}
            />
          )}

          {step === "password" && selectedItem && (
            <PasswordStep
              selectedItem={selectedItem}
              applicationForm={applicationForm}
              errors={errors}
              onApplicationFormChange={setApplicationForm}
              onNextStep={() => setStep("photos")}
              onReset={resetApplication}
            />
          )}

          {step === "photos" && selectedItem && (
            <PhotoCapture
              selectedItem={selectedItem}
              photos={photos}
              errors={errors}
              isLoading={isLoading}
              onPhotosChange={setPhotos}
              onSubmit={handleRentalProcess}
              onReset={resetApplication}
            />
          )}

          {step === "complete" && (
            <CompletionStep
              selectedItem={selectedItem}
              rentalDueDate={rentalDueDate}
              router={router}
              onReset={resetApplication}
            />
          )}
        </div>
      </div>
    </>
  );
}
