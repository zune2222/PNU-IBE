import React, { createContext, useContext, useEffect, useState } from "react";
import { esportsAuthService, AuthUser } from "../services/esportsAuth";

interface ESSportsAuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (studentId: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const ESSportsAuthContext = createContext<ESSportsAuthContextType | undefined>(undefined);

export function ESSportsAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 로드 시 저장된 사용자 정보 확인
    const savedUser = esportsAuthService.getCurrentUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  const login = async (studentId: string, password: string) => {
    setLoading(true);
    try {
      const authUser = await esportsAuthService.login(studentId, password);
      setUser(authUser);
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    esportsAuthService.logout();
    setUser(null);
  };

  const value: ESSportsAuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: user !== null,
  };

  return (
    <ESSportsAuthContext.Provider value={value}>
      {children}
    </ESSportsAuthContext.Provider>
  );
}

export function useESSportsAuth() {
  const context = useContext(ESSportsAuthContext);
  if (context === undefined) {
    throw new Error("useESSportsAuth must be used within an ESSportsAuthProvider");
  }
  return context;
}
