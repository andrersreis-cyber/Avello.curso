import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações de produção
  poweredByHeader: false,

  // Redirects
  async redirects() {
    return [
      {
        source: '/landing',
        destination: '/jornada',
        permanent: false,
      },
    ]
  },
  
  // Output para Netlify
  output: 'standalone',
  
  // Configuração de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
