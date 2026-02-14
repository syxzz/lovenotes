import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/lovenotes" : "";

const nextConfig: NextConfig = {
  output: "export",

  basePath,
  assetPrefix: isProd ? "/lovenotes/" : "",

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    unoptimized: true, // 关键：关闭 next/image 优化
  },
};

export default nextConfig;
