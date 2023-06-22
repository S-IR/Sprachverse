/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      `lh3.googleusercontent.com`,
      `i.ytimg.com`,
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
