import React from "react";
import { FirestoreRentalItem } from "../../../shared/services/firestore";
import { RentalPhotos } from "../types";

interface PhotoCaptureProps {
  selectedItem: FirestoreRentalItem;
  photos: RentalPhotos;
  errors: { [key: string]: string };
  isLoading: boolean;
  onPhotosChange: (photos: RentalPhotos) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  selectedItem,
  photos,
  errors,
  isLoading,
  onPhotosChange,
  onSubmit,
  onReset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          물품 상태 사진 촬영
        </h2>
        <button
          onClick={onReset}
          className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 py-1 px-2 border border-gray-300 rounded"
        >
          물품 다시 선택
        </button>
      </div>

      {/* 선택된 물품 정보 */}
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
          선택한 물품
        </h3>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <img
            src={selectedItem.image}
            alt={selectedItem.name}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
          />
          <div>
            <p className="font-medium text-sm sm:text-base">
              {selectedItem.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
              {selectedItem.description}
            </p>
            <p className="text-xs text-gray-500">
              {selectedItem.campus === "yangsan" ? "양산캠퍼스" : "장전캠퍼스"}
            </p>
          </div>
        </div>
      </div>

      {/* 사진 촬영 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            물품 상태 사진 *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                onPhotosChange({ ...photos, itemCondition: file });
              }
            }}
            className="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          {errors.itemCondition && (
            <p className="text-red-600 text-xs mt-1">{errors.itemCondition}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            물품 라벨 사진 *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                onPhotosChange({ ...photos, itemLabel: file });
              }
            }}
            className="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          {errors.itemLabel && (
            <p className="text-red-600 text-xs mt-1">{errors.itemLabel}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            잠금함 보안 사진 *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                onPhotosChange({ ...photos, lockboxSecured: file });
              }
            }}
            className="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          {errors.lockboxSecured && (
            <p className="text-red-600 text-xs mt-1">{errors.lockboxSecured}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                대여 처리 중...
              </div>
            ) : (
              "대여 신청"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
