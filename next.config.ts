import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 외부 링크 정의 (필요한 경우)
  // assetPrefix: '.',
};

export default nextConfig;
