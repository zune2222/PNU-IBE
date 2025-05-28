import React from "react";
import { motion } from "framer-motion";
import { RentalStep } from "../types";

interface ProgressIndicatorProps {
  step: RentalStep;
}

const steps = [
  { key: "verify", label: "학생증 인증", icon: "🎓" },
  { key: "select", label: "물품 선택", icon: "📦" },
  { key: "password", label: "비밀번호 제공", icon: "🔐" },
  { key: "photos", label: "사진 촬영", icon: "📸" },
  { key: "complete", label: "신청 완료", icon: "✅" },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  step,
}) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex((s) => s.key === step);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-white/60 shadow-sm relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 모바일 뷰 */}
        <div className="md:hidden">
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
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse" />
            </div>

            {/* 현재 단계 표시 */}
            <div className="text-center">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
              >
                <span className="text-lg mr-2">
                  {steps[currentStepIndex]?.icon}
                </span>
                <span className="text-sm font-semibold text-primary korean-text">
                  {currentStepIndex + 1}단계: {steps[currentStepIndex]?.label}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 데스크톱 뷰 */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.key}>
                {/* 단계 아이템 */}
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center">
                    {/* 단계 원 */}
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg border-2 transition-all duration-300 ${
                        index <= currentStepIndex
                          ? "bg-gradient-to-br from-primary to-secondary text-white border-primary/30"
                          : "bg-white/80 backdrop-blur-sm text-gray-400 border-gray-300"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      animate={
                        index === currentStepIndex
                          ? {
                              boxShadow: [
                                "0 0 0 0 rgba(99, 102, 241, 0.4)",
                                "0 0 0 10px rgba(99, 102, 241, 0)",
                                "0 0 0 0 rgba(99, 102, 241, 0)",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: index === currentStepIndex ? Infinity : 0,
                      }}
                    >
                      {index <= currentStepIndex ? (
                        <span>{stepItem.icon}</span>
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </motion.div>

                    {/* 단계 라벨 */}
                    <motion.span
                      className={`mt-2 text-sm font-medium korean-text transition-colors duration-300 ${
                        index <= currentStepIndex
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                      animate={
                        index === currentStepIndex
                          ? {
                              color: ["#6366f1", "#8b5cf6", "#6366f1"],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: index === currentStepIndex ? Infinity : 0,
                      }}
                    >
                      {stepItem.label}
                    </motion.span>
                  </div>
                </motion.div>

                {/* 연결선 */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="mx-4 h-px w-16 relative"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                  >
                    <div className="absolute inset-0 bg-gray-300 rounded-full" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index < currentStepIndex ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
