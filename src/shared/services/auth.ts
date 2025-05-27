import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";

// 어드민 이메일 목록 (환경 변수로 관리하는 것이 좋습니다)
const ADMIN_EMAILS = [
  "admin@pnu-ibe.com",
  "president@pnu-ibe.com",
  "vice@pnu-ibe.com",
  // 필요에 따라 추가
];

export interface AuthUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

// Auth 서비스
export const authService = {
  // 이메일/비밀번호로 로그인
  async signIn(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  // 로그아웃
  async signOut(): Promise<void> {
    return await signOut(auth);
  },

  // 현재 사용자 가져오기
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // 어드민 권한 확인
  isAdmin(user: User | null): boolean {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email);
  },

  // 인증 상태 변화 감지
  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const authUser: AuthUser = {
          uid: user.uid,
          email: user.email,
          isAdmin: this.isAdmin(user),
        };
        callback(authUser);
      } else {
        callback(null);
      }
    });
  },

  // 어드민 권한 확인 (Promise 버전)
  async checkAdminPermission(): Promise<boolean> {
    const user = this.getCurrentUser();
    return this.isAdmin(user);
  },
};
