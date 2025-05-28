import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageDisplayProps {
  errors: { [key: string]: string };
  successMessage: string;
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  errors,
  successMessage,
}) => {
  return (
    <AnimatePresence>
      {/* 에러 메시지 */}
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/60 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-start">
              <motion.div
                className="flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
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
              </motion.div>
              <motion.div
                className="ml-4 flex-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-sm font-semibold text-red-800 mb-1 korean-text">
                  오류가 발생했습니다
                </h3>
                <p className="text-sm text-red-700 korean-text leading-relaxed">
                  {errors.general}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 성공 메시지 */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="bg-emerald-50/90 backdrop-blur-sm border border-emerald-200/60 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-start">
              <motion.div
                className="flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
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
              </motion.div>
              <motion.div
                className="ml-4 flex-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-sm font-semibold text-emerald-800 mb-1 korean-text">
                  성공적으로 처리되었습니다
                </h3>
                <p className="text-sm text-emerald-700 korean-text leading-relaxed">
                  {successMessage}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
