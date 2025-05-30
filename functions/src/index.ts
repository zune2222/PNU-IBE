/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Discord 스케줄러 함수들 가져오기
import {
  sendDailySummary,
  systemHealthCheck,
  checkReturnDelays,
} from "./discord-scheduler";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Firebase Admin SDK 초기화
admin.initializeApp();

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
      functions: [
        "healthCheck",
        "sendDailySummary",
        "systemHealthCheck",
        "checkReturnDelays",
      ],
    });
  }
);

// Discord 스케줄러 함수들 export
export { sendDailySummary, systemHealthCheck, checkReturnDelays };
