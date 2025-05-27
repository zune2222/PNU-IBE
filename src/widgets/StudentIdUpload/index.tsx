import React, { useState } from "react";
import {
  ocrService,
  OcrResult,
  StudentIdInfo,
} from "../../shared/services/ocrService";

interface StudentIdUploadProps {
  onSuccess?: (studentInfo: StudentIdInfo) => void;
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
  });

  // 파일 선택 처리
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    const validation = ocrService.validateImageFile(file);
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
      const tempId = `temp_${Date.now()}`;
      const result = await ocrService.extractStudentIdInfo(
        selectedFile,
        tempId
      );
      setOcrResult(result);

      if (result.success && result.studentInfo) {
        // OCR 성공 시 자동으로 manual input 폼에 채우기
        setManualInput({
          studentId: result.studentInfo.studentId || "",
          name: result.studentInfo.name || "",
          department: result.studentInfo.department || "",
          campus: result.studentInfo.campus || "yangsan",
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
    const { studentId, name, department, campus } = manualInput;

    if (!studentId || !name) {
      onError?.("학번과 이름은 필수 입력 항목입니다.");
      return;
    }

    setIsLoading(true);
    try {
      // 학생 정보 검증
      const tempId = `temp_${Date.now()}`;
      const validation = await ocrService.validateStudentInfo(
        studentId,
        name,
        tempId
      );

      if (!validation.valid) {
        onError?.(validation.error || "학생 정보 검증에 실패했습니다.");
        return;
      }

      // 성공 콜백 호출
      const studentInfo: StudentIdInfo = {
        studentId,
        name,
        department: department || null,
        campus,
        grade: null,
        confidence: ocrResult?.studentInfo?.confidence || 1.0,
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
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 sm:px-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
          학생증 인증
        </h2>

        {/* 파일 업로드 영역 */}
        {!selectedFile && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 sm:p-8 text-center">
            <div className="mb-3">
              <svg
                className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
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
            <p className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              학생증 사진을 업로드하세요
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              JPG, PNG, WebP 파일 (최대 10MB)
            </p>
            <label className="cursor-pointer">
              <span className="mt-2 block w-full rounded-md border border-gray-300 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 text-center shadow-sm">
                카메라/갤러리에서 선택
              </span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}

        {/* 선택된 파일 미리보기 */}
        {selectedFile && previewUrl && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                업로드된 학생증
              </h3>
              <button
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-800 py-1 px-2 text-sm rounded-md border border-transparent hover:border-red-200"
              >
                다시 찍기
              </button>
            </div>
            <div className="relative">
              <img
                src={previewUrl}
                alt="학생증 미리보기"
                className="w-full h-48 sm:h-64 object-contain bg-gray-100 rounded-lg"
              />
            </div>
            <div className="mt-3 text-xs sm:text-sm text-gray-600 flex justify-between">
              <p>
                파일명:{" "}
                {selectedFile.name.length > 20
                  ? selectedFile.name.substring(0, 20) + "..."
                  : selectedFile.name}
              </p>
              <p>크기: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>

            {!ocrResult && !showManualInput && (
              <button
                onClick={handleOcrProcess}
                disabled={isLoading}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 shadow-sm font-medium text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    처리 중...
                  </div>
                ) : (
                  "학생 정보 추출하기"
                )}
              </button>
            )}
          </div>
        )}

        {/* OCR 결과 */}
        {ocrResult && (
          <div className="mb-5">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
              추출된 정보
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              {ocrResult.success && ocrResult.studentInfo ? (
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">인식 신뢰도:</span>
                    <span
                      className={ocrService.getConfidenceColor(
                        ocrResult.studentInfo.confidence
                      )}
                    >
                      {ocrService.getConfidenceText(
                        ocrResult.studentInfo.confidence
                      )}{" "}
                      ({Math.round(ocrResult.studentInfo.confidence * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">학번:</span>
                    <span>
                      {ocrResult.studentInfo.studentId || "인식 실패"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">이름:</span>
                    <span>{ocrResult.studentInfo.name || "인식 실패"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">학과:</span>
                    <span>
                      {ocrResult.studentInfo.department || "인식 실패"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">캠퍼스:</span>
                    <span>{ocrResult.studentInfo.campus || "인식 실패"}</span>
                  </div>
                </div>
              ) : (
                <div className="text-red-600 text-sm sm:text-base">
                  <p>{ocrResult.error}</p>
                </div>
              )}
            </div>

            {/* OCR 성공 시 저장 버튼 또는 실패 시 다시 시도 버튼 */}
            {ocrResult.success && ocrResult.studentInfo ? (
              <button
                onClick={handleValidateAndSave}
                disabled={isLoading}
                className="mt-4 w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 shadow-sm font-medium text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    처리 중...
                  </div>
                ) : (
                  "정보 검증 및 저장"
                )}
              </button>
            ) : (
              <button
                onClick={handleRemoveFile}
                className="mt-4 w-full bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 disabled:opacity-50 shadow-sm font-medium text-base"
              >
                다시 시도하기
              </button>
            )}
          </div>
        )}

        {/* 수동 입력 폼 - OCR 결과가 없고 수동 입력 모드가 활성화된 경우에만 표시 */}
        {showManualInput && !ocrResult && (
          <div className="mb-5">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
              수동 입력
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학번 *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={manualInput.studentId}
                  onChange={(e) =>
                    setManualInput({
                      ...manualInput,
                      studentId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="예: 202012345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 *
                </label>
                <input
                  type="text"
                  value={manualInput.name}
                  onChange={(e) =>
                    setManualInput({ ...manualInput, name: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학과/전공
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="정보컴퓨터공학부"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                >
                  <option value="yangsan">양산캠퍼스</option>
                  <option value="jangjeom">장전캠퍼스</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleValidateAndSave}
              disabled={
                isLoading || !manualInput.studentId || !manualInput.name
              }
              className="mt-4 w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 shadow-sm font-medium text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  처리 중...
                </div>
              ) : (
                "정보 검증 및 저장"
              )}
            </button>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-md">
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
              <p className="text-xs sm:text-sm text-blue-700">
                <strong>안내사항:</strong>
                <br />
                • 모바일 학생증의 정보가 모두 보이도록 캡쳐해주세요
                <br />
                • 화면 확대나 너무 작은 크기의 캡쳐는 인식률이 낮아집니다
                <br />
                • OCR 인식이 실패하면 수동으로 정보를 입력할 수 있습니다
                <br />• 입력된 정보는 학사 시스템과 대조하여 검증됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
