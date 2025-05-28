import React from "react";
import Image from "next/image";
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
  return (
    <div className="space-y-6">
      {/* 선택된 물품 정보 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">반납 물품 정보</h2>
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            다른 물품 선택
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {rentalItems[selectedRental.itemId]?.image && (
            <Image
              src={rentalItems[selectedRental.itemId].image}
              alt={rentalItems[selectedRental.itemId].name}
              width={64}
              height={64}
              className="object-cover rounded-lg"
            />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {rentalItems[selectedRental.itemId]?.name || "물품 정보 없음"}
            </h3>
            <p className="text-sm text-gray-600">
              {rentalItems[selectedRental.itemId]?.description || "설명 없음"}
            </p>
            <p className="text-sm text-gray-500">
              대여 기간: {selectedRental.rentDate} ~ {selectedRental.dueDate}
            </p>
          </div>
        </div>
      </div>

      {/* 물품 상태 사진 업로드 */}
      <div>
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
      </div>

      {/* 라벨 사진 업로드 */}
      <div>
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
      </div>

      {/* 다음 단계 버튼 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-6">
        <div className="flex justify-end space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            이전
          </button>
          <button
            onClick={onProvidePassword}
            disabled={isLoading || !photos.itemPhoto || !photos.labelPhoto}
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "처리 중..." : "다음 단계"}
          </button>
        </div>
      </div>
    </div>
  );
}
