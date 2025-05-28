import Tesseract from "tesseract.js";

/** OCR 결과 타입 */
export interface StudentIdInfo {
  studentId: string | null;
  name: string | null;
  department: string | null;
  campus: "yangsan" | "jangjeom" | null;
  grade: number | null;
  confidence: number; // 0–1 범위 신뢰도
}

export interface OcrResult {
  success: boolean;
  studentInfo: StudentIdInfo | null;
  rawText: string;
  error?: string;
  debugInfo?: { detectedTexts: string[] };
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  message?: string;
}

/**
 * 클라이언트 측 OCR 서비스
 */
export const clientOcrService = {
  /** ---------- 1. OCR ---------- */
  async performOCR(imageFile: File): Promise<string> {
    try {
      const { data } = await Tesseract.recognize(imageFile, "kor+eng", {
        logger:
          process.env.NODE_ENV === "development"
            ? (m) => console.log("Tesseract Log:", m)
            : () => {},
      });
      return data.text;
    } catch (err) {
      console.error("Tesseract OCR 오류:", err);
      throw new Error("OCR 처리 중 오류가 발생했습니다.");
    }
  },

  /** ---------- 2. 학생정보 추출 ---------- */
  async extractStudentIdInfo(imageFile: File): Promise<OcrResult> {
    try {
      const fullText = await this.performOCR(imageFile);
      if (!fullText.trim()) {
        return {
          success: false,
          studentInfo: null,
          rawText: "",
          error: "이미지에서 텍스트를 찾을 수 없습니다.",
        };
      }

      const studentInfo = this.parseStudentInfo(fullText);

      return {
        success: studentInfo.confidence >= 0.3,
        studentInfo,
        rawText: fullText,
        debugInfo: { detectedTexts: [fullText] },
      };
    } catch (err) {
      console.error("학생증 OCR 처리 오류:", err);
      return {
        success: false,
        studentInfo: null,
        rawText: "",
        error: err instanceof Error ? err.message : "알 수 없는 오류입니다.",
      };
    }
  },

  /** ---------- 3. 텍스트 파싱 ---------- */
  parseStudentInfo(fullText: string): StudentIdInfo {
    const normalized = fullText.replace(/\s+/g, " ");
    console.log("정규화 텍스트:", normalized);

    let studentId: string | null = null;
    let name: string | null = null;
    let department: string | null = null;
    let confidence = 0;

    /* --- (1) 학번 --- */
    const sidLabel = /학번\s*[:\-]?\s*(\d{8,10})/i.exec(normalized);
    if (sidLabel) {
      studentId = sidLabel[1];
      confidence += 0.45;
    } else {
      const sidFallback = /\b20\d{6,8}\b/.exec(normalized); // 예: 202155556
      if (sidFallback) {
        studentId = sidFallback[0];
        confidence += 0.25;
      }
    }

    /* --- (2) 이름 --- */
    const nameLabel = /이름\s*[:\-]?\s*([가-힣]{2,4})/i.exec(normalized);
    if (nameLabel) {
      name = nameLabel[1];
      confidence += 0.35;
    } else {
      // 학번 뒤에 오는 이름 패턴 먼저 시도 (더 정확함)
      if (studentId) {
        const nameAfterStudentId = new RegExp(
          studentId + "\\s+([가-힣]{2,4})"
        ).exec(normalized);
        if (nameAfterStudentId) {
          name = nameAfterStudentId[1];
          confidence += 0.3;
        }
      }

      // 여전히 찾지 못했다면 범용 패턴 사용 (개선된 버전)
      if (!name) {
        const nameFallbackRegex = /([가-힣]{2,4})(?=\s|$|[^가-힣])/g;
        const blacklist =
          /(재학|상태|학번|소속|대학|학과|부산|양산|정보|생명|공학|모바일|학생|pepsin|pith)/i;
        let match: RegExpExecArray | null;
        while ((match = nameFallbackRegex.exec(normalized))) {
          const candidateName = match[1];
          if (!blacklist.test(candidateName)) {
            name = candidateName;
            confidence += 0.15;
            break;
          }
        }
      }
    }

    /* --- (3) 소속(정보의생명공학대학만 인식) --- */
    if (
      normalized.includes("정보의생명공학대학") ||
      normalized.includes("정보의생명공학") ||
      normalized.includes("정보의생명")
    ) {
      department = "정보의생명공학대학";
      confidence += 0.1;
    }

    console.log("파싱 결과:", {
      studentId,
      name,
      department,
      confidence,
    });

    return {
      studentId,
      name,
      department,
      campus: null, // 캠퍼스는 사용자가 직접 입력
      grade: null, // 학년 추정 제거
      confidence,
    };
  },

  /** ---------- 4. 이미지 파일 검증 ---------- */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return { isValid: false, error: "파일 크기가 10MB를 초과합니다." };
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return { isValid: false, error: "JPG, PNG, WebP만 지원합니다." };
    }
    return { isValid: true };
  },

  /** ---------- 5. 신뢰도 표시 ---------- */
  getConfidenceText(score: number) {
    if (score >= 0.8) return "매우 높음";
    if (score >= 0.6) return "높음";
    if (score >= 0.4) return "보통";
    if (score >= 0.2) return "낮음";
    return "매우 낮음";
  },

  getConfidenceColor(score: number) {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-blue-600";
    if (score >= 0.4) return "text-yellow-600";
    if (score >= 0.2) return "text-orange-600";
    return "text-red-600";
  },

  /** ---------- 6. 형식 검증 ---------- */
  async validateStudentInfo(
    studentId: string,
    name: string
  ): Promise<ValidationResult> {
    if (!/^20\d{6,8}$/.test(studentId))
      return { valid: false, error: "부산대 학번 형식이 아닙니다." };
    if (!/^[가-힣]{2,4}$/.test(name))
      return { valid: false, error: "이름 형식이 올바르지 않습니다." };
    return { valid: true, message: "학생 정보가 유효합니다." };
  },
};
