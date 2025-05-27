# 📚 PNU IBE 학생회 웹사이트

<div align="center">
  
  ![logo](https://github.com/user-attachments/assets/a2d6af06-cefe-445d-a2eb-848c2956de33)
  <h3>부산대학교 정보의생명공학대학 학생회 공식 웹사이트</h3>
  
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Website](https://img.shields.io/badge/웹사이트-red?style=for-the-badge&logo=web&logoColor=white)](https://pnu-ibe.web.app/)
</div>

## 🌟 소개

PNU IBE 학생회 웹사이트는 부산대학교 정보의생명공학대학 학생회의 공식 웹 플랫폼입니다. 학생회 활동, 행사 정보, 학생회 구성원 소개 등 다양한 정보를 제공하며, 학우들과의 소통을 강화하기 위해 개발되었습니다.

정보의생명공학대학 학생회 "정의"는 학우들을 위한 다양한 행사와 복지 프로그램을 운영하고 있으며, 이 웹사이트를 통해 모든 활동을 투명하게 공유하고 있습니다.

**🔗 웹사이트 바로가기: [https://pnu-ibe.web.app/](https://pnu-ibe.web.app/)**

## ✨ 주요 기능

- **📅 행사 관리 시스템**: 학생회 주최 행사 정보 제공 및 카테고리별 필터링
- **👥 학생회 소개**: 학생회 구성원 및 조직도 소개
- **🏆 학생회 연혁**: 학생회의 역사와 주요 성과 타임라인
- **📢 공지사항**: 중요 공지 및 알림 게시판
- **📱 반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험 제공

## 🚀 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Firebase (Firestore, Storage, Auth)
- **Deployment**: Firebase Hosting

## 📦 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/username/pnu-ibe.git
cd pnu-ibe

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🔥 Firebase 설정

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Firestore 보안 규칙 배포

```bash
firebase deploy --only firestore:rules
```

### 3. Storage 보안 규칙 배포

```bash
firebase deploy --only storage
```

## 🔔 디스코드 알림 설정

물품 대여 시스템에서 실시간 알림을 받기 위해 디스코드 웹훅을 설정할 수 있습니다.

### 1. 디스코드 웹훅 생성

1. 디스코드 서버에서 채널을 선택합니다
2. 채널 설정 → 연동 → 웹훅 생성
3. 웹훅 이름을 설정하고 웹훅 URL을 복사합니다

### 2. 환경 변수 추가

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# 디스코드 웹훅 URL
NEXT_PUBLIC_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
```

### 3. 알림 종류

설정이 완료되면 다음과 같은 상황에서 디스코드 알림을 받을 수 있습니다:

- **🔔 즉시 대여 완료**: 학생이 물품을 즉시 대여했을 때
- **✅ 반납 완료**: 학생이 물품을 반납했을 때
- **🚨 연체 알림**: 물품이 연체되었을 때

### 4. 알림 예시

```
🔔 즉시 대여 완료
홍길동 학생이 물품을 즉시 대여했습니다.

👤 학생 정보
이름: 홍길동
학번: 202012345
학과: 정보컴퓨터공학부
연락처: 010-1234-5678

📦 물품 정보
물품명: iPad Pro
카테고리: 태블릿
위치: 양산캠퍼스 제6공학관

📅 대여 기간
대여일: 2024-12-19
반납 예정일: 2024-12-20

🔗 관리
대여 ID: abc123def456
```

> **💡 참고**: 디스코드 웹훅 URL이 설정되지 않아도 시스템은 정상 작동하며, 단순히 알림만 전송되지 않습니다.

## 👨‍💼 어드민 기능

### 어드민 계정 설정

`src/shared/services/auth.ts` 파일에서 어드민 이메일을 설정하세요:

```typescript
const ADMIN_EMAILS = [
  "admin@pnu-ibe.com",
  "president@pnu-ibe.com",
  "vice@pnu-ibe.com",
];
```

### 어드민 페이지 접근

1. **로그인**: `/admin/login`
2. **대시보드**: `/admin/dashboard`
3. **Firebase 테스트**: `/admin/test-firebase`

### 어드민 기능

- ✅ **공지사항 관리**: 추가, 수정, 삭제
- ✅ **행사 관리**: 추가, 수정, 삭제 (이미지 업로드 포함)
- ✅ **이미지 업로드**: Firebase Storage 연동
- ✅ **실시간 데이터**: Firestore 실시간 동기화

## 📊 데이터 마이그레이션

기존 정적 데이터를 Firestore로 마이그레이션하려면:

1. `/admin/test-firebase` 페이지 접속
2. 브라우저 콘솔에서 다음 명령어 실행:

```javascript
// 모든 데이터 마이그레이션
migrateData.all();

// 개별 마이그레이션
migrateData.notices(); // 공지사항만
migrateData.events(); // 행사만
migrateData.rentals(); // 대여물품만
```

## 🔒 보안

- **Firestore**: 어드민만 쓰기 권한, 모든 사용자 읽기 권한
- **Storage**: 어드민만 업로드 권한, 모든 사용자 읽기 권한
- **Auth**: 이메일 기반 어드민 권한 관리

## 📁 프로젝트 구조

```
pnu-ibe/
├── public/          # 정적 파일 (이미지, 아이콘 등)
├── src/
│   ├── app/         # Next.js 앱 라우터
│   ├── components/  # 재사용 가능한 UI 컴포넌트
│   ├── pages/       # 페이지 컴포넌트
│   ├── shared/      # 공유 리소스 (데이터, 유틸리티)
│   ├── widgets/     # 복합 컴포넌트
│   └── styles/      # 전역 스타일
└── package.json     # 프로젝트 의존성 및 스크립트
```

## 👨‍💻 학생회 정보

- **학생회명**: 정의
- **설립 연도**: 2025년
- **위치**: 부산대학교 제6공학관
- **연락처**: 인스타그램 [@pnu_ibe](https://instagram.com/pnu_ibe)

## 🔮 향후 개발 계획

- 학생 커뮤니티 기능 추가
- 학생회비 사용 내역 공개 시스템
- 동아리 활동 소개 페이지
- 학사 일정 캘린더 연동

## 👏 기여하기

이 프로젝트에 기여하고 싶으신가요? 언제든지 Pull Request를 보내주세요!

1. 저장소를 Fork합니다
2. 새로운 Branch를 생성합니다: `git checkout -b feature/amazing-feature`
3. 변경사항을 Commit합니다: `git commit -m 'Add some amazing feature'`
4. Branch에 Push합니다: `git push origin feature/amazing-feature`
5. Pull Request를 생성합니다

## 📝 라이센스

© 2025 zune2222 All Rights Reserved.
