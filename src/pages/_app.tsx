import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GoogleAnalytics, pageview } from "../shared/lib/analytics";

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

  return (
    <main className="font-pretendard">
      <GoogleAnalytics />
      <Component {...pageProps} />
    </main>
  );
}
