import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  // Emit /admin/index.html so GitHub Pages can serve direct visits and refreshes.
  trailingSlash: true,
  images: {
    qualities: [75, 90],
    unoptimized: true,
  },
};

export default nextConfig;
