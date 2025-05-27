/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Discord 스케줄러 함수들 가져오기
import {
  checkOverdueRentals,
  sendDailySummary,
  systemHealthCheck,
} from "./discord-scheduler";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Firebase Admin SDK 초기화
admin.initializeApp();

// 🎯 학생증 정보 타입 정의
interface StudentIdInfo {
  studentId: string | null;
  name: string | null;
  department: string | null;
  campus: "yangsan" | "jangjeom" | null;
  grade: number | null;
  confidence: number; // 인식 신뢰도 (0-1)
}

// 🎯 OCR 결과 타입
interface OcrResult {
  success: boolean;
  studentInfo: StudentIdInfo | null;
  rawText: string;
  error?: string;
  debugInfo?: {
    detectedTexts: string[];
    imageSize?: number;
  };
}

/**
 * Mock OCR 함수 (실제 구현 전 테스트용)
 * 실제로는 Google Cloud Vision API나 다른 OCR 서비스를 사용
 */
async function performOCR(imageBuffer: Buffer): Promise<string> {
  // TODO: 실제 OCR 구현
  // 현재는 mock 데이터 반환
  logger.info(`Mock OCR 처리 - 이미지 크기: ${imageBuffer.length} bytes`);

  // 사용자가 요청한 특정 학생증 정보 반환
  const mockText = `
    모바일 학생증
    부산대학교 PUSAN NATIONAL UNIVERSITY
    학번: 202155556
    이름: 박준이
    상태: 재학
    생년월일: 20020624
    소속: 정보의생명공학대학
    캠퍼스: 양산
  `;

  return mockText;
}

/**
 * 학생증 이미지에서 텍스트를 추출하고 학생 정보를 파싱하는 함수
 */
