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
  { key: "password", label: "비밀번호", number: 4 },
  { key: "lockbox", label: "자물쇠 확인", number: 5 },
  { key: "complete", label: "완료", number: 6 },
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
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-8">
            {steps.map((stepInfo, index) => (
              <React.Fragment key={stepInfo.key}>
                <div
                  className={`flex items-center ${
                    currentStep === stepInfo.key
                      ? "text-blue-600"
                      : currentStepIndex > index
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === stepInfo.key
                        ? "bg-blue-100"
                        : currentStepIndex > index
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {stepInfo.number}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {stepInfo.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-px ${
                      currentStepIndex > index ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
