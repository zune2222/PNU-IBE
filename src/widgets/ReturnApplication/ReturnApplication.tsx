import React from "react";
import { motion } from "framer-motion";
import { useToast } from "../../shared/components/Toast";
import { StudentIdUpload } from "../StudentIdUpload";
import useReturnApplication from "./hooks/useReturnApplication";
import ReturnStepIndicator from "./components/ReturnStepIndicator";
import RentalSelectionStep from "./components/RentalSelectionStep";
import PhotoUploadStep from "./components/PhotoUploadStep";
import LockboxConfirmStep from "./components/LockboxConfirmStep";
import CompleteStep from "./components/CompleteStep";

export default function ReturnApplication() {
  const { showToast } = useToast();
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

  React.useEffect(() => {
    // 페이지 로드 시 이전 상태가 복원되었는지 확인
    if (step !== "verify" && step !== "complete") {
      showToast({
        type: "info",
        message:
          "이전 진행 상태를 복원했습니다. 사진 앱 사용 후에도 입력한 정보가 안전하게 보관됩니다.",
      });
    }
  }, [step, showToast]);

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
        {/* 단계별 컴포넌트 렌더링 */}
        {step === "verify" && (
          <StudentIdUpload
            onSuccess={handleStudentIdSuccess}
            onError={handleStudentIdError}
          />
        )}

        {step === "select" && (
          <RentalSelectionStep
            currentRentals={currentRentals}
            rentalItems={rentalItems}
            onRentalSelect={handleRentalSelect}
            isOverdue={isOverdue}
            getOverdueDays={getOverdueDays}
          />
        )}

        {step === "photos" && selectedRental && (
          <PhotoUploadStep
            rental={selectedRental}
            item={rentalItems[selectedRental.itemId]}
            photos={photos}
            onPhotoUploadSuccess={handlePhotoUploadSuccess}
            onPhotoUploadError={handlePhotoUploadError}
            onNext={handleProvidePassword}
            isLoading={isLoading}
          />
        )}

        {step === "lockbox" && selectedRental && (
          <LockboxConfirmStep
            rental={selectedRental}
            item={rentalItems[selectedRental.itemId]}
            photos={photos}
            onPhotoUploadSuccess={handlePhotoUploadSuccess}
            onPhotoUploadError={handlePhotoUploadError}
            onComplete={handleCompleteReturn}
            isLoading={isLoading}
          />
        )}

        {step === "complete" && <CompleteStep onReset={resetApplication} />}
      </div>
    </div>
  );
}
