/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'sokgijungbackoffice.com',
      },
    ],
    deviceSizes: [
      375,  // iPhone SE
      414,  // iPhone Plus
      640,  // 작은 태블릿
      750,  // iPhone
      828,  // iPhone 12
      1080, // 중간 태블릿
      1200, // 데스크톱
      1920, // 대형 데스크톱
      2048, // 4K
      3840  // 4K 대형
    ],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    formats: ['image/avif', 'image/webp'], // Next.js 14.1.0에서는 avif와 webp만 지원
    minimumCacheTTL: 31536000, // 1년 캐시
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    port: 3000,
  },
  webpack: (config, { isServer }) => {
    // Hydration 문제 방지를 위한 최적화
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // apply 페이지 관련 청크 최적화
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/requests/**'],
    };
    return config;
  },
}

module.exports = nextConfig 