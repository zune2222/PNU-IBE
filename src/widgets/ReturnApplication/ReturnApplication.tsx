import React from "react";
import { motion } from "framer-motion";
import { StudentIdUpload } from "../StudentIdUpload";
import useReturnApplication from "./hooks/useReturnApplication";
import ReturnStepIndicator from "./components/ReturnStepIndicator";
import RentalSelectionStep from "./components/RentalSelectionStep";
import PhotoUploadStep from "./components/PhotoUploadStep";
import PasswordStep from "./components/PasswordStep";
import LockboxConfirmStep from "./components/LockboxConfirmStep";
import CompleteStep from "./components/CompleteStep";

export default function ReturnApplication() {
  const {
    // 상태
    loading,
    step,
    isLoading,
    studentInfo,
    currentRentals,
    rentalItems,
    selectedRental,
    photos,
    lockboxPassword,
    errors,
    successMessage,
    router,

    // 액션
    setStep,
    handleStudentIdSuccess,
    handleStudentIdError,
    handleRentalSelect,
    handlePhotoUploadSuccess,
    handlePhotoUploadError,
    handleProvidePassword,
    handleCompleteReturn,
    resetApplication,
    isOverdue,
    getOverdueDays,
  } = useReturnApplication();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full animate-spin border-t-blue-500"></div>
          </div>
          <div className="text-lg font-medium text-gray-700 mt-4">
            로딩 중...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* 배경 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-green-500/10 to-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* 헤더 */}
      <motion.div
        className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/60 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                물품 반납 신청
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                PNU 정보대학 학생회 복지 프로그램
              </p>
            </motion.div>
            <motion.button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              홈으로
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 진행 단계 표시 */}
      <ReturnStepIndicator currentStep={step} />

      {/* 메인 컨텐츠 */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* 에러 메시지 */}
        {errors.general && (
          <motion.div
            className="mb-6 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 성공 메시지 */}
        {successMessage && (
          <motion.div
            className="mb-6 bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-xl p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 단계별 컨텐츠 */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          {/* Step 1: 학생증 인증 */}
          {step === "verify" && (
            <StudentIdUpload
              onSuccess={handleStudentIdSuccess}
              onError={handleStudentIdError}
            />
          )}

          {/* Step 2: 물품 선택 */}
          {step === "select" && (
            <RentalSelectionStep
              studentInfo={studentInfo}
              currentRentals={currentRentals}
              rentalItems={rentalItems}
              isLoading={isLoading}
              onRentalSelect={handleRentalSelect}
              onReset={resetApplication}
              isOverdue={isOverdue}
              getOverdueDays={getOverdueDays}
            />
          )}

          {/* Step 3: 사진 업로드 */}
          {step === "photos" && selectedRental && (
            <PhotoUploadStep
              selectedRental={selectedRental}
              rentalItems={rentalItems}
              photos={photos}
              errors={errors}
              isLoading={isLoading}
              onPhotoUploadSuccess={handlePhotoUploadSuccess}
              onPhotoUploadError={handlePhotoUploadError}
              onProvidePassword={handleProvidePassword}
              onBack={() => setStep("select")}
            />
          )}

          {/* Step 4: 자물쇠 비밀번호 제공 */}
          {step === "password" && selectedRental && (
            <PasswordStep
              selectedRental={selectedRental}
              rentalItems={rentalItems}
              lockboxPassword={lockboxPassword}
              onBack={() => setStep("photos")}
              onNext={() => setStep("lockbox")}
            />
          )}

          {/* Step 5: 자물쇠 잠금 확인 */}
          {step === "lockbox" && selectedRental && (
            <LockboxConfirmStep
              photos={photos}
              errors={errors}
              isLoading={isLoading}
              onPhotoUploadSuccess={handlePhotoUploadSuccess}
              onPhotoUploadError={handlePhotoUploadError}
              onCompleteReturn={handleCompleteReturn}
              onBack={() => setStep("password")}
            />
          )}

          {/* Step 6: 완료 */}
          {step === "complete" && <CompleteStep router={router} />}
        </motion.div>
      </div>
    </div>
  );
}
