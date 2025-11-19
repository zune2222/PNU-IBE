import { apiClient } from './api';

export interface LoginRequest {
  studentId: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  student_id?: string;
  name?: string;
  department?: string;
  grade?: string | null;
  token?: string;
  message?: string;
}

export interface AuthUser {
  studentId: string;
  name: string;
  department: string;
  grade?: string | null;
  token: string;
}

export const esportsAuthService = {
  /**
   * 로그인
   */
  async login(studentId: string, password: string): Promise<AuthUser> {
    const response = await apiClient.post<LoginResponse>('/api/auth/student', {
      studentId,
      password,
    });

    if (!response.success || !response.token) {
      throw new Error(response.message || '로그인에 실패했습니다.');
    }

    const user: AuthUser = {
      studentId: response.student_id!,
      name: response.name!,
      department: response.department!,
      grade: response.grade,
      token: response.token!,
    };

    // 토큰과 사용자 정보 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }

    return user;
  },

  /**
   * 로그아웃
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  /**
   * 현재 사용자 정보 가져오기
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');

    if (!userStr || !token) return null;

    try {
      const user = JSON.parse(userStr) as AuthUser;
      return { ...user, token };
    } catch {
      return null;
    }
  },

  /**
   * 로그인 여부 확인
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};

