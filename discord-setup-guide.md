# 🤖 Discord 알림 시스템 설정 가이드

## 📋 **현재 상황**

현재 시스템에는 Discord 알림 기능이 모두 구현되어 있지만, **실제로 사용하려면 몇 가지 추가 설정이 필요**합니다.

## 🔧 **1단계: Discord Webhook 설정**

### Discord 서버에서 Webhook 생성

1. **Discord 서버 관리자 권한 필요**
2. 알림을 받을 채널 선택 (예: `#물품대여-알림`)
3. 채널 설정 → **연동** → **웹후크** → **웹후크 만들기**
4. 웹후크 이름 설정: `PNU IBE 대여 시스템`
5. **웹후크 URL 복사** (이 URL이 가장 중요!)

### 예시 Webhook URL 형식

```
https://discord.com/api/webhooks/1234567890123456789/abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890
```

## 🔐 **2단계: 환경 변수 설정**

### 프론트엔드 환경변수 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 추가:

```env
# Firebase 설정 (기존)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# ⭐ Discord Webhook URL (새로 추가!)
NEXT_PUBLIC_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

### Firebase Functions 환경변수 설정

**방법 1: Firebase CLI 사용** (권장)

```bash
# functions 폴더로 이동
cd functions

# Discord Webhook URL 설정
firebase functions:config:set discord.webhook_url="https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN"

# 설정 확인
firebase functions:config:get

# 설정 다운로드 (로컬 테스트용)
firebase functions:config:get > .runtimeconfig.json
```

**방법 2: .env 파일 사용** (Functions v2)

```bash
# functions 폴더에 .env 파일 생성
cd functions
echo 'DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN' > .env
```

## 🧪 **3단계: Discord 테스트**

### 즉시 테스트 (프론트엔드)

1. **개발 서버 실행**:

   ```bash
   npm run dev
   ```

2. **관리자 페이지 접속**: http://localhost:3000/admin/login

3. **관리자 로그인** (Firebase Auth 필요)

4. **대시보드**에서 "Discord 테스트" 버튼 클릭

5. **Discord 채널에서 테스트 메시지 확인**

### 자동 알림 테스트 (Functions)

1. **Functions 배포**:

   ```bash
   cd functions
   npm install
   npm run build
   firebase deploy --only functions
   ```

2. **스케줄 함수 확인**:

   - Firebase Console → Functions → 배포된 함수 목록 확인
   - `checkOverdueRentals`: 매일 오전 9시
   - `sendDailySummary`: 매일 저녁 6시
   - `systemHealthCheck`: 매시간

3. **수동 테스트 실행**:

   ```bash
   # 연체 확인 함수 수동 실행
   firebase functions:shell
   > checkOverdueRentals()

   # 또는 웹에서 직접 호출
   curl -X POST "https://asia-northeast3-YOUR_PROJECT_ID.cloudfunctions.net/checkOverdueRentals"
   ```

## 📨 **4단계: 실제 알림 동작 확인**

현재 구현된 알림 유형:

### 자동 알림 (Firebase Functions)

- ✅ **연체 확인**: 매일 오전 9시 자동 실행
- ✅ **일일 요약**: 매일 저녁 6시 자동 실행
- ✅ **시스템 헬스체크**: 매시간 자동 실행

### 즉시 알림 (프론트엔드)

- ✅ **새 대여 신청** 시 알림
- ✅ **대여 승인/거부** 시 알림
- ✅ **반납 신청/완료** 시 알림
- ✅ **시스템 오류** 시 알림
- ✅ **테스트 메시지** 전송

## 🔄 **5단계: 자동화 설정 완료 확인**

### Firebase Console에서 확인

1. **Firebase Console** → **Functions** 접속
2. 배포된 함수 목록에서 다음 확인:
   - `checkOverdueRentals` ✅
   - `sendDailySummary` ✅
   - `systemHealthCheck` ✅

### 로그 모니터링

```bash
# 실시간 로그 확인
firebase functions:log --only checkOverdueRentals

# 특정 기간 로그 확인
firebase functions:log --since 2024-01-01
```

### Discord 채널에서 확인

예상되는 메시지들:

- 📊 **매일 6시**: 일일 요약 보고서
- ⚠️ **연체 발생시**: 연체 알림 (오전 9시 체크)
- 🔧 **시스템 이상시**: 헬스체크 경고

## 🎨 **6단계: Discord 채널 최적화**

### 추천 채널 구조

```
📋 #물품대여-알림
  ├── 새 신청 알림
  ├── 승인/거부 알림
  └── 연체 알림

