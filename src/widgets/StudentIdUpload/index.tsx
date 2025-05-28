import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToast } from "../../shared/components/Toast";
import {
  StudentIdInfo,
  OcrResult,
} from "../../shared/services/clientOcrService";
import { clientOcrService } from "../../shared/services/clientOcrService";
import { uploadStudentIdPhoto } from "../RentalApplication/services";
import { useAuth } from "../../shared/contexts/AuthContext";

// 확장된 학생 정보 인터페이스 (휴대폰 번호 포함)
interface ExtendedStudentIdInfo extends StudentIdInfo {
  phoneNumber: string;
  studentIdPhotoUrl?: string; // File 대신 URL 사용
}

interface StudentIdUploadProps {
  onSuccess?: (studentInfo: ExtendedStudentIdInfo) => void;
  onError?: (error: string) => void;
}

// localStorage 키 상수
const STORAGE_KEYS = {
  STUDENT_ID_STATE: "studentIdUploadState",
  OCR_RESULT: "studentIdOcrResult",
  PHONE_NUMBER: "studentIdPhoneNumber",
  PREVIEW_URL: "studentIdPreviewUrl",
  STUDENT_ID_PHOTO_URL: "studentIdPhotoUrl", // 업로드된 사진 URL
} as const;

// 상태 저장 함수
const saveToStorage = (key: string, data: unknown) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.warn("localStorage 저장 실패:", error);
  }
};

// 상태 불러오기 함수
const loadFromStorage = function <T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.warn("localStorage 불러오기 실패:", error);
  }
  return defaultValue;
};

// 상태 삭제 함수
const clearStudentIdStorage = () => {
  try {
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.warn("localStorage 삭제 실패:", error);
  }
};

