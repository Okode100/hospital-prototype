# Vercel Deployment Guide

## Fix 404 Error - Configuration Steps

### Option 1: Deploy from Frontend Directory (Recommended)

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Settings" → "General"
   - Under "Root Directory", set it to: `frontend`
   - Save changes

2. **Add Environment Variable:**
   - Go to "Settings" → "Environment Variables"
   - Add: `REACT_APP_API_URL`
   - Value: Your backend API URL (e.g., `https://your-backend-url.com/api` or `http://your-server:5000/api`)
   - Apply to: Production, Preview, Development

3. **Redeploy:**
   - Go to "Deployments"
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger deployment

### Option 2: Deploy from Root Directory

If you want to deploy from the root directory:

1. **In Vercel Dashboard:**
   - Make sure "Root Directory" is set to: `.` (root)
   - The `vercel.json` in root will handle the build

2. **Add Environment Variable:**
   - Same as Option 1

3. **Redeploy**

## Environment Variables Required

```
REACT_APP_API_URL=https://your-backend-api-url.com/api
```

## Verify Deployment

After redeployment, check:
1. The app should load without 404
2. All routes should work (/, /register, /patients, etc.)
3. API calls should connect to your backend

## Common Issues

### Still getting 404?
- Check build logs in Vercel
- Ensure `vercel.json` is in the correct location
- Verify React Router rewrites are working

### API calls failing?
- Check `REACT_APP_API_URL` environment variable is set
- Verify your backend CORS settings allow requests from Vercel domain
- Check browser console for API errors

### Build failing?
- Check Node version in Vercel settings (should be 18.x or 20.x)
- Review build logs for dependency errors
- Ensure all dependencies are in package.json

