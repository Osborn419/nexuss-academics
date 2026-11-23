import type { NextConfig } from "next";

const blobHost = process.env.BLOB_PUBLIC_HOST ?? "*.blob.vercel-storage.com";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Vercel and managed PostgreSQL providers supply their connection settings
  // at runtime; no provider-specific Next configuration is required here.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: blobHost }],
  },
};

export default nextConfig;
