import type { NextConfig } from "next";
import withPWAConfig from "next-pwa";

const withPWA = withPWAConfig({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // 외부 링크 정의 (필요한 경우)
  // assetPrefix: '.',
};

export default withPWA(nextConfig);
