import Script from "next/script";

// gtag 함수 타입 정의
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag: (
      command: string,
      target: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

// Google Analytics 측정 ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// 페이지 뷰 이벤트 전송
export function pageview(url: string) {
  if (typeof window.gtag !== "undefined" && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// 이벤트 전송
export function event({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
