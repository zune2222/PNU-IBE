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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-6 sm:mb-8"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-4">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
          <span className="text-sm font-semibold text-green-600">
            2단계: 물품 선택
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          반납할 물품 선택
        </h2>
        <p className="text-gray-600">
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
          <div className="text-gray-500 mb-4">
            현재 대여 중인 물품이 없습니다.
          </div>
          <button
            onClick={() => router.push("/rental-application")}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            물품 대여하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {currentRentals.map((rental) => {
            const item = rentalItems[rental.itemId];
            const overdueStatus = isOverdue(rental);
            const daysOverdue = overdueStatus ? getOverdueDays(rental) : 0;

            return (
              <motion.div
                key={rental.id}
                className="border border-gray-200/60 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm hover:bg-white/70"
                onClick={() => onRentalSelect(rental)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 모바일: 세로 레이아웃, 태블릿+: 가로 레이아웃 */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* 이미지와 제목 */}
                  <div className="flex items-center space-x-4">
                    {item?.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 text-base sm:text-lg leading-tight">
                          {item?.name || "물품 정보 없음"}
                        </h3>
                        {overdueStatus && (
                          <span className="ml-3 px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full whitespace-nowrap">
                            연체 {daysOverdue}일
                          </span>
                        )}
                      </div>
                      {item?.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 상세 정보 */}
                  <div className="flex-1 space-y-2">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-700">
                          대여기간
                        </span>
                        <span className="text-gray-600">
                          {formatDate(rental.rentDate)} ~{" "}
                          {formatDate(rental.dueDate)}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-700">
                          대여목적
                        </span>
                        <span className="text-gray-600 line-clamp-2">
                          {rental.purpose}
                        </span>
                      </div>
                    </div>

                    {overdueStatus && (
                      <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                        <p>
                          ⚠️ 반납 예정일이 {daysOverdue}일 지났습니다. 빠른 반납
                          부탁드립니다.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 반납 버튼 */}
                  <div className="flex-shrink-0">
                    <button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      반납 신청
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          처음부터 다시
        </button>
      </div>
    </div>
  );
}
