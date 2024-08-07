import pkg from "next/dist/compiled/webpack/webpack.js";
const { webpack } = pkg

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, {isServer}) => {
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
    }))
    return config
  }
};

export default nextConfig;
