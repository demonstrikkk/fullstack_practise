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
  productionBrowserSourceMaps: true,
  images: {
    domains: [

      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com"
    ],
  },
  webpack: (config , { isServer }) => {
    config.resolve.alias["@" ] = path.resolve(__dirname);
    if (!isServer) {
      // Exclude better-sqlite3 from client bundles
      config.externals.push("better-sqlite3");
    }
    return config;
  },
};

export default nextConfig;
