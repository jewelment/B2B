import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this block to allow massive CSV and ZIP file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', 
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      }
    ],
  },
};

export default nextConfig;