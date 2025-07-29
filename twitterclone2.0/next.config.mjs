// /** @type {import('next').NextConfig} */
// const nextConfig = {
  
// images: {
//     domains: [
//       'res.cloudinary.com',       // if you're using Cloudinary
//       'avatars.githubusercontent.com' ,// allow GitHub avatars
//       'lh3.googleusercontent.com'
//     ],
//   },
<<<<<<< HEAD
//    eslint: {
//     // ignoreDuringBuilds: true,
//     // Or more specifically:
//     rules: {
//       "@next/next/no-img-element": "off"
//     }
//   },
  
=======
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731
// };



// export default nextConfig;
<<<<<<< HEAD

=======
import path from "path";
import { fileURLToPath } from "url";

/** Needed to replicate __dirname in ES Modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
<<<<<<< HEAD
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ]
  },
  eslint: {
    ignoreDuringBuilds: true  // Changed from rules object
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };
    return config;
  }
};

export default nextConfig;
=======
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com"
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@" ] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
>>>>>>> 38da3092a9baa9fe3af48ab1c9159325f2626731
