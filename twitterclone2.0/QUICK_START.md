# 🚀 Quick Start - Deploy to Vercel in 5 Minutes

## Step 1: Push to GitHub (1 minute)
```bash
cd /workspaces/fullstack_practise/twitterclone2.0
git add .
git commit -m "Ready for production deployment"
git push origin main
```

## Step 2: Import to Vercel (2 minutes)
1. Visit https://vercel.com/new
2. Click "Import" on your repository
3. Select `twitterclone2.0` folder as root (if asked)
4. Click "Deploy" (don't configure yet, we'll add env vars after first deploy)

## Step 3: Add Environment Variables (2 minutes)
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Copy these from your `.env` file:

**Required (Authentication won't work without these):**
```
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=https://your-project.vercel.app
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
MONGODB_URI=<your-mongodb-uri>
GITHUB_ID=<your-github-id>
GITHUB_SECRET=<your-github-secret>
GOOGLE_ID=<your-google-id>
GOOGLE_SECRET=<your-google-secret>
```

**Optional (for full functionality):**
```
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
NEXT_PUBLIC_APIKEY_GIPHY=<your-giphy-key>
NEWS_API_KEY=<your-news-api-key>
UPSTASH_REDIS_REST_URL=<your-redis-url>
UPSTASH_REDIS_REST_TOKEN=<your-redis-token>
```

4. Click "Save"
5. Go to "Deployments" tab
6. Click "⋮" on latest deployment → "Redeploy"

## Step 4: Configure OAuth Callbacks (< 1 minute)
After deployment completes, update your OAuth settings:

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Click your OAuth App
3. Update Authorization callback URL to:
   ```
   https://your-project.vercel.app/api/auth/callback/github
   ```

**Google OAuth:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Add to Authorized redirect URIs:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```

**Supabase:**
1. Go to your Supabase Project → Authentication → URL Configuration
2. Add to Redirect URLs:
   ```
   https://your-project.vercel.app/login
   https://your-project.vercel.app
   ```

## Step 5: Test! (< 1 minute)
1. Visit your Vercel URL
2. Click "Sign in with GitHub" or "Sign in with Google"
3. For new users: Fill details → Should go to sidebar
4. For existing users: Should go directly to sidebar

## 🎉 Done!

Your app is now live at: `https://your-project.vercel.app`

## ⚠️ Important Notes

- **NEXTAUTH_URL**: Must match your Vercel domain exactly
- **MongoDB**: Ensure Atlas allows connections from `0.0.0.0/0`
- **First deploy**: May fail if env vars not set - that's normal, just redeploy after adding them

## 🐛 Troubleshooting

**OAuth not working?**
- Check callback URLs match your Vercel domain
- Verify env vars are set (all of them!)
- Redeploy after adding env vars

**"Database connection failed"?**
- Check MongoDB Atlas IP whitelist
- Verify MONGODB_URI is correct
- Test connection string locally first

**Still having issues?**
- Check Vercel deployment logs
- Verify all required env vars are present
- See DEPLOYMENT.md for detailed troubleshooting

---

**Need help?** Check `DEPLOYMENT.md` for the complete guide.
