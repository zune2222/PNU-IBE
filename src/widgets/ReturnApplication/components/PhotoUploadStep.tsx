import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PhotoUpload } from "../../PhotoUpload";
import {
  FirestoreRentalApplication,
  FirestoreRentalItem,
} from "../../../shared/services/firestore";
import { ReturnPhotos } from "../hooks/useReturnApplication";

interface PhotoUploadStepProps {
  selectedRental: FirestoreRentalApplication;
  rentalItems: { [id: string]: FirestoreRentalItem };
  photos: ReturnPhotos;
  errors: { [key: string]: string };
  isLoading: boolean;
  onPhotoUploadSuccess: (type: "item" | "label", url: string) => void;
  onPhotoUploadError: (error: string) => void;
  onProvidePassword: () => void;
  onBack: () => void;
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

export default function PhotoUploadStep({
  selectedRental,
  rentalItems,
  photos,
  errors,
  isLoading,
  onPhotoUploadSuccess,
  onPhotoUploadError,
  onProvidePassword,
  onBack,
}: PhotoUploadStepProps) {
  const item = rentalItems[selectedRental.itemId];

  return (
    <div className="space-y-6">
      {/* 단계 표시 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
          <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
          <span className="text-sm font-semibold text-primary">
            3단계: 사진 업로드
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          물품 상태 사진 업로드
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          물품 상태와 라벨을 촬영해주세요
        </p>
      </motion.div>

      {/* 선택된 물품 정보 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            반납 물품 정보
          </h3>
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors self-start sm:self-auto"
          >
            다른 물품 선택
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {item?.image && (
            <Image
              src={item.image}
              alt={item.name}
              width={64}
              height={64}
              className="object-cover rounded-lg self-start sm:self-auto"
            />
          )}
          <div className="flex-1 space-y-2">
            <h4 className="font-medium text-gray-900 text-base sm:text-lg">
              {item?.name || "물품 정보 없음"}
            </h4>
            {item?.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-gray-700">대여기간</span>
                <span className="text-gray-600">
                  {formatDate(selectedRental.rentDate)} ~{" "}
                  {formatDate(selectedRental.dueDate)}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-gray-700">대여목적</span>
                <span className="text-gray-600 line-clamp-2">
                  {selectedRental.purpose}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 물품 상태 사진 업로드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <PhotoUpload
          type="item_pre_return"
          label="1. 물품 상태 사진"
          description="반납하기 전 물품의 현재 상태를 촬영해주세요"
          required
          autoUpload={true}
          onUploadSuccess={(url) => onPhotoUploadSuccess("item", url)}
          onError={onPhotoUploadError}
          isLoading={isLoading}
        />
        {errors.itemPhoto && (
          <p className="mt-2 text-sm text-red-600">{errors.itemPhoto}</p>
        )}
      </motion.div>

      {/* 라벨 사진 업로드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <PhotoUpload
          type="item_pre_return"
          label="2. 물품 라벨 사진"
          description="물품에 부착된 라벨(스티커)이 잘 보이도록 촬영해주세요"
          required
          autoUpload={true}
          onUploadSuccess={(url) => onPhotoUploadSuccess("label", url)}
          onError={onPhotoUploadError}
          isLoading={isLoading}
        />
        {errors.labelPhoto && (
          <p className="mt-2 text-sm text-red-600">{errors.labelPhoto}</p>
        )}
      </motion.div>

      {/* 다음 단계 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            이전
          </button>
          <button
            onClick={onProvidePassword}
            disabled={isLoading || !photos.itemPhoto || !photos.labelPhoto}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
          >
            {isLoading ? "처리 중..." : "다음 단계"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
