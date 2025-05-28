import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleAnalytics, pageview } from "../shared/lib/analytics";
import { AuthProvider } from "../shared/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useMobile } from "../shared/hooks/useMobile";
import { useOffline } from "../shared/hooks/useOffline";
import MobileNavigation from "../shared/components/MobileNavigation";

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      refetchOnWindowFocus: false,
    },
  },
});

// 오프라인 알림 컴포넌트
function OfflineIndicator() {
  const { isOnline, offlineData } = useOffline();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowNotification(true);
    } else if (
      isOnline &&
      offlineData &&
      (offlineData.applications.length > 0 || offlineData.photos.length > 0)
    ) {
      setShowNotification(true);
      // 5초 후 알림 숨기기
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [isOnline, offlineData]);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg max-w-sm ${
        isOnline ? "bg-green-500" : "bg-yellow-500"
      } text-white`}
    >
      <div className="flex items-center">
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            isOnline ? "bg-green-200" : "bg-yellow-200"
          }`}
        ></div>
        <div className="text-sm">
          {!isOnline
            ? "오프라인 상태입니다. 일부 기능이 제한될 수 있습니다."
            : "온라인 상태로 복구되었습니다. 저장된 데이터를 동기화하는 중..."}
        </div>
      </div>
    </div>
  );
}

// PWA 설치 안내 컴포넌트
function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const { isMobile } = useMobile();

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      // 브라우저의 기본 설치 프롬프트 방지
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  if (!showPrompt || !isMobile) return null;

  return (
    <div
      className="fixed left-4 right-4 z-40 p-4 bg-blue-600 text-white rounded-lg shadow-lg"
      style={{ bottom: "calc(4rem + env(safe-area-inset-bottom) + 1rem)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">앱으로 설치하기</h3>
          <p className="text-xs opacity-90">
            홈 화면에 추가하여 더 편리하게 이용하세요
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3 py-1 text-xs bg-blue-700 rounded"
          >
            닫기
          </button>
          <button
            onClick={handleInstall}
            className="px-3 py-1 text-xs bg-white text-blue-600 rounded font-medium"
          >
            설치
          </button>
        </div>
      </div>
    </div>
  );
}

// 메인 앱 래퍼 컴포넌트
function AppWrapper({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}) {
  const { isMobile } = useMobile();
  const router = useRouter();

  // 관리자 페이지에서는 모바일 네비게이션 숨기기
  const isAdminPage = router.pathname.startsWith("/admin");
  const showMobileNav = isMobile && !isAdminPage;

  return (
    <div className={showMobileNav ? "mobile-nav-safe-area" : ""}>
      <OfflineIndicator />
      <PWAInstallPrompt />
      <Component {...pageProps} />
      {showMobileNav && <MobileNavigation />}
    </div>
  );
}

// BeforeInstallPromptEvent 타입 정의
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // 페이지 변경 시 Google Analytics에 페이지뷰 이벤트 전송
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    // 라우터 이벤트 리스너 등록
    router.events.on("routeChangeComplete", handleRouteChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // 서비스 워커 등록
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <main className="font-pretendard">
          <GoogleAnalytics />
          <AppWrapper Component={Component} pageProps={pageProps} />
        </main>
      </AuthProvider>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
