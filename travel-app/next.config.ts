import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Cloudinary for user uploaded images
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // Travel Guide API domain for images
      {
        protocol: 'https',
        hostname: 'travelguide-rttu.onrender.com',
        port: '',
        pathname: '/**',
      },
      // Add other common image hosts you might use
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_API_URL || 'https://travelguide-rttu.onrender.com';
    return [
      // Specific like routes (two shapes to match backend)
      { source: '/api/proxy/post/:postId/like', destination: `${base}/api/Post/:postId/like` },
      { source: '/api/proxy/post/like/:postId', destination: `${base}/api/Post/like/:postId` },
      // Generic proxy for other endpoints
      { source: '/api/proxy/:path*', destination: `${base}/api/:path*` },
    ];
  },
};

export default nextConfig;
