/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // GSAP and Recharts smoother animations in strict dev
  transpilePackages: ['gsap', '@studio-freight/lenis'],
};

export default nextConfig;
