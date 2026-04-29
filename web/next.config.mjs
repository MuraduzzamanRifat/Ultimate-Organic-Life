/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.greenkart.demo' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
