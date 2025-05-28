import React from "react";
import { NextRouter } from "next/router";
import { motion } from "framer-motion";

interface CompleteStepProps {
  router: NextRouter;
}

export default function CompleteStep({ router }: CompleteStepProps) {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative inline-block">
          <svg
            className="mx-auto h-20 w-20 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
        </div>
      </motion.div>

      <motion.h2
        className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        🎉 반납 완료!
      </motion.h2>

      <motion.div
        className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <p className="text-green-800 text-lg font-semibold mb-2">
          ✅ 반납이 자동으로 처리되었습니다
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">
          별도의 승인 과정 없이 바로 반납 완료되었습니다.
          <br />
          관리자에게 자동으로 알림이 전송되었으니 안심하세요!
        </p>
      </motion.div>

      <motion.div
        className="mb-6 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="text-lg">
          PNU 정보대학 학생회 복지 프로그램을
          <br />
          이용해주셔서 감사합니다! 💙
        </p>
      </motion.div>

      <motion.button
        onClick={() => router.push("/")}
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        홈으로 돌아가기
      </motion.button>
    </motion.div>
  );
}
