/** @type {import('next').NextConfig} */
const nextConfig = {
  
images: {
    domains: [
      'res.cloudinary.com',       // if you're using Cloudinary
      'avatars.githubusercontent.com' ,// allow GitHub avatars
      'lh3.googleusercontent.com'
    ],
  },
};



export default nextConfig;
