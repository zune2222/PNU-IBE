import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastToastRef = useRef<{ message: string; timestamp: number } | null>(
    null
  );

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const now = Date.now();

    // 중복 토스트 방지: 같은 메시지가 2초 이내에 연속으로 호출되면 무시
    if (
      lastToastRef.current &&
      lastToastRef.current.message === toast.message &&
      now - lastToastRef.current.timestamp < 2000 // 2초로 증가
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log("중복 토스트 방지:", toast.message);
      }
      return;
    }

    // 기존에 같은 메시지의 토스트가 있다면 제거
    setToasts((prev) => {
      const filtered = prev.filter((t) => t.message !== toast.message);

      // 최대 3개까지만 유지 (새로운 것이 추가되면 가장 오래된 것 제거)
      if (filtered.length >= 3) {
        return filtered.slice(1); // 가장 오래된 것 제거
      }

      return filtered;
    });

    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // 마지막 토스트 정보 업데이트
    lastToastRef.current = {
      message: toast.message,
      timestamp: now,
    };

    // 자동 제거
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
    lastToastRef.current = null;
  }, []);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="w-5 h-5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case "success":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30";
      case "error":
        return "from-red-500/20 to-rose-500/20 border-red-500/30";
      case "warning":
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case "info":
        return "from-blue-500/20 to-indigo-500/20 border-blue-500/30";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearAllToasts }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 w-full left-1/2 transform -translate-x-1/2 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
              className={`
                relative max-w-xs sm:w-4/5 md:max-w-sm w-full mx-auto pointer-events-auto
                bg-gradient-to-r ${getToastColors(toast.type)}
                backdrop-blur-xl border rounded-2xl shadow-2xl
                p-4 overflow-hidden
              `}
            >
              {/* 글래스모피즘 효과를 위한 배경 오버레이 */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl"></div>

              {/* 내용 */}
              <div className="relative flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getToastIcon(toast.type)}
                </div>

                <div className="flex-1 min-w-0">
                  {toast.title && (
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {toast.title}
                    </p>
                  )}
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {toast.message}
                  </p>

                  {toast.action && (
                    <button
                      onClick={toast.action.onClick}
                      className="mt-2 text-xs font-medium text-gray-700 hover:text-gray-900 underline transition-colors"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => hideToast(toast.id)}
                  className="flex-shrink-0 ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* 진행 바 (duration이 있는 경우) */}
              {toast.duration && toast.duration > 0 && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/40 to-white/60 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: toast.duration / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
