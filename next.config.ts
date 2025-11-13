import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export configuration for IIS deployment
  output: 'export',

  // Base path for different environments (e.g., /net-frontend for production)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Add trailing slashes for better IIS compatibility
  trailingSlash: true,

  // Image optimization must be disabled for static export
  images: {
    unoptimized: true,
  },

  // Webpack configuration for ArcGIS SDK
  // Note: Turbopack is not used because it doesn't support the resolve.fallback
  // configuration required by ArcGIS SDK for Node.js polyfills
  webpack: (config) => {
    // ArcGIS SDK uses web workers and WASM
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;