export const extractStudentIdInfo = onCall(
  {
    // CORS 설정
    cors: [
      "http://localhost:3000",
      "https://pnu-ibe.web.app",
      "https://pnu-ibe.firebaseapp.com",
      // 모든 출처 허용 (테스트용, 프로덕션에서는 제거하고 특정 도메인만 허용하는 것이 좋습니다)
      "*",
    ],
    region: "asia-northeast3", // 서울 리전으로 통일
  },
  async (request) => {
    try {
      const { imageData, userId } = request.data;

      // 입력 검증
      if (!imageData || !userId) {
        throw new HttpsError(
          "invalid-argument",
          "이미지 데이터와 사용자 ID가 필요합니다."
        );
      }

      logger.info(`학생증 OCR 시작 - 사용자: ${userId}`);

      // Base64 이미지 데이터 처리
      let imageBuffer: Buffer;
      try {
        // Base64에서 데이터 URL 접두사 제거 (data:image/...;base64, 부분)
        const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
        imageBuffer = Buffer.from(base64Data, "base64");
      } catch (error) {
        throw new HttpsError(
          "invalid-argument",
          "유효하지 않은 이미지 데이터입니다."
        );
      }

      // 이미지 크기 검증
      if (imageBuffer.length > 10 * 1024 * 1024) {
        // 10MB 제한
        throw new HttpsError(
          "invalid-argument",
          "이미지 크기가 너무 큽니다. 10MB 이하의 이미지를 업로드해주세요."
        );
      }

      // OCR 수행
      const fullText = await performOCR(imageBuffer);

      if (!fullText || fullText.trim().length === 0) {
        return {
          success: false,
          studentInfo: null,
          rawText: "",
          error:
            "이미지에서 텍스트를 찾을 수 없습니다. 학생증이 명확하게 보이는지 확인해주세요.",
        } as OcrResult;
      }

      logger.info(`OCR 텍스트 추출 완료: ${fullText.length}자`);

      // 학생 정보 파싱
      const studentInfo = parseStudentInfo(fullText, []);

      // 결과 로깅
      logger.info(`학생 정보 파싱 결과`, {
        studentId: studentInfo.studentId,
        name: studentInfo.name,
        confidence: studentInfo.confidence,
        userId: userId,
      });

      return {
        success: studentInfo.confidence > 0.3, // 30% 이상 신뢰도
        studentInfo,
        rawText: fullText,
        debugInfo: {
          detectedTexts: [fullText],
          imageSize: imageBuffer.length,
        },
      } as OcrResult;
    } catch (error) {
      logger.error("학생증 OCR 처리 중 오류:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        "학생증 처리 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  }
);

/**
 * 추출된 텍스트에서 학생 정보를 파싱하는 함수
 */
function parseStudentInfo(
  fullText: string,
  textBlocks: string[]
): StudentIdInfo {
  let studentId: string | null = null;
  let name: string | null = null;
  let department: string | null = null;
  let campus: "yangsan" | "jangjeom" | null = null;
  let grade: number | null = null;
  let confidence = 0;

  // 텍스트 정규화 (소문자, 공백 제거)
  const normalizedText = fullText.toLowerCase().replace(/\s+/g, " ");

  // 1. 학번 추출 (부산대학교 학번 패턴: 연도(2자리) + 학과코드 + 일련번호)
  const studentIdPatterns = [
    /(\d{8,10})/g, // 8-10자리 숫자
    /학번[\s:]*(\d{8,10})/gi,
    /학생번호[\s:]*(\d{8,10})/gi,
    /student[\s]*id[\s:]*(\d{8,10})/gi,
  ];

  for (const pattern of studentIdPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      const id = match[1] || match[0];
      if (id && id.length >= 8 && id.length <= 10) {
        studentId = id;
        confidence += 0.3;
        break;
      }
    }
  }

  // 2. 이름 추출 (한글 이름 패턴)
  const namePatterns = [
    /이름[\s:]*([가-힣]{2,4})/gi,
    /성명[\s:]*([가-힣]{2,4})/gi,
    /name[\s:]*([가-힣]{2,4})/gi,
    /([가-힣]{2,4})[\s]*님/gi,
  ];

  for (const pattern of namePatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      name = match[1].trim();
      confidence += 0.2;
      break;
    }
  }

  // 3. 학과/전공 추출
  const departmentPatterns = [
    /(정보의생명공학대학)/gi, // 정보의생명공학대학 패턴 추가
    /(정보.*학과|정보.*전공|컴퓨터.*학과|컴퓨터.*전공)/gi,
    /(산업.*학과|산업.*전공|기계.*학과|기계.*전공)/gi,
    /(전기.*학과|전기.*전공|전자.*학과|전자.*전공)/gi,
    /소속[\s:]*([가-힣]+)/gi, // 소속 패턴 추가
    /학과[\s:]*([가-힣]+)/gi,
    /전공[\s:]*([가-힣]+)/gi,
    /과[\s:]*([가-힣]+)/gi,
  ];

  for (const pattern of departmentPatterns) {
    const match = fullText.match(pattern);
    if (match) {
      department = match[1] || match[0];
      confidence += 0.15;
      break;
    }
  }

  // 생년월일 추출 (8자리 숫자)
  const birthDatePatterns = [/생년월일[\s:]*(\d{8})/gi, /birth[\s:]*(\d{8})/gi];

  for (const pattern of birthDatePatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      // 생년월일은 추출만 하고 신뢰도를 높이는데 사용
      confidence += 0.1;
      break;
    }
  }

  // 4. 캠퍼스 판단 (부산대학교는 여러 캠퍼스가 있음)
  if (normalizedText.includes("양산") || normalizedText.includes("yangsan")) {
    campus = "yangsan";
    confidence += 0.1;
  } else if (
    normalizedText.includes("장전") ||
    normalizedText.includes("jangjeom")
  ) {
    campus = "jangjeom";
    confidence += 0.1;
  } else {
    // 학번으로 캠퍼스 추정 (일반적인 패턴)
    if (studentId) {
      const deptCode = studentId.substring(2, 4);

      // 정보대학은 주로 양산캠퍼스
      if (["01", "02", "03", "04", "05", "55"].includes(deptCode)) {
        campus = "yangsan";
        confidence += 0.05;
      }
    }
  }

  // 5. 학년 추정 (학번 기반)
  if (studentId && studentId.length >= 8) {
    const currentYear = new Date().getFullYear();
    const entryYear = 2000 + parseInt(studentId.substring(0, 2));
    const calculatedGrade = currentYear - entryYear + 1;

    if (calculatedGrade >= 1 && calculatedGrade <= 6) {
      grade = Math.min(calculatedGrade, 4); // 최대 4학년
      confidence += 0.1;
    }
  }

  // 6. 추가 검증 - "부산대학교" 또는 "PNU" 텍스트 확인
  if (
    normalizedText.includes("부산대") ||
    normalizedText.includes("pusan") ||
    normalizedText.includes("pnu") ||
    normalizedText.includes("national")
  ) {
    confidence += 0.15;
  }

  return {
    studentId,
    name,
    department,
    campus,
    grade,
    confidence: Math.min(confidence, 1.0), // 최대 1.0으로 제한
  };
}

