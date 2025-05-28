import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { StudentIdUpload } from "../widgets/StudentIdUpload";
import useRentalApplication from "../widgets/RentalApplication/hooks";
import { ProgressIndicator } from "../widgets/RentalApplication/components/ProgressIndicator";
import { ItemSelection } from "../widgets/RentalApplication/components/ItemSelection";
import { PasswordStep } from "../widgets/RentalApplication/components/PasswordStep";
import { PhotoCapture } from "../widgets/RentalApplication/components/PhotoCapture";
import { CompletionStep } from "../widgets/RentalApplication/components/CompletionStep";

export default function RentalApplication() {
  const {
    // 상태
    loading,
    availableItems,
    selectedItem,
    isLoading,
    step,
    verifiedStudentInfo,
    applicationForm,
    photos,
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
    handleRentalCompleted,
    resetApplication,
  } = useRentalApplication();

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
    <>
      <Head>
        <title>물품 대여 신청 - PNU IBE</title>
      </Head>

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
            <div className="flex justify-between items-center py-4 sm:py-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 min-w-0"
              >
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent truncate">
                  물품 대여 신청
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                  PNU 정보대학 학생회 복지 프로그램
                </p>
              </motion.div>
              <motion.button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md ml-4 flex-shrink-0"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ProgressIndicator step={step} />
        </motion.div>

        {/* 메인 컨텐츠 */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
          {/* 단계별 컨텐츠 */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
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

            {step === "password" && selectedItem && verifiedStudentInfo && (
              <PasswordStep
                selectedItem={selectedItem}
                applicationForm={applicationForm}
                verifiedStudentInfo={verifiedStudentInfo}
                onApplicationFormChange={setApplicationForm}
                onNextStep={() => setStep("photos")}
                onReset={resetApplication}
                onRentalCompleted={handleRentalCompleted}
              />
            )}

            {step === "photos" && selectedItem && (
              <PhotoCapture
                selectedItem={selectedItem}
                photos={photos}
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
          </motion.div>
        </div>
      </div>
    </>
  );
}
