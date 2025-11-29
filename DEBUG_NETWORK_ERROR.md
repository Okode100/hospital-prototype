# Debugging Network Error - Patient Registration

## Issue
Frontend cannot register patients - getting network error even though:
- Backend is deployed and working: https://hospital-prototype-4.onrender.com
- Environment variable REACT_APP_API_URL is set in Vercel

## Possible Causes & Solutions

### 1. Environment Variable Not Loaded
**Check:**
- Open browser console on your Vercel-deployed frontend
- Type: `console.log(process.env.REACT_APP_API_URL)`
- Should show: `https://hospital-prototype-4.onrender.com/api`

**If undefined:**
- Go to Vercel Dashboard → Settings → Environment Variables
- Verify REACT_APP_API_URL is set to: `https://hospital-prototype-4.onrender.com/api`
- Make sure it's enabled for "Production" environment
- **Redeploy** after adding/changing environment variables

### 2. CORS Issue
**Check:**
- Open browser DevTools → Network tab
- Try to register a patient
- Look for CORS error in console

**Fix:**
- Backend already has `app.use(cors())` which should allow all origins
- If still having issues, check browser console for specific CORS error

### 3. API Endpoint Path
**Verify:**
- Frontend calls: `POST /api/patient`
- Backend route: `app.use('/api/patient', patientRoutes)`
- This should work correctly

### 4. Network Request Details
**Check in Browser:**
1. Open DevTools (F12)
2. Go to Network tab
3. Try to register a patient
4. Look for the failed request
5. Check:
   - Request URL (should be: https://hospital-prototype-4.onrender.com/api/patient)
   - Request Method (should be: POST)
   - Status Code (what error code?)
   - Response (what error message?)

### 5. Quick Test
**Test the API directly:**
```bash
curl -X POST https://hospital-prototype-4.onrender.com/api/patient \
  -H "Content-Type: application/json" \
  -d '{"serialNumber":"TEST-999","fullName":"Test User","dateOfBirth":"2000-01-01"}'
```

## Most Likely Fix
1. **Redeploy after setting environment variable** - Vercel needs a new build to include env vars
2. **Check browser console** for exact error message
3. **Verify the environment variable** is actually being used in the build

