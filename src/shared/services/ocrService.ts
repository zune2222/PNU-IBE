import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

// 🎯 학생증 정보 타입 정의 (Functions와 동일)
export interface StudentIdInfo {
  studentId: string | null;
  name: string | null;
  department: string | null;
  campus: "yangsan" | "jangjeom" | null;
  grade: number | null;
  confidence: number; // 인식 신뢰도 (0-1)
}

// 🎯 OCR 결과 타입 (Functions와 동일)
export interface OcrResult {
  success: boolean;
  studentInfo: StudentIdInfo | null;
  rawText: string;
  error?: string;
  debugInfo?: {
    detectedTexts: string[];
    imageSize?: number;
  };
}

// 🎯 검증 결과 타입
export interface ValidationResult {
  valid: boolean;
  message?: string;
  error?: string;
  errorCode?: string;
}

// Firebase Functions 참조
const extractStudentIdInfoFunc = httpsCallable<
  { imageData: string; userId: string },
  OcrResult
>(functions, "extractStudentIdInfo");

const validateStudentInfoFunc = httpsCallable<
  { studentId: string; name: string; userId: string },
  ValidationResult
>(functions, "validateStudentInfo");

export const ocrService = {
  /**
   * 학생증 이미지에서 학생 정보를 추출합니다.
   * @param imageFile - 학생증 이미지 파일
   * @param userId - 사용자 ID
   * @returns OCR 결과
   */
  async extractStudentIdInfo(
    imageFile: File,
    userId: string
  ): Promise<OcrResult> {
    try {
      // 파일을 Base64로 변환
      const base64Data = await this.fileToBase64(imageFile);

      // Firebase Function 호출
      const result = await extractStudentIdInfoFunc({
        imageData: base64Data,
        userId,
      });

      return result.data;
    } catch (error: unknown) {
      console.error("OCR 처리 중 오류:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "OCR 처리 중 오류가 발생했습니다.";
      return {
        success: false,
        studentInfo: null,
        rawText: "",
        error: errorMessage,
      };
    }
  },

  /**
   * 추출된 학생 정보를 검증합니다.
   * @param studentId - 학번
   * @param name - 이름
   * @param userId - 사용자 ID
   * @returns 검증 결과
   */
  async validateStudentInfo(
    studentId: string,
    name: string,
    userId: string
  ): Promise<ValidationResult> {
    try {
      const result = await validateStudentInfoFunc({
        studentId,
        name,
        userId,
      });

      return result.data;
    } catch (error: unknown) {
      console.error("학생 정보 검증 중 오류:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "학생 정보 검증 중 오류가 발생했습니다.";
      return {
        valid: false,
        error: errorMessage,
      };
    }
  },

  /**
   * 파일을 Base64 문자열로 변환합니다.
   * @param file - 변환할 파일
   * @returns Base64 문자열
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("파일을 Base64로 변환할 수 없습니다."));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  },

  /**
   * 이미지 파일 유효성을 검사합니다.
   * @param file - 검사할 파일
   * @returns 유효성 검사 결과
   */
  validateImageFile(file: File): {
    isValid: boolean;
    error?: string;
  } {
    // 파일 크기 검사 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "파일 크기가 너무 큽니다. 10MB 이하의 이미지를 선택해주세요.",
      };
    }

    // 파일 타입 검사
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error:
          "지원하지 않는 파일 형식입니다. JPG, PNG, WebP 파일만 업로드 가능합니다.",
      };
    }

    return { isValid: true };
  },

  /**
   * 학생증 정보의 신뢰도를 텍스트로 변환합니다.
   * @param confidence - 신뢰도 (0-1)
   * @returns 신뢰도 텍스트
   */
  getConfidenceText(confidence: number): string {
    if (confidence >= 0.8) return "매우 높음";
    if (confidence >= 0.6) return "높음";
    if (confidence >= 0.4) return "보통";
    if (confidence >= 0.2) return "낮음";
    return "매우 낮음";
  },

  /**
   * 학생증 정보의 신뢰도에 따른 색상을 반환합니다.
   * @param confidence - 신뢰도 (0-1)
   * @returns Tailwind CSS 색상 클래스
   */
  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-blue-600";
    if (confidence >= 0.4) return "text-yellow-600";
    if (confidence >= 0.2) return "text-orange-600";
    return "text-red-600";
  },

  /**
   * 학생 정보가 충분한지 확인합니다.
   * @param studentInfo - 학생 정보
   * @returns 충분한지 여부
   */
  isStudentInfoComplete(studentInfo: StudentIdInfo): boolean {
    return !!(
      studentInfo.studentId &&
      studentInfo.name &&
      studentInfo.confidence > 0.3
    );
  },
};
