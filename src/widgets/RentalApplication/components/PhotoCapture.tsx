import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FirestoreRentalItem } from "../../../shared/services/firestore";
import { RentalPhotos } from "../types";

interface PhotoCaptureProps {
  selectedItem: FirestoreRentalItem;
  photos: RentalPhotos;
  isLoading: boolean;
  onPhotosChange: (photos: RentalPhotos) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  selectedItem,
  photos,
  isLoading,
  onPhotosChange,
  onSubmit,
  onReset,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // 파일을 미리보기 URL로 변환하는 함수
  const getPreviewUrl = (file: File | null): string => {
    if (!file) return "";
    return URL.createObjectURL(file);
  };

  // 파일 제거 함수
  const removePhoto = (photoKey: keyof RentalPhotos) => {
    onPhotosChange({ ...photos, [photoKey]: null });
  };

  const photoSteps = [
    {
      key: "itemCondition" as keyof RentalPhotos,
      title: "물품 상태 사진",
      description: "물품의 전체적인 상태를 확인할 수 있도록 촬영해주세요",
      icon: "📦",
      file: photos.itemCondition,
    },
    {
      key: "itemLabel" as keyof RentalPhotos,
      title: "물품 라벨 사진",
      description: "물품에 부착된 라벨이나 식별 번호를 촬영해주세요",
      icon: "🏷️",
      file: photos.itemLabel,
    },
    {
      key: "lockboxSecured" as keyof RentalPhotos,
      title: "잠금함 보안 사진",
      description: "잠금함이 제대로 잠겨있는 상태를 촬영해주세요",
      icon: "🔒",
      file: photos.lockboxSecured,
    },
  ];

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-4 sm:p-6 lg:p-8"
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
        <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-3 sm:mb-4">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 sm:mr-3 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-semibold text-primary">
            4단계: 사진 촬영
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          물품 상태 사진 촬영
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          물품의 상태를 확인할 수 있는 사진들을 촬영해주세요
        </p>
      </motion.div>

      {/* 선택된 물품 정보 */}
      <motion.div
        className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200/60"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 sm:mr-3"></span>
          선택한 물품
        </h3>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative flex-shrink-0">
            <Image
              src={selectedItem.image}
              alt={selectedItem.name}
              width={64}
              height={64}
              className="object-cover rounded-xl shadow-lg w-16 h-16 sm:w-20 sm:h-20"
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base sm:text-lg text-gray-900 truncate">
              {selectedItem.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {selectedItem.description}
            </p>
            <div className="flex items-center mt-2">
              <span className="px-2 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                {selectedItem.campus === "yangsan"
                  ? "양산캠퍼스"
                  : "장전캠퍼스"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 사진 촬영 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {photoSteps.map((step, index) => (
          <motion.div
            key={step.key}
            className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200/60 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0">
                <span className="text-lg sm:text-xl">{step.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                  {step.title} *
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* 사진 미리보기 */}
              {step.file && (
                <motion.div
                  className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-3 sm:p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="relative group flex-shrink-0">
                      {getPreviewUrl(step.file) && (
                        <Image
                          src={getPreviewUrl(step.file)}
                          alt={`${step.title} 미리보기`}
                          width={80}
                          height={80}
                          className="object-cover rounded-xl shadow-lg border border-emerald-200 w-20 h-20 sm:w-24 sm:h-24"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                        <motion.button
                          type="button"
                          onClick={() => removePhoto(step.key)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-emerald-800 text-sm sm:text-base truncate">
                            사진이 선택되었습니다
                          </p>
                          <p className="text-xs sm:text-sm text-emerald-600 truncate">
                            {step.file.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-emerald-600">
                        파일 크기: {(step.file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <label className="cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        onPhotosChange({ ...photos, [step.key]: file });
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 rounded-xl hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 group-hover:scale-105">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium text-xs sm:text-sm">
                      갤러리에서 선택
                    </span>
                  </div>
                </label>

                <label className="cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        onPhotosChange({ ...photos, [step.key]: file });
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center px-3 py-2.5 sm:px-4 sm:py-3 bg-white text-primary border border-primary/20 rounded-xl hover:bg-gray-50 transition-all duration-300 group-hover:scale-105 shadow-sm">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-medium text-xs sm:text-sm">
                      카메라로 촬영
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        ))}

        {/* 전체 사진 미리보기 요약 */}
        {(photos.itemCondition ||
          photos.itemLabel ||
          photos.lockboxSecured) && (
          <motion.div
            className="bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-primary/20 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="font-bold text-primary mb-4 flex items-center text-sm sm:text-base">
              <span className="text-lg sm:text-xl mr-2">📸</span>
              촬영된 사진 요약
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {photoSteps.map((step) => (
                <div key={step.key} className="text-center">
                  <div className="relative mb-2">
                    {step.file ? (
                      <div className="relative group">
                        {getPreviewUrl(step.file) && (
                          <Image
                            src={getPreviewUrl(step.file)}
                            alt={step.title}
                            width={80}
                            height={80}
                            className="object-cover rounded-lg shadow-md border border-primary/20 w-full aspect-square"
                          />
                        )}
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span className="text-lg sm:text-2xl text-gray-400">
                          {step.icon}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-primary truncate">
                    {step.title}
                  </p>
                  <p
                    className={`text-xs ${
                      step.file ? "text-emerald-600" : "text-gray-500"
                    }`}
                  >
                    {step.file ? "완료" : "미완료"}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <motion.button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            취소
          </motion.button>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 rounded-full animate-spin border-t-white mr-2 sm:mr-3"></div>
                대여 처리 중...
              </div>
            ) : (
              "대여 신청"
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};
