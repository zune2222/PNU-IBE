import React from "react";
import { motion } from "framer-motion";
import { NextRouter } from "next/router";
import { FirestoreRentalItem } from "../../../shared/services/firestore";

interface CompletionStepProps {
  selectedItem: FirestoreRentalItem | null;
  rentalDueDate: Date | null;
  router: NextRouter;
  onReset: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  selectedItem,
  rentalDueDate,
  router,
  onReset,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const dueDate =
    rentalDueDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="inline-flex items-center px-3 py-2 sm:px-4 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 mb-3 sm:mb-4">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 sm:mr-3 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-semibold text-emerald-600 korean-text">
            5단계: 신청 완료
          </span>
        </div>
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent korean-text mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          대여 완료! 🎉
        </motion.h2>
        <p className="text-sm sm:text-base text-gray-600 korean-text px-4">
          물품 대여가 성공적으로 완료되었습니다
        </p>
      </motion.div>

      {/* 신청 완료 메시지 */}
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-gradient-to-br from-emerald-50/90 to-green-50/90 backdrop-blur-sm border border-emerald-200/60 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
          <motion.div
            className="flex justify-center mb-3 sm:mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              type: "spring",
              stiffness: 200,
            }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </motion.div>
          <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-2 sm:mb-3 korean-text">
            대여가 완료되었습니다!
          </h3>
          <p className="text-sm sm:text-base text-emerald-700 korean-text leading-relaxed px-2">
            이제 물품을 사용하실 수 있습니다. 반납 기한을 꼭 지켜주세요!
          </p>
        </div>

        {/* 반납 기한 강조 */}
        <motion.div
          className="bg-gradient-to-br from-red-50/90 to-orange-50/90 backdrop-blur-sm border border-red-200/60 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-2 sm:mr-3">
              <span className="text-xl sm:text-2xl">⏰</span>
            </div>
            <h4 className="font-bold text-red-800 text-base sm:text-lg korean-text">
              반납 기한
            </h4>
          </div>

          <motion.div
            className="bg-white/90 backdrop-blur-sm border-2 border-red-300/60 rounded-xl p-4 sm:p-6 text-center shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.p
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-800 mb-2 korean-text leading-tight"
              animate={{ color: ["#991b1b", "#dc2626", "#991b1b"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formatDate(dueDate)}
            </motion.p>
            <p className="text-lg sm:text-xl font-semibold text-red-700 mb-2 sm:mb-3 korean-text">
              {formatTime(dueDate)}
            </p>
            <p className="text-xs sm:text-sm text-red-700 mb-2 korean-text px-2">
              (현재 시간으로부터 정확히 24시간 후)
            </p>
            <div className="bg-red-100/80 rounded-lg p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-red-600 korean-text font-medium">
                ⚠️ 반납 기한을 넘기면 연체료 및 벌점이 부과됩니다
              </p>
            </div>
          </motion.div>
        </motion.div>

        {selectedItem && (
          <motion.div
            className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-left shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h4 className="font-bold text-gray-800 mb-3 sm:mb-4 korean-text flex items-center text-sm sm:text-base">
              <span className="text-lg sm:text-xl mr-2">📦</span>
              대여 물품 정보
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {[
                { label: "물품명", value: selectedItem.name },
                {
                  label: "위치",
                  value: `${
                    selectedItem.campus === "yangsan"
                      ? "양산캠퍼스"
                      : "장전캠퍼스"
                  } ${selectedItem.location}`,
                },
                {
                  label: "대여일",
                  value: new Date().toLocaleDateString("ko-KR"),
                },
                {
                  label: "반납일",
                  value: `${formatDate(dueDate)} ${formatTime(dueDate)}`,
                  isImportant: true,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200/60 last:border-b-0 gap-1 sm:gap-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <span className="font-medium text-gray-700 korean-text text-sm sm:text-base">
                    {item.label}:
                  </span>
                  <span
                    className={`korean-text text-sm sm:text-base break-words sm:text-right ${
                      item.isImportant
                        ? "text-red-600 font-bold"
                        : "text-gray-900"
                    }`}
                  >
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 반납 방법 및 주의사항 */}
        <motion.div
          className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-blue-200/60 rounded-2xl p-4 sm:p-6 text-left mb-6 sm:mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h4 className="font-bold text-blue-800 mb-3 sm:mb-4 korean-text flex items-center text-sm sm:text-base">
            <span className="text-lg sm:text-xl mr-2">📋</span>
            반납 방법 및 주의사항
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {[
              {
                title: "반납 장소",
                content: `${
                  selectedItem?.campus === "yangsan"
                    ? "양산캠퍼스"
                    : "장전캠퍼스"
                } ${selectedItem?.location} (대여한 곳과 동일)`,
              },
              {
                title: "반납 방법",
                content: "물품을 원래 보관함에 넣고 자물쇠로 잠그기",
              },
              {
                title: "연체 시",
                content: "하루당 벌점 1점, 3회 연체 시 한 달 이용 정지",
                isWarning: true,
              },
              {
                title: "분실/파손 시",
                content: "즉시 학생회에 연락, 수리비/구매비 본인 부담",
                isWarning: true,
              },
              {
                title: "문의",
                content: "정보대학 학생회 (인스타그램 @pnu_ibe)",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              >
                <span className="font-semibold text-primary mr-2 korean-text text-sm sm:text-base flex-shrink-0">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <span className="font-medium text-blue-800 korean-text text-sm sm:text-base">
                    {item.title}:
                  </span>
                  <span
                    className={`ml-1 korean-text text-sm sm:text-base break-words ${
                      item.isWarning
                        ? "text-red-600 font-medium"
                        : "text-blue-700"
                    }`}
                  >
                    {item.content}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.button
            onClick={() => router.push("/")}
            className="w-full px-4 py-3 sm:px-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg korean-text text-sm sm:text-base min-h-[48px] touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            홈으로 돌아가기
          </motion.button>
          <motion.button
            onClick={onReset}
            className="w-full px-4 py-3 sm:px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md korean-text text-sm sm:text-base min-h-[48px] touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            추가 대여하기
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
