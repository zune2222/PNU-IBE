import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  StudentIdInfo,
  OcrResult,
} from "../../shared/services/clientOcrService";
import { clientOcrService } from "../../shared/services/clientOcrService";

// 확장된 학생 정보 인터페이스 (휴대폰 번호 포함)
interface ExtendedStudentIdInfo extends StudentIdInfo {
  phoneNumber: string;
  studentIdPhotoFile?: File; // 학생증 사진 파일 추가
}

interface StudentIdUploadProps {
  onSuccess?: (studentInfo: ExtendedStudentIdInfo) => void;
  onError?: (error: string) => void;
}

export const StudentIdUpload: React.FC<StudentIdUploadProps> = ({
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState({
    studentId: "",
    name: "",
    department: "",
    campus: "yangsan" as "yangsan" | "jangjeom",
    phoneNumber: "",
  });

  // 파일 선택 처리
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    const validation = clientOcrService.validateImageFile(file);
    if (!validation.isValid) {
      onError?.(validation.error || "유효하지 않은 파일입니다.");
      return;
    }

    setSelectedFile(file);

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // 이전 결과 초기화
    setOcrResult(null);
    setShowManualInput(false);
  };

  // OCR 처리 실행
  const handleOcrProcess = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      // 클라이언트 OCR 사용
      const result = await clientOcrService.extractStudentIdInfo(selectedFile);
      setOcrResult(result);

      if (result.success && result.studentInfo) {
        // OCR 성공 시 자동으로 manual input 폼에 채우기
        setManualInput({
          studentId: result.studentInfo.studentId || "",
          name: result.studentInfo.name || "",
          department: result.studentInfo.department || "",
          campus: result.studentInfo.campus || "yangsan", // OCR에서 인식된 캠퍼스 값 사용
          phoneNumber: "", // Assuming phoneNumber is not provided in the OCR result
        });
        // 수동 입력 모드는 비활성화
        setShowManualInput(false);
      } else {
        // OCR 실패 시 수동 입력 모드는 활성화하지 않고 에러만 표시
        onError?.(result.error || "학생증 정보를 인식할 수 없습니다.");
      }
    } catch (error) {
      console.error("OCR 처리 오류:", error);
      onError?.("OCR 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 학생 정보 검증 및 저장
  const handleValidateAndSave = async () => {
    const { studentId, name, department, campus, phoneNumber } = manualInput;

    if (!studentId || !name) {
      onError?.("학번과 이름은 필수 입력 항목입니다.");
      return;
    }

    if (!phoneNumber) {
      onError?.("휴대폰 번호는 필수 입력 항목입니다.");
      return;
    }

    // 휴대폰 번호 형식 검증
    const phoneRegex = /^010-?\d{4}-?\d{4}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[^0-9]/g, ""))) {
      onError?.("올바른 휴대폰 번호 형식을 입력해주세요. (010-XXXX-XXXX)");
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
        onError?.(validation.error || "학생 정보 검증에 실패했습니다.");
        return;
      }

      // 성공 콜백 호출
      const studentInfo: ExtendedStudentIdInfo = {
        studentId,
        name,
        department: department || null,
        campus,
        grade: null,
        confidence: ocrResult?.studentInfo?.confidence || 1.0,
        phoneNumber: phoneNumber
          .replace(/[^0-9]/g, "")
          .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"),
        studentIdPhotoFile: selectedFile || undefined,
      };

      onSuccess?.(studentInfo);
    } catch (error) {
      console.error("학생 정보 저장 오류:", error);
      onError?.("학생 정보 저장 중 오류가 발생했습니다.");
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
    setShowManualInput(false);
    setManualInput({
      studentId: "",
      name: "",
      department: "",
      campus: "yangsan",
      phoneNumber: "",
    });
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
              <label className="cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform group-hover:scale-105 shadow-lg korean-text">
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
              <label className="cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform group-hover:scale-105 shadow-lg border-2 border-primary/20 korean-text">
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
                  <img
                    src={previewUrl}
                    alt="학생증 미리보기"
                    className="w-full max-w-md mx-auto rounded-xl shadow-lg border border-gray-200"
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
            {(ocrResult || showManualInput) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6 korean-text">
                  학생 정보 확인
                </h3>

                <div className="space-y-4">
                  {/* 학번 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                      학번 *
                    </label>
                    <input
                      type="text"
                      value={manualInput.studentId}
                      onChange={(e) =>
                        setManualInput({
                          ...manualInput,
                          studentId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="학번을 입력하세요"
                    />
                  </div>

                  {/* 이름 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                      이름 *
                    </label>
                    <input
                      type="text"
                      value={manualInput.name}
                      onChange={(e) =>
                        setManualInput({ ...manualInput, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="이름을 입력하세요"
                    />
                  </div>

                  {/* 학과 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                      학과
                    </label>
                    <input
                      type="text"
                      value={manualInput.department}
                      onChange={(e) =>
                        setManualInput({
                          ...manualInput,
                          department: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="학과를 입력하세요"
                    />
                  </div>

                  {/* 캠퍼스 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                      캠퍼스
                    </label>
                    <select
                      value={manualInput.campus}
                      onChange={(e) =>
                        setManualInput({
                          ...manualInput,
                          campus: e.target.value as "yangsan" | "jangjeom",
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="yangsan">양산캠퍼스</option>
                      <option value="jangjeom">장전캠퍼스</option>
                    </select>
                  </div>

                  {/* 휴대폰 번호 입력 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                      휴대폰 번호 *
                    </label>
                    <input
                      type="tel"
                      value={manualInput.phoneNumber}
                      onChange={(e) =>
                        setManualInput({
                          ...manualInput,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>

                {/* 버튼들 */}
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
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