/**
 * 학생 정보 검증 함수 (DB와 대조하여 유효성 확인)
 */
export const validateStudentInfo = onCall(
  {
    cors: [
      "http://localhost:3000",
      "https://pnu-ibe.web.app",
      "https://pnu-ibe.firebaseapp.com",
      // 모든 출처 허용 (테스트용, 프로덕션에서는 제거하고 특정 도메인만 허용하는 것이 좋습니다)
      "*",
    ],
    region: "asia-northeast3", // 서울 리전으로 통일
  },
  async (request) => {
    try {
      const { studentId, name, userId } = request.data;

      if (!studentId || !name || !userId) {
        throw new HttpsError(
          "invalid-argument",
          "학번, 이름, 사용자 ID가 모두 필요합니다."
        );
      }

      // Firestore에서 기존 사용자 정보 확인
      const db = admin.firestore();

      // 같은 학번으로 이미 등록된 사용자가 있는지 확인
      const existingUserQuery = await db
        .collection("users")
        .where("studentId", "==", studentId)
        .where("uid", "!=", userId)
        .get();

      if (!existingUserQuery.empty) {
        return {
          valid: false,
          error: "이미 다른 계정에서 사용 중인 학번입니다.",
          errorCode: "DUPLICATE_STUDENT_ID",
        };
      }

      // TODO: 실제 학사 시스템과 연동하여 학번-이름 매칭 검증
      // 현재는 기본 검증만 수행

      // 학번 형식 검증
      const studentIdRegex = /^\d{8,10}$/;
      if (!studentIdRegex.test(studentId)) {
        return {
          valid: false,
          error: "올바르지 않은 학번 형식입니다.",
          errorCode: "INVALID_STUDENT_ID_FORMAT",
        };
      }

      // 이름 형식 검증
      const nameRegex = /^[가-힣]{2,4}$/;
      if (!nameRegex.test(name)) {
        return {
          valid: false,
          error: "올바르지 않은 이름 형식입니다.",
          errorCode: "INVALID_NAME_FORMAT",
        };
      }

      logger.info(`학생 정보 검증 완료`, {
        studentId,
        name,
        userId,
        valid: true,
      });

      return {
        valid: true,
        message: "학생 정보가 확인되었습니다.",
      };
    } catch (error) {
      logger.error("학생 정보 검증 중 오류:", error);

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        "학생 정보 검증 중 오류가 발생했습니다."
      );
    }
  }
);

/**
 * 테스트용 헬스체크 함수
 */
export const healthCheck = onRequest(
  {
    region: "asia-northeast3", // 서울 리전으로 통일
  },
  (request, response) => {
    logger.info("Health check requested");
    response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      functions: ["extractStudentIdInfo", "validateStudentInfo"],
    });
  }
);

// Discord 스케줄러 함수들 export
export { checkOverdueRentals, sendDailySummary, systemHealthCheck };
