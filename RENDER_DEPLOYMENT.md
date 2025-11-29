# Render Backend Deployment Guide

## ✅ Fix Applied

The backend deployment has been fixed with:
1. ✅ Added `start` script to `backend/package.json`
2. ✅ Created `render.yaml` configuration file

## 🚀 Deployment Steps

### Option 1: Using render.yaml (Automatic - Recommended)

1. **Commit and push the changes:**
   ```bash
   git add .
   git commit -m "Fix Render backend deployment"
   git push
   ```

2. **In Render Dashboard:**
   - Go to your Render dashboard
   - Render will automatically detect `render.yaml`
   - Create a new Web Service and connect your repository
   - Render will use the configuration from `render.yaml`

3. **Set Environment Variables:**
   - Go to your service → Environment
   - Add: `MONGO_URI` with your MongoDB connection string
   - The `PORT` variable is optional (Render provides it automatically)

4. **Deploy:**
   - Render will automatically deploy after detecting changes

### Option 2: Manual Configuration

If you prefer to configure manually in Render Dashboard:

1. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository: `hospital-prototype`

2. **Configure Service:**
   - **Name:** `hospital-backend` (or your preferred name)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && yarn install`
   - **Start Command:** `yarn start`
   - **Plan:** Free (or your preferred plan)

3. **Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Add:
     - **Key:** `MONGO_URI`
     - **Value:** Your MongoDB Atlas connection string
       ```
       mongodb+srv://Moses:XEHqHeFdJMeplO0T@cluster0.fp5sksz.mongodb.net/hospital_prototype?retryWrites=true&w=majority
       ```
   - **PORT** is automatically provided by Render (don't set it manually)

4. **Deploy:**
   - Click "Create Web Service"
   - Render will deploy your backend

## ✅ Verify Deployment

After deployment, check:
1. Build logs should show "Build successful"
2. Service should show "Live" status
3. Visit your Render URL (e.g., `https://hospital-backend.onrender.com`)
4. You should see: `{"status":"OK","message":"Hospital prototype API"}`

## 🔧 Test API Endpoints

Once deployed, test your API:
- Health check: `https://your-backend.onrender.com/`
- Get patients: `https://your-backend.onrender.com/api/patients`
- API base: `https://your-backend.onrender.com/api`

## ⚠️ Common Issues

### Build fails with "package.json not found"
- ✅ **Fixed:** Root Directory is now set to `backend`

### Service crashes immediately
- Check environment variables (MONGO_URI must be set)
- Check Render logs for error messages
- Verify MongoDB connection string is correct

### CORS errors
- Backend already has `app.use(cors())` which allows all origins
- No additional configuration needed

### Port binding issues
- Render provides PORT automatically via environment variable
- Server.js already uses `process.env.PORT || 5000`
- Should work correctly

## 📝 Next Steps

1. After backend is deployed, get your backend URL
2. Update Vercel environment variable:
   - In Vercel Dashboard → Environment Variables
   - Set `REACT_APP_API_URL` to: `https://your-backend.onrender.com/api`

## 🔗 Links

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs

