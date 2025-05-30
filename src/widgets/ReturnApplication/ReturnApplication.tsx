import React from "react";
import { motion } from "framer-motion";
import { StudentIdUpload } from "../StudentIdUpload";
import useReturnApplication from "./hooks/useReturnApplication";
import ReturnStepIndicator from "./components/ReturnStepIndicator";
import RentalSelectionStep from "./components/RentalSelectionStep";
import PhotoUploadStep from "./components/PhotoUploadStep";
import LockboxConfirmStep from "./components/LockboxConfirmStep";
import CompleteStep from "./components/CompleteStep";

export default function ReturnApplication() {
  const {
    // 상태
    step,
    isLoading,
    studentInfo,
    currentRentals,
    rentalItems,
    selectedRental,
    photos,
    router,
    lockboxPassword,

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* 배경 요소들 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-3xl animate-pulse delay-1000"></div>
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
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
        {/* 단계별 컴포넌트 렌더링 */}
        {step === "verify" && (
          <StudentIdUpload
            onSuccess={handleStudentIdSuccess}
            onError={handleStudentIdError}
          />
        )}

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

        {step === "photos" && selectedRental && (
          <PhotoUploadStep
            selectedRental={selectedRental}
            rentalItems={rentalItems}
            photos={photos}
            errors={{}}
            isLoading={isLoading}
            onPhotoUploadSuccess={handlePhotoUploadSuccess}
            onPhotoUploadError={handlePhotoUploadError}
            onProvidePassword={handleProvidePassword}
            onBack={() => setStep("select")}
          />
        )}

        {step === "lockbox" && selectedRental && (
          <LockboxConfirmStep
            photos={photos}
            errors={{}}
            isLoading={isLoading}
            lockboxPassword={lockboxPassword}
            onPhotoUploadSuccess={handlePhotoUploadSuccess}
            onPhotoUploadError={handlePhotoUploadError}
            onCompleteReturn={handleCompleteReturn}
            onBack={() => setStep("photos")}
          />
        )}

        {step === "complete" && <CompleteStep router={router} />}
      </div>
    </div>
  );
}
