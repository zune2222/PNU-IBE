// API 클라이언트 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * URL-safe base64 디코딩 (JWT용)
   */
  private base64UrlDecode(base64Url: string): string {
    // URL-safe base64를 일반 base64로 변환
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // 패딩 추가
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error("Invalid base64 string");
      }
      base64 += "=".repeat(4 - pad);
    }

    return atob(base64);
  }

  /**
   * JWT 토큰이 만료되었는지 확인
   */
  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.warn("토큰 형식이 올바르지 않습니다.");
        return true;
      }

      // payload 디코딩 (URL-safe base64)
      const payload = JSON.parse(this.base64UrlDecode(parts[1]));

      if (!payload.exp) {
        console.warn("토큰에 만료 시간(exp)이 없습니다.");
        return false; // exp가 없으면 만료되지 않은 것으로 간주
      }

      // exp는 초 단위, Date.now()는 밀리초 단위
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      const isExpired = currentTime >= expirationTime;

      if (isExpired) {
        console.warn(
          `토큰 만료됨 - 만료 시간: ${new Date(
            expirationTime
          ).toLocaleString()}, 현재 시간: ${new Date(
            currentTime
          ).toLocaleString()}`
        );
      } else {
        console.log(
          `토큰 유효 - 만료까지 남은 시간: ${Math.floor(
            (expirationTime - currentTime) / 1000 / 60
          )}분`
        );
      }

      return isExpired;
    } catch (error) {
      console.error("토큰 파싱 실패:", error);
      return false; // 파싱 실패 시 만료되지 않은 것으로 간주 (토큰 보존)
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("auth_token");

    // 토큰이 있으면 만료 여부 확인
    if (token && this.isTokenExpired(token)) {
      console.warn("토큰이 만료되어 자동으로 삭제됩니다.");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      return null;
    }

    return token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // 401 에러 시 토큰이 실제로 만료되었는지 확인
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("auth_token");
          if (token && this.isTokenExpired(token)) {
            console.warn("토큰이 만료되어 삭제됩니다.");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
          }
        }
        throw new Error("인증이 필요합니다. 로그인해주세요.");
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
