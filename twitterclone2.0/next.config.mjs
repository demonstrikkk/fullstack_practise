// /** @type {import('next').NextConfig} */
// const nextConfig = {
  
// images: {
//     domains: [
//       'res.cloudinary.com',       // if you're using Cloudinary
//       'avatars.githubusercontent.com' ,// allow GitHub avatars
//       'lh3.googleusercontent.com'
//     ],
//   },

// };



// export default nextConfig;

import path from "path";
import { fileURLToPath } from "url";

/** Needed to replicate __dirname in ES Modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com"
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
  // Optimize for Vercel deployment
  experimental: {
    // Use serverless functions more efficiently
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Output configuration for Vercel
  output: 'standalone',
};

export default nextConfig;
