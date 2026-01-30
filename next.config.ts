import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",

  basePath: isProd ? "/lovenotes" : "",
  assetPrefix: isProd ? "/lovenotes/" : "",

  images: {
    unoptimized: true, // 关键：关闭 next/image 优化
  },
};

export default nextConfig;
