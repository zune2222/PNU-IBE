import { useState, useEffect } from "react";

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: "portrait" | "landscape";
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  hasTouch: boolean;
  platform: "ios" | "android" | "desktop" | "unknown";
}

export function useMobile(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: "landscape",
    screenWidth: 0,
    screenHeight: 0,
    userAgent: "",
    hasTouch: false,
    platform: "unknown",
  });

  useEffect(() => {
    const updateDetection = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const userAgent = navigator.userAgent;
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // 플랫폼 감지
      let platform: "ios" | "android" | "desktop" | "unknown" = "unknown";
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        platform = "ios";
      } else if (/Android/.test(userAgent)) {
        platform = "android";
      } else if (!hasTouch) {
        platform = "desktop";
      }

      // 기기 타입 감지 (화면 크기 기준)
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;
      const isDesktop = screenWidth >= 1024;

      // 화면 방향 감지
      const orientation = screenWidth > screenHeight ? "landscape" : "portrait";

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        orientation,
        screenWidth,
        screenHeight,
        userAgent,
        hasTouch,
        platform,
      });
    };

    // 초기 감지
    updateDetection();

    // 화면 크기 변경 감지
    window.addEventListener("resize", updateDetection);
    window.addEventListener("orientationchange", updateDetection);

    return () => {
      window.removeEventListener("resize", updateDetection);
      window.removeEventListener("orientationchange", updateDetection);
    };
  }, []);

  return detection;
}

// 터치 이벤트 처리를 위한 추가 Hook
export function useTouch() {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    return {
      isLeftSwipe,
      isRightSwipe,
      isUpSwipe,
      isDownSwipe,
      distanceX,
      distanceY,
    };
  };

  return {
    touchStart,
    touchEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

// 진동 피드백을 위한 Hook
export function useHaptic() {
  const vibrate = (pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const vibrateLight = () => vibrate(50);
  const vibrateMedium = () => vibrate(100);
  const vibrateHeavy = () => vibrate(200);
  const vibratePattern = () => vibrate([100, 50, 100]);

  return {
    vibrate,
    vibrateLight,
    vibrateMedium,
    vibrateHeavy,
    vibratePattern,
    isSupported: "vibrate" in navigator,
  };
}
