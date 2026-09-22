/** @type {import('next').NextConfig} */
const staticExport = process.env.MOVITUR_STATIC_EXPORT === '1';

const nextConfig = {
  images: {
    unoptimized: true,
  },
};

if (staticExport) {
  nextConfig.output = 'export';
  nextConfig.trailingSlash = true;
} else {
  nextConfig.rewrites = async () => [
    {
      source: '/api/:path*',
      destination: 'http://127.0.0.1:8080/api/:path*',
    },
  ];
}

export default nextConfig;
