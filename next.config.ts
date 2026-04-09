import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external device connections for JS bundles/HMR
  allowedDevOrigins: ['10.4.105.94', '172.23.0.1'],
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*'
      }
    ]
  }
};

export default nextConfig;