export const StudentIdUpload: React.FC<StudentIdUploadProps> = ({
  onSuccess,
  onError,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() =>
    loadFromStorage(STORAGE_KEYS.PREVIEW_URL, null)
  );
  const [studentIdPhotoUrl, setStudentIdPhotoUrl] = useState<string | null>(
    () => loadFromStorage(STORAGE_KEYS.STUDENT_ID_PHOTO_URL, null)
  );
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(() =>
    loadFromStorage(STORAGE_KEYS.OCR_RESULT, null)
  );
  const [phoneNumber, setPhoneNumber] = useState(() =>
    loadFromStorage(STORAGE_KEYS.PHONE_NUMBER, "")
  );

  // 컴포넌트 마운트 시 상태 복원 확인
  useEffect(() => {
    // 이전 상태 복원 알림 제거 - 사용자에게 불필요한 정보
  }, []);

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.OCR_RESULT, ocrResult);
  }, [ocrResult]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PHONE_NUMBER, phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PREVIEW_URL, previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDENT_ID_PHOTO_URL, studentIdPhotoUrl);
  }, [studentIdPhotoUrl]);

  // 파일 선택 처리
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    const validation = clientOcrService.validateImageFile(file);
    if (!validation.isValid) {
      const errorMessage = validation.error || "유효하지 않은 파일입니다.";
      onError?.(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
      return;
    }

    // 사용자가 로그인되어 있는지 확인
    if (!user) {
      showToast({
        type: "error",
        message: "로그인이 필요합니다.",
      });
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Firebase Storage에 바로 업로드
      const uploadedUrl = await uploadStudentIdPhoto(file, user.uid);
      setStudentIdPhotoUrl(uploadedUrl);

      showToast({
        type: "success",
        message: "학생증 사진이 업로드되었습니다.",
      });

      // 이전 결과 초기화
      setOcrResult(null);
      setPhoneNumber("");
    } catch (error) {
      console.error("학생증 사진 업로드 오류:", error);
      showToast({
        type: "error",
        message: "사진 업로드에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // OCR 처리 실행
  const handleOcrProcess = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      // 클라이언트 OCR 사용
      const result = await clientOcrService.extractStudentIdInfo(selectedFile);
      setOcrResult(result);

      if (!result.success || !result.studentInfo) {
        const errorMessage =
          result.error || "학생증 정보를 인식할 수 없습니다.";
        onError?.(errorMessage);
        showToast({
          type: "error",
          message: errorMessage,
        });
      } else {
        showToast({
          type: "success",
          message: "학생증 정보를 성공적으로 인식했습니다!",
        });
      }
    } catch (error) {
      console.error("OCR 처리 오류:", error);
      const errorMessage = "OCR 처리 중 오류가 발생했습니다.";
      onError?.(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 학생 정보 검증 및 저장
  const handleValidateAndSave = async () => {
    if (!ocrResult?.studentInfo) {
      const errorMessage = "학생증 정보를 먼저 인식해주세요.";
      onError?.(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
      return;
    }

    const { studentId, name, department, campus } = ocrResult.studentInfo;

    if (!studentId || !name) {
      const errorMessage =
        "학번과 이름 정보가 인식되지 않았습니다. 다시 시도해주세요.";
      onError?.(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
      return;
    }

    if (!phoneNumber) {
      const errorMessage = "휴대폰 번호는 필수 입력 항목입니다.";
      onError?.(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
      return;
    }

    // 휴대폰 번호 형식 검증
    const phoneRegex = /^010-?\d{4}-?\d{4}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[^0-9]/g, ""))) {
      const errorMessage =
        "올바른 휴대폰 번호 형식을 입력해주세요. (010-XXXX-XXXX)";
      onError?.(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
      return;
    }

    setIsLoading(true);
    try {
      // 클라이언트에서 학생 정보 검증
      const validation = await clientOcrService.validateStudentInfo(
        studentId,
        name
      );

      if (!validation.valid) {
        const errorMessage =
          validation.error || "학생 정보 검증에 실패했습니다.";
        onError?.(errorMessage);
        showToast({
          type: "error",
          message: errorMessage,
        });
        return;
      }

      // 성공 콜백 호출
      const studentInfo: ExtendedStudentIdInfo = {
        studentId,
        name,
        department: department || null,
        campus,
        grade: null,
        confidence: ocrResult.studentInfo.confidence || 1.0,
        phoneNumber: phoneNumber
          .replace(/[^0-9]/g, "")
          .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"),
        studentIdPhotoUrl: studentIdPhotoUrl || undefined,
      };

      // localStorage 정리 (인증 성공 시)
      clearStudentIdStorage();

      showToast({
        type: "success",
        message: "학생 인증이 완료되었습니다!",
      });

      onSuccess?.(studentInfo);
    } catch (error) {
      console.error("학생 정보 저장 오류:", error);
      const errorMessage = "학생 정보 저장 중 오류가 발생했습니다.";
      onError?.(errorMessage);
      showToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 제거
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setOcrResult(null);
    setPhoneNumber("");
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4 sm:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
            <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-semibold text-primary korean-text">
              1단계: 학생 인증
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent korean-text mb-2">
            학생증 인증
          </h2>
          <p className="text-gray-600 korean-text">
            학생증 사진을 업로드하여 본인 인증을 완료하세요
          </p>
        </motion.div>

        {/* 파일 업로드 영역 */}
        {!selectedFile && (
          <motion.div
            className="border-2 border-dashed border-primary/30 rounded-2xl p-8 sm:p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="mb-6"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl shadow-lg mx-auto w-fit">
                <svg
                  className="h-12 w-12 text-white"
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
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 korean-text">
              학생증 사진을 업로드하세요
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 korean-text">
              JPG, PNG, WebP 파일 (최대 10MB)
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* 갤러리에서 선택 버튼 */}
              <label className="cursor-pointer group flex-1 sm:flex-initial">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform group-hover:scale-105 shadow-lg korean-text w-full sm:w-48">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  갤러리에서 선택
                </div>
              </label>

              {/* 카메라로 촬영 버튼 */}
              <label className="cursor-pointer group flex-1 sm:flex-initial">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform group-hover:scale-105 shadow-lg border-2 border-primary/20 korean-text w-full sm:w-48">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  카메라로 촬영
                </div>
              </label>
            </div>
          </motion.div>
        )}

        {/* 파일 미리보기 및 OCR 결과 */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* 이미지 미리보기 */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 korean-text">
                  업로드된 이미지
                </h3>
                <motion.button
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
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
              {previewUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src={previewUrl}
                    alt="학생증 미리보기"
                    width={400}
                    height={300}
                    className="mx-auto rounded-xl shadow-lg border border-gray-200"
                  />
                </motion.div>
              )}
            </div>

            {/* OCR 처리 버튼 */}
            {!ocrResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <motion.button
                  onClick={handleOcrProcess}
                  disabled={isLoading}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed korean-text"
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white mr-3"></div>
                      학생증 정보 인식 중...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      학생증 정보 자동 인식
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* OCR 결과 또는 수동 입력 폼 */}
            {ocrResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 korean-text">
                  인식된 학생 정보
                </h3>

                {ocrResult.success && ocrResult.studentInfo ? (
                  <div className="space-y-4">
                    {/* 학번 (읽기 전용) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                        학번
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                        {ocrResult.studentInfo.studentId || "인식되지 않음"}
                      </div>
                    </div>

                    {/* 이름 (읽기 전용) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                        이름
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                        {ocrResult.studentInfo.name || "인식되지 않음"}
                      </div>
                    </div>

                    {/* 학과 (읽기 전용) */}
                    {ocrResult.studentInfo.department && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                          학과
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
                          {ocrResult.studentInfo.department}
                        </div>
                      </div>
                    )}

                    {/* 휴대폰 번호 입력 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                        휴대폰 번호 *
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="010-0000-0000"
                      />
                    </div>

                    {/* 인식 신뢰도 표시 */}
                    {ocrResult.studentInfo.confidence && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 102 0V6a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-blue-700 korean-text">
                            인식 정확도:{" "}
                            {Math.min(
                              Math.round(
                                ocrResult.studentInfo.confidence * 100
                              ),
                              100
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 korean-text mb-4">
                      학생증 정보를 인식할 수 없습니다.
                    </p>
                    <p className="text-sm text-gray-500 korean-text">
                      다른 이미지로 다시 시도해주세요.
                    </p>
                  </div>
                )}

                {/* 버튼들 */}
                {ocrResult.success && ocrResult.studentInfo && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <motion.button
                      onClick={handleValidateAndSave}
                      disabled={isLoading}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed korean-text"
                      whileHover={{ scale: isLoading ? 1 : 1.05 }}
                      whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white mr-3"></div>
                          인증 중...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          인증 완료
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={handleRemoveFile}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-md korean-text"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      다시 선택
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