📊 #시스템-요약
  ├── 일일 요약 (매일 6시)
  └── 통계 리포트

🚨 #시스템-오류
  ├── 헬스체크 경고
  └── 오류 및 예외 상황

🤖 #봇-테스트
  └── 개발/테스트 메시지
```

### 채널별 Webhook 분리 (고급 설정)

더 세분화된 알림을 원한다면:

```env
# 각 채널별 Webhook URL 설정
DISCORD_WEBHOOK_GENERAL=https://discord.com/api/webhooks/.../...
DISCORD_WEBHOOK_SUMMARY=https://discord.com/api/webhooks/.../...
DISCORD_WEBHOOK_ERRORS=https://discord.com/api/webhooks/.../...
```

## 🔍 **7단계: 문제 해결**

### 일반적인 문제들

1. **"Discord Webhook URL이 설정되지 않았습니다" 오류**

   - 프론트엔드: `.env.local` 파일의 `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` 확인
   - Functions: `firebase functions:config:get` 명령으로 설정 확인
   - 개발 서버/Functions 재시작 필요

2. **"Discord 메시지 전송 실패" 오류**

   - Webhook URL이 올바른지 확인
   - Discord 서버에서 Webhook가 삭제되지 않았는지 확인
   - 네트워크 방화벽 설정 확인

3. **Functions 스케줄러가 작동하지 않는 경우**

   - Firebase Console에서 함수 배포 상태 확인
   - Cloud Scheduler가 활성화되었는지 확인
   - 지역 설정이 올바른지 확인 (`asia-northeast3`)

4. **타임존 문제**
   - 스케줄러의 `timeZone: "Asia/Seoul"` 설정 확인
   - 실제 실행 시간이 예상과 다른 경우 로그 확인

### 디버깅 명령어

```bash
# Functions 로그 실시간 확인
firebase functions:log --only checkOverdueRentals

# 특정 함수 수동 실행
firebase functions:shell
> checkOverdueRentals()

# 배포 상태 확인
firebase functions:list

# 설정 값 확인
firebase functions:config:get
```

## 🎯 **사용 예시**

### 테스트 메시지 전송

```typescript
import { discordService } from "../shared/services/discordService";

// 테스트 메시지
await discordService.sendTestMessage();

// 새 대여 신청 알림
await discordService.notifyNewRentalApplication({
  userName: "홍길동",
  studentId: "2024123456",
  itemName: "노트북",
  startDate: "2024-01-15",
  endDate: "2024-01-22",
  purpose: "프로젝트 개발",
});
```

### Functions에서 수동 알림

```typescript
// Firebase Functions에서 직접 호출
import { sendDailySummary } from "./discord-scheduler";

// 수동으로 일일 요약 전송
await sendDailySummary();
```

## 📈 **추가 개선 사항**

1. **알림 필터링**: 특정 시간대에만 알림 전송
2. **사용자별 멘션**: 중요한 알림에 관리자 멘션 추가
3. **이미지 첨부**: 물품 사진을 Discord에 직접 업로드
4. **버튼 액션**: Discord에서 바로 승인/거부 가능한 버튼 추가
5. **알림 템플릿**: 상황별 맞춤형 메시지 템플릿
6. **통계 대시보드**: Discord 내에서 실시간 통계 조회

## 🚀 **완료 후 기대 효과**

- ⚡ **즉시 알림**: 새 신청 시 관리자가 즉시 확인 가능
- 📊 **자동 보고**: 일일 대여 현황 자동 요약 (매일 6시)
- 🔔 **연체 관리**: 연체 발생 시 즉시 알림으로 빠른 대응 (매일 9시)
- 🛡️ **시스템 모니터링**: 오류 발생 시 즉시 감지 및 알림 (매시간)
- 📈 **데이터 기반 의사결정**: 인기 물품, 사용 패턴 분석
- 🤖 **완전 자동화**: 관리자 개입 없이 24/7 모니터링

## 🗓️ **스케줄 요약**

| 시간          | 기능      | 설명                        |
| ------------- | --------- | --------------------------- |
| 매시간 정각   | 헬스체크  | 시스템 상태 모니터링        |
| 매일 오전 9시 | 연체 확인 | 연체 항목 확인 및 벌점 부과 |
| 매일 저녁 6시 | 일일 요약 | 하루 대여 현황 요약 보고    |

---

**💡 TIP**: Discord 알림이 너무 많다면, 채널별로 알림 타입을 분리하거나 특정 시간대에만 알림을 보내도록 설정할 수 있습니다!

**🔧 고급 사용자**: Webhook URL을 여러 개 설정하여 알림 타입별로 다른 채널에 전송할 수 있습니다!
