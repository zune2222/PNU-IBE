import React from "react";
import { motion } from "framer-motion";
import { ReturnStep } from "../hooks/useReturnApplication";

interface ReturnStepIndicatorProps {
  currentStep: ReturnStep;
}

const steps = [
  { key: "verify", label: "학생 인증", number: 1 },
  { key: "select", label: "물품 선택", number: 2 },
  { key: "photos", label: "사진 업로드", number: 3 },
  { key: "lockbox", label: "자물쇠 확인", number: 4 },
  { key: "complete", label: "완료", number: 5 },
] as const;

export default function ReturnStepIndicator({
  currentStep,
}: ReturnStepIndicatorProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm border-b border-white/60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 모바일 뷰 */}
        <div className="md:hidden py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* 진행률 바 */}
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* 현재 단계 표시 */}
            {/* <div className="text-center">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
              >
                <span className="w-6 h-6 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {steps[currentStepIndex]?.number}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {currentStepIndex + 1}단계: {steps[currentStepIndex]?.label}
                </span>
              </motion.div>
            </div> */}
          </motion.div>
        </div>

        {/* 데스크톱 뷰 */}
        <div className="hidden md:flex items-center justify-center py-4">
          <div className="flex items-center space-x-8">
            {steps.map((stepInfo, index) => (
              <React.Fragment key={stepInfo.key}>
                <motion.div
                  className={`flex items-center ${
                    currentStep === stepInfo.key
                      ? "text-primary"
                      : currentStepIndex > index
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === stepInfo.key
                        ? "bg-primary/10 text-primary"
                        : currentStepIndex > index
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    animate={
                      currentStep === stepInfo.key
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(var(--color-primary), 0.4)",
                              "0 0 0 10px rgba(var(--color-primary), 0)",
                              "0 0 0 0 rgba(var(--color-primary), 0)",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: currentStep === stepInfo.key ? Infinity : 0,
                    }}
                  >
                    {stepInfo.number}
                  </motion.div>
                  <span className="ml-2 text-sm font-medium">
                    {stepInfo.label}
                  </span>
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    className="relative"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                  >
                    <div className="w-8 h-px bg-gray-300" />
                    <motion.div
                      className="absolute inset-0 bg-primary origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: currentStepIndex > index ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
