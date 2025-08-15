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
// next.config.mjs
import path from "path";
import { fileURLToPath } from "url";
import withBundleAnalyzer from "@next/bundle-analyzer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
  webpack: (config) => {
    // alias "@" to your project root (adjust if you prefer "./src")
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

export default bundleAnalyzer(nextConfig);
