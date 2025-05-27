import React from "react";
import { FirestoreRentalItem } from "../../../shared/services/firestore";

interface ItemSelectionProps {
  availableItems: FirestoreRentalItem[];
  isLoading: boolean;
  onItemSelect: (item: FirestoreRentalItem) => void;
}

export const ItemSelection: React.FC<ItemSelectionProps> = ({
  availableItems,
  isLoading,
  onItemSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
        대여 가능한 물품
      </h2>

      {isLoading ? (
        <div className="text-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2"
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
          <div className="text-sm sm:text-base text-gray-500">
            물품 목록을 불러오는 중...
          </div>
        </div>
      ) : availableItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-sm sm:text-base text-gray-500">
            현재 대여 가능한 물품이 없습니다.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {availableItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow shadow-sm"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-36 sm:h-48 object-cover"
              />
              <div className="p-3 sm:p-4">
                <h3 className="font-medium text-gray-900 text-base sm:mb-2">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.campus === "yangsan" ? "양산캠퍼스" : "장전캠퍼스"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  상태:{" "}
                  {item.status === "available"
                    ? "대여 가능"
                    : item.status === "rented"
                    ? "대여 중"
                    : item.status === "maintenance"
                    ? "정비 중"
                    : item.status === "lost"
                    ? "분실"
                    : item.status === "damaged"
                    ? "파손"
                    : "알 수 없음"}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    className="flex-1 text-xs sm:text-sm bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                    onClick={() => {
                      alert(`${item.name}\n\n${item.description}`);
                    }}
                  >
                    상세정보
                  </button>
                  <button
                    className="flex-1 text-xs sm:text-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    onClick={() => onItemSelect(item)}
                  >
                    대여 신청
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
