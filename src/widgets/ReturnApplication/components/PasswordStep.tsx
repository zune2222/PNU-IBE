import React from "react";
import { motion } from "framer-motion";
import {
  FirestoreRentalApplication,
  FirestoreRentalItem,
} from "../../../shared/services/firestore";

interface PasswordStepProps {
  selectedRental: FirestoreRentalApplication;
  rentalItems: { [id: string]: FirestoreRentalItem };
  lockboxPassword: string;
  onBack: () => void;
  onNext: () => void;
}

export default function PasswordStep({
  selectedRental,
  rentalItems,
  lockboxPassword,
  onBack,
  onNext,
}: PasswordStepProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-4">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
          <span className="text-sm font-semibold text-green-600">
            4단계: 자물쇠 비밀번호
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          보관함 비밀번호 확인
        </h2>
        <p className="text-gray-600">물품을 보관함에 넣고 자물쇠를 잠그세요</p>
      </motion.div>

      {/* 자물쇠 비밀번호 표시 */}
      <motion.div
        className="bg-gradient-to-br from-green-50/90 to-blue-50/90 backdrop-blur-sm border border-green-200/60 rounded-2xl p-6 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-green-800">자물쇠 비밀번호</h3>
        </div>

        <motion.div
          className="bg-white/90 backdrop-blur-sm border border-green-300/60 rounded-xl p-6 text-center shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm text-green-600 mb-2">보관함 자물쇠 비밀번호</p>
          <motion.p
            className="text-4xl font-mono font-bold text-green-800 mb-3 tracking-wider"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {lockboxPassword}
          </motion.p>
          <div className="flex items-center justify-center text-sm text-green-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {rentalItems[selectedRental.itemId]?.campus === "yangsan"
                ? "양산캠퍼스"
                : "장전캠퍼스"}{" "}
              {rentalItems[selectedRental.itemId]?.location}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 p-4 bg-green-100/50 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-start">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3 mt-0.5">
              <span className="text-white text-sm">💡</span>
            </div>
            <div className="text-sm text-green-700 leading-relaxed">
              <p className="font-semibold mb-1">반납 절차:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>물품을 보관함에 넣어주세요</li>
                <li>위 비밀번호로 자물쇠를 잠가주세요</li>
                <li>다음 단계에서 잠긴 자물쇠 사진을 촬영해주세요</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          이전
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
        >
          자물쇠 잠금 완료
        </button>
      </div>
    </div>
  );
}
