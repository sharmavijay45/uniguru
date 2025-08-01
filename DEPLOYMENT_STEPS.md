# Deployment Fix Steps

## 1. Frontend Deployment (Firebase)

```bash
# Navigate to frontend directory
cd "uniguru frontend"

# Install dependencies (if needed)
npm install

# Build the project with updated environment variables
npm run build

# Deploy to Firebase
firebase deploy
```

## 2. Backend Environment Variables (Render Dashboard)

Go to your Render dashboard and set these environment variables for your backend service:

### Required Environment Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uniguru?retryWrites=true&w=majority
JWT_SECRET=uniguru-super-secret-jwt-key-2024-production-ready
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRE=7
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-firebase-app.web.app
OLLAMA_NGROK_URL=https://449e35ca1138.ngrok-free.app/api/generate
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
SESSION_SECRET=uniguru-session-secret-2024-production
REQUIRE_API_KEY=false
API_KEY=your-api-key-here
```

### Critical Updates Needed:
1. **MONGODB_URI**: Replace with MongoDB Atlas connection string
2. **FRONTEND_URL**: Replace with your actual Firebase hosting URL
3. **GOOGLE_CLIENT_ID/SECRET**: Add real Google OAuth credentials
4. **NODE_ENV**: Set to "production"

## 3. Database Setup

If you haven't already, set up MongoDB Atlas:
1. Go to https://cloud.mongodb.com/
2. Create a new cluster
3. Create a database user
4. Get the connection string
5. Update MONGODB_URI in Render environment variables

## 4. CORS Configuration

Make sure your backend allows your Firebase frontend URL in CORS settings.

## 5. Testing Steps

After deployment:
1. Clear browser cache and cookies
2. Try logging in again
3. Check browser developer tools for any CORS errors
4. Verify the frontend is making requests to the correct backend URL

## 6. Common Issues

### 401 Unauthorized:
- Check if JWT_SECRET is set correctly in production
- Verify CORS is allowing your frontend domain
- Clear browser cookies and try fresh login

### CORS Errors:
- Update FRONTEND_URL in backend environment variables
- Make sure withCredentials is set to true in axios

### Database Connection:
- Verify MongoDB Atlas connection string
- Check if IP whitelist includes 0.0.0.0/0 for Render
