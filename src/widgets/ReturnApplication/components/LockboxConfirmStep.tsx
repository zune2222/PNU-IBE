import React from "react";
import { motion } from "framer-motion";
import { PhotoUpload } from "../../PhotoUpload";
import { ReturnPhotos } from "../hooks/useReturnApplication";

interface LockboxConfirmStepProps {
  photos: ReturnPhotos;
  errors: { [key: string]: string };
  isLoading: boolean;
  lockboxPassword?: string;
  onPhotoUploadSuccess: (type: "lockbox", url: string) => void;
  onPhotoUploadError: (error: string) => void;
  onCompleteReturn: () => void;
  onBack: () => void;
}

export default function LockboxConfirmStep({
  photos,
  errors,
  isLoading,
  lockboxPassword,
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
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
          <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
          <span className="text-sm font-semibold text-primary">
            4단계: 자물쇠 확인
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          자물쇠 잠금 확인
        </h2>
        <p className="text-gray-600">
          아래 비밀번호로 자물쇠를 열고 물품을 넣은 후 다시 잠가주세요
        </p>
      </motion.div>

      {/* 자물쇠 비밀번호 표시 */}
      {lockboxPassword && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary mb-2">
              🔐 자물쇠 비밀번호
            </h3>
            <div className="text-3xl font-bold text-primary bg-white/80 rounded-lg py-3 px-6 inline-block border border-primary/30">
              {lockboxPassword}
            </div>
            <p className="text-sm text-primary/80 mt-3">
              이 번호로 자물쇠를 열고 물품을 넣은 후 다시 잠가주세요
            </p>
          </div>
        </motion.div>
      )}

      {/* 단계별 안내 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
      >
        <h4 className="font-semibold text-yellow-800 mb-3">📝 반납 순서</h4>
        <ol className="text-sm text-yellow-700 space-y-2">
          <li className="flex items-start">
            <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
              1
            </span>
            위의 비밀번호로 자물쇠를 열어주세요
          </li>
          <li className="flex items-start">
            <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
              2
            </span>
            반납할 물품을 자물쇠함에 넣어주세요
          </li>
          <li className="flex items-start">
            <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
              3
            </span>
            자물쇠를 다시 잠가주세요
          </li>
          <li className="flex items-start">
            <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
              4
            </span>
            잠긴 자물쇠 사진을 촬영해주세요
          </li>
        </ol>
      </motion.div>

      {/* 자물쇠 사진 업로드 */}
      <div className="mb-6">
        <PhotoUpload
          type="lockbox_post_return"
          label="자물쇠 잠금 확인 사진"
          description="자물쇠가 잘 잠겨있는 모습을 촬영해주세요"
          required
          autoUpload={true}
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
          className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-md text-sm font-medium hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50"
        >
          {isLoading ? "반납 처리 중..." : "반납 완료"}
        </button>
      </div>
    </div>
  );
}
