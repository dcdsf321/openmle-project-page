import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/openmle-project-page",
  assetPrefix: "/openmle-project-page",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
