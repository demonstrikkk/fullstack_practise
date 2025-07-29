// /** @type {import('next').NextConfig} */
// const nextConfig = {
  
// images: {
//     domains: [
//       'res.cloudinary.com',       // if you're using Cloudinary
//       'avatars.githubusercontent.com' ,// allow GitHub avatars
//       'lh3.googleusercontent.com'
//     ],
//   },
//    eslint: {
//     // ignoreDuringBuilds: true,
//     // Or more specifically:
//     rules: {
//       "@next/next/no-img-element": "off"
//     }
//   },
  
// };



// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
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