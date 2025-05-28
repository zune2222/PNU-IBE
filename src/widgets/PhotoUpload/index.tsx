import React, { useState, useRef } from "react";
import Image from "next/image";
import { storageService } from "../../shared/services/storage";

interface PhotoUploadProps {
  type: "item_pre_return" | "lockbox_post_return";
  onUploadSuccess: (url: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  label: string;
  description: string;
  required?: boolean;
  autoUpload?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  type,
  onUploadSuccess,
  onError,
  isLoading = false,
  label,
  description,
  required = false,
  autoUpload = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      onError("파일 크기가 너무 큽니다. 10MB 이하의 이미지를 선택해주세요.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      onError(
        "지원하지 않는 파일 형식입니다. JPG, PNG, WebP 파일만 업로드 가능합니다."
      );
      return;
    }

    setSelectedFile(file);
    setIsUploaded(false);

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // 자동 업로드가 활성화된 경우 즉시 업로드
    if (autoUpload) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (fileToUpload?: File) => {
    const file = fileToUpload || selectedFile;
    if (!file) {
      onError("업로드할 파일을 선택해주세요.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 파일 업로드
      const result = await storageService.uploadFileWithProgress(
        file,
        type === "item_pre_return" ? "item-photos" : "lockbox-photos",
        undefined,
        (progress) => {
          setUploadProgress(progress.progress);
        }
      );

      setIsUploaded(true);
      onUploadSuccess(result.url);
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      onError("파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>

      {!selectedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">
            사진을 업로드하세요
          </p>
          <p className="text-sm text-gray-500 mb-4">
            JPG, PNG, WebP 파일 (최대 10MB)
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleCameraCapture}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isUploading}
            >
              <svg
                className="w-4 h-4 mr-2"
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
              사진 촬영/선택
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div>
          {/* 미리보기 */}
          <div className="mb-4">
            <Image
              src={previewUrl || ""}
              alt="업로드할 사진"
              width={384}
              height={256}
              className="mx-auto object-cover rounded-lg border"
            />
          </div>

          {/* 파일 정보 */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-800 text-sm"
                disabled={isUploading}
              >
                제거
              </button>
            </div>
          </div>

          {/* 업로드 진행 상황 */}
          {isUploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>업로드 중...</span>
                <span>{uploadProgress.toFixed(1)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 업로드 버튼 */}
          <div className="flex gap-3">
            {!autoUpload && (
              <button
                type="button"
                onClick={() => handleUpload()}
                disabled={isUploading || isLoading || isUploaded}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading
                  ? "업로드 중..."
                  : isUploaded
                  ? "업로드 완료"
                  : "업로드"}
              </button>
            )}
            {autoUpload && isUploaded && (
              <div className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-md text-center font-medium">
                ✓ 업로드 완료
              </div>
            )}
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              다시 선택
            </button>
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              {type === "item_pre_return" ? (
                <>
                  <strong>물품 상태 사진 촬영 가이드:</strong>
                  <br />
                  • 물품 전체가 잘 보이도록 촬영해주세요
                  <br />
                  • 손상된 부분이 있다면 명확히 보이도록 촬영해주세요
                  <br />• 조명이 밝은 곳에서 촬영하면 더 선명합니다
                </>
              ) : (
                <>
                  <strong>보관함 사진 촬영 가이드:</strong>
                  <br />
                  • 물품을 보관함에 넣은 후 촬영해주세요
                  <br />
                  • 보관함 번호가 잘 보이도록 촬영해주세요
                  <br />• 보관함이 잠겨있는 상태로 촬영해주세요
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
