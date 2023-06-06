/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {images: {
  domains: [
    "firebasestorage.googleapis.com",
    `lh3.googleusercontent.com`,
    ``,
  ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/account123/**',
      },
    ],
  },}

module.exports = nextConfig
