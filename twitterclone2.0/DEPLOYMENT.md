# Twitter Clone 2.0 - Deployment Guide

## 🚀 Deploy to Vercel

This guide will help you deploy your Twitter Clone application to Vercel's free tier.

### Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
2. A [GitHub account](https://github.com) with this repository
3. All required API keys and service credentials

### Environment Variables Required

Before deploying, make sure you have all the following environment variables ready. You'll need to add them in Vercel's dashboard:

#### Authentication
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
- `GITHUB_ID` - GitHub OAuth App ID
- `GITHUB_SECRET` - GitHub OAuth App Secret
- `GOOGLE_ID` - Google OAuth Client ID
- `GOOGLE_SECRET` - Google OAuth Client Secret

#### Database
- `MONGODB_URI` - MongoDB connection string (use MongoDB Atlas free tier)
- `MONGODB_USERNAME` - MongoDB username
- `MONGODB_PASSWORD` - MongoDB password

#### Supabase (Authentication & Real-time)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_JWT_SECRET` - Supabase JWT secret

#### External APIs
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name (for image uploads)
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NEXT_PUBLIC_APIKEY_GIPHY` - Giphy API key
- `NEWS_API_KEY` - News API key

#### Redis/Caching (Optional but recommended)
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL (free tier available)
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token
- `REDIS_URL` - Redis connection URL

### Deployment Steps

#### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "Add New" → "Project"**

4. **Import your GitHub repository**
   - Select your repository
   - Click "Import"

5. **Configure Project**
   - Framework Preset: Next.js (should be auto-detected)
   - Root Directory: `twitterclone2.0` (if not in root)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

6. **Add Environment Variables**
   - Click on "Environment Variables"
   - Add all variables from the list above
   - Make sure to add them for Production, Preview, and Development environments

7. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

8. **Post-Deployment Configuration**
   - Update OAuth callback URLs:
     - **GitHub**: `https://your-app.vercel.app/api/auth/callback/github`
     - **Google**: `https://your-app.vercel.app/api/auth/callback/google`
   - Update Supabase redirect URLs:
     - Add `https://your-app.vercel.app/login` to allowed redirect URLs
     - Add `https://your-app.vercel.app` to site URL

#### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to project directory**
   ```bash
   cd /path/to/twitterclone2.0
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Follow the prompts**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: your-project-name
   - Directory: ./
   - Override settings: No

6. **Add environment variables**
   ```bash
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   # ... add all other environment variables
   ```

7. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Verifying Deployment

After deployment:

1. **Test the login flow**
   - Visit your deployed URL
   - Try OAuth login with GitHub/Google
   - Complete user details if new user
   - Verify redirect to sidebar

2. **Check functionality**
   - Create a post
   - Upload an image
   - Send a message
   - Check notifications

### Troubleshooting

#### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### OAuth Not Working
- Verify callback URLs in GitHub/Google OAuth settings
- Check `NEXTAUTH_URL` is set to your production URL
- Ensure `NEXTAUTH_SECRET` is set

#### Database Connection Issues
- Verify MongoDB URI is correct
- Check if MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Vercel
- Test connection string locally first

#### Images Not Loading
- Verify Cloudinary credentials
- Check image domain configuration in `next.config.mjs`
- Ensure CORS is enabled in Cloudinary

### Important Notes for Vercel Free Tier

- **Function Execution**: Max 10 seconds
- **Bandwidth**: 100GB/month
- **Serverless Function Size**: 50MB max
- **Build Time**: Unlimited builds for hobby projects
- **Environment Variables**: Unlimited

### Post-Deployment Checklist

- [ ] All environment variables are set
- [ ] OAuth providers are configured with correct callback URLs
- [ ] Database is accessible from Vercel
- [ ] Login flow works correctly
- [ ] New user registration works
- [ ] Existing user login redirects to sidebar
- [ ] Image uploads work
- [ ] Real-time features (chat, notifications) work
- [ ] Custom domain configured (optional)

### Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify all environment variables are set correctly
4. Check API routes are functioning

### Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase + Vercel](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Happy Deploying! 🎉**
