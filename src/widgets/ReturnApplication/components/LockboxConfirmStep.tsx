import React from "react";
import { motion } from "framer-motion";
import { PhotoUpload } from "../../PhotoUpload";
import { ReturnPhotos } from "../hooks/useReturnApplication";

interface LockboxConfirmStepProps {
  photos: ReturnPhotos;
  errors: { [key: string]: string };
  isLoading: boolean;
  onPhotoUploadSuccess: (type: "lockbox", url: string) => void;
  onPhotoUploadError: (error: string) => void;
  onCompleteReturn: () => void;
  onBack: () => void;
}

export default function LockboxConfirmStep({
  photos,
  errors,
  isLoading,
  onPhotoUploadSuccess,
  onPhotoUploadError,
  onCompleteReturn,
  onBack,
}: LockboxConfirmStepProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-green-500/10 border border-purple-500/20 mb-4">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
          <span className="text-sm font-semibold text-purple-600">
            5단계: 자물쇠 확인
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          자물쇠 잠금 확인
        </h2>
        <p className="text-gray-600">
          자물쇠가 잘 잠겼는지 확인하는 사진을 촬영해주세요
        </p>
      </motion.div>

      {/* 자물쇠 사진 업로드 */}
      <div className="mb-6">
        <PhotoUpload
          type="lockbox_post_return"
          label="자물쇠 잠금 확인 사진"
          description="자물쇠가 잘 잠겨있는 모습을 촬영해주세요"
          required
          onUploadSuccess={(url) => onPhotoUploadSuccess("lockbox", url)}
          onError={onPhotoUploadError}
          isLoading={isLoading}
        />
        {errors.lockboxPhoto && (
          <p className="mt-2 text-sm text-red-600">{errors.lockboxPhoto}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          이전
        </button>
        <button
          onClick={onCompleteReturn}
          disabled={isLoading || !photos.lockboxPhoto}
          className="px-6 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? "반납 처리 중..." : "반납 완료"}
        </button>
      </div>
    </div>
  );
}
