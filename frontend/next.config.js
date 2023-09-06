/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  async rewrites() {
    return [
      {
        source: "/__/auth",
        destination: "https://here-c8872.firebaseapp.com/__/auth",
      },
    ];
  },
}

module.exports = nextConfig
