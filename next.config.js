/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    port: 3000,
  },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/requests/**'],
    };
    return config;
  },
}

module.exports = nextConfig 