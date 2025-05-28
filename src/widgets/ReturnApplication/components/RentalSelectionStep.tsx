import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  FirestoreRentalApplication,
  FirestoreRentalItem,
} from "../../../shared/services/firestore";
import { StudentIdInfo } from "../../../shared/services/clientOcrService";

interface RentalSelectionStepProps {
  studentInfo: StudentIdInfo | null;
  currentRentals: FirestoreRentalApplication[];
  rentalItems: { [id: string]: FirestoreRentalItem };
  isLoading: boolean;
  onRentalSelect: (rental: FirestoreRentalApplication) => void;
  onReset: () => void;
  isOverdue: (rental: FirestoreRentalApplication) => boolean;
  getOverdueDays: (rental: FirestoreRentalApplication) => number;
}

// 날짜 형식을 읽기 쉽게 변환하는 함수
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dateStr} (${timeStr})`;
  } catch {
    return dateString;
  }
};

export default function RentalSelectionStep({
  studentInfo,
  currentRentals,
  rentalItems,
  isLoading,
  onRentalSelect,
  onReset,
  isOverdue,
  getOverdueDays,
}: RentalSelectionStepProps) {
  const router = useRouter();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="inline-flex items-center px-3 py-2 sm:px-4 rounded-full bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 mb-4">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-semibold text-blue-600">
            2단계: 물품 선택
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          반납할 물품 선택
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          {studentInfo?.name}님이 대여 중인 물품 중 반납할 물품을 선택하세요
        </p>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">대여 중인 물품을 불러오는 중...</div>
        </div>
      ) : currentRentals.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <div className="text-gray-500 text-sm sm:text-base">
            현재 대여 중인 물품이 없습니다.
          </div>
          <button
            onClick={() => router.push("/rental-application")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
          >
            물품 대여하기
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {currentRentals.map((rental) => {
            const item = rentalItems[rental.itemId];
            const overdueStatus = isOverdue(rental);
            const daysOverdue = overdueStatus ? getOverdueDays(rental) : 0;

            return (
              <motion.div
                key={rental.id}
                className="border border-gray-200/60 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm"
                onClick={() => onRentalSelect(rental)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 모바일: 세로 레이아웃, 태블릿+: 가로 레이아웃 */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* 이미지와 제목 */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {item?.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-cover rounded-lg sm:w-16 sm:h-16"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base leading-tight">
                          {item?.name || "물품 정보 없음"}
                        </h3>
                        {overdueStatus && (
                          <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full whitespace-nowrap">
                            연체 {daysOverdue}일
                          </span>
                        )}
                      </div>
                      {item?.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 상세 정보 */}
                  <div className="flex-1 space-y-2">
                    <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <p className="font-medium text-gray-700">대여기간:</p>
                        <p>
                          {formatDate(rental.rentDate)} ~{" "}
                          {formatDate(rental.dueDate)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <p className="font-medium text-gray-700">대여목적:</p>
                        <p className="line-clamp-1">{rental.purpose}</p>
                      </div>
                    </div>

                    {overdueStatus && (
                      <div className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                        <p>
                          ⚠️ 반납 예정일이 {daysOverdue}일 지났습니다. 빠른 반납
                          부탁드립니다.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 반납 버튼 */}
                  <div className="flex-shrink-0">
                    <button className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base font-medium">
                      반납 신청
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={onReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          처음부터 다시
        </button>
      </div>
    </div>
  );
}
