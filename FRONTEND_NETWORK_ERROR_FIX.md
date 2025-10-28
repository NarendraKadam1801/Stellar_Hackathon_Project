# Frontend Network Error - Quick Fix

## Error
```
NetworkError when attempting to fetch resource.
Next.js version: 16.0.0 (Turbopack)
```

## Root Cause
The frontend server was started **before** the `.env.local` file was created, so it doesn't have the API URL environment variable.

---

## Quick Fix (3 Steps)

### Step 1: Stop Frontend Server

In the terminal running the frontend (the one showing "npm run dev"), press:
```
Ctrl + C
```

### Step 2: Clear Cache & Restart

Run the restart script:
```bash
cd frontend
./restart-frontend.sh
npm run dev
```

**OR manually:**
```bash
cd frontend
rm -rf .next
npm run dev
```

### Step 3: Clear Browser Cache

1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Hard refresh: `Ctrl + Shift + R`

---

## Verification

### 1. Check Environment Variable

Open browser console and type:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

**Should show:** `http://localhost:8000/api`

**If shows `undefined`:** Frontend wasn't restarted properly

### 2. Test API Connection

Visit: `http://localhost:3000/api-test`

**Should show:**
- Environment Variable: `http://localhost:8000/api`
- Posts API: Success with data
- Donations API: Success with data

**If shows errors:** Backend might not be running

### 3. Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for requests to `localhost:8000`

**Should see:**
- `http://localhost:8000/api/posts` - Status 200
- `http://localhost:8000/api/stats` - Status 200
- `http://localhost:8000/api/donations` - Status 200

---

## Alternative Fix (If Above Doesn't Work)

### Try IPv4 Address Instead of localhost

Some systems have IPv6 issues with `localhost`.

**Update `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Then restart frontend:
```bash
cd frontend
rm -rf .next
npm run dev
```

---

## Common Issues

### Issue 1: "Cannot GET /api-test"

**Solution:** The test page might not exist. Create it:

```bash
# File already created at: /frontend/app/api-test/page.tsx
# Just restart frontend
```

### Issue 2: Backend Not Running

**Check:**
```bash
curl http://localhost:8000/api/posts
```

**If fails:** Start backend:
```bash
cd server
npm run dev
```

### Issue 3: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## Step-by-Step Debugging

### 1. Verify Backend is Running

```bash
curl http://localhost:8000/api/health
```

**Expected:**
```json
{
  "success": true,
  "message": "AidBridge API is running"
}
```

### 2. Verify .env.local Exists

```bash
cd frontend
cat .env.local
```

**Expected:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Verify Frontend Process

```bash
ps aux | grep "next dev"
```

**Should show:** Running process

### 4. Test Direct API Call

```bash
curl http://localhost:8000/api/posts
```

**Should return:** JSON with posts data

---

## Complete Restart Procedure

If nothing works, do a complete restart:

### 1. Stop Everything

```bash
# Stop frontend (Ctrl+C in frontend terminal)
# Stop backend (Ctrl+C in backend terminal)

# Kill any remaining processes
pkill -f "next dev"
pkill -f "tsx src/index.ts"
```

### 2. Verify .env.local

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
```

### 3. Clear All Caches

```bash
cd frontend
rm -rf .next
rm -rf node_modules/.cache
```

### 4. Start Backend

```bash
cd server
npm run dev
```

**Wait for:** `✅ MongoDB connected successfully`

### 5. Start Frontend

```bash
cd frontend
npm run dev
```

**Wait for:** `✓ Ready in X.Xs`

### 6. Clear Browser

- Clear all browser cache
- Close all tabs
- Open new tab
- Visit `http://localhost:3000`

---

## What the Fix Does

### Before Fix
```
Frontend starts → No .env.local → API_BASE_URL = undefined
↓
Frontend tries to fetch from undefined URL
↓
NetworkError ❌
```

### After Fix
```
Create .env.local → NEXT_PUBLIC_API_URL=http://localhost:8000/api
↓
Restart frontend → Reads .env.local → API_BASE_URL = http://localhost:8000/api
↓
Frontend fetches from http://localhost:8000/api
↓
Success ✅
```

---

## Prevention

To prevent this in the future:

### 1. Always Create .env.local First

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev
```

### 2. Add to .gitignore

`.env.local` should already be in `.gitignore`:
```
.env.local
```

### 3. Create .env.example

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.example
```

Commit `.env.example` so others know what to create.

---

## Success Indicators

✅ **Backend running:** Terminal shows "Server is running on port 8000"
✅ **Frontend running:** Terminal shows "Ready in X.Xs"
✅ **Environment variable set:** Console shows API URL
✅ **API calls working:** Network tab shows 200 responses
✅ **No errors:** Console is clean

---

## Still Having Issues?

### Check Browser Console

Look for specific errors:
- `Failed to fetch` → Backend not running
- `CORS error` → Backend CORS misconfigured
- `404 Not Found` → Wrong API URL
- `NetworkError` → Frontend can't reach backend

### Check Backend Logs

Backend terminal should show:
```
2025-10-28T07:25:09.746Z - GET /api/posts
2025-10-28T07:25:09.780Z - GET /api/stats
```

If no logs → Frontend isn't reaching backend

### Check Firewall

```bash
# Allow port 8000
sudo ufw allow 8000

# Or disable firewall temporarily
sudo ufw disable
```

---

## Summary

**The fix is simple:**

1. **Stop frontend** (Ctrl+C)
2. **Clear cache** (`rm -rf .next`)
3. **Restart frontend** (`npm run dev`)
4. **Clear browser cache** (Ctrl+Shift+R)

**That's it!** The NetworkError should be gone. 🎉

---

## Quick Commands

```bash
# Complete fix in one go
cd frontend
pkill -f "next dev"
rm -rf .next
npm run dev

# Then in browser:
# Press F12 → Network tab → Check "Disable cache" → Ctrl+Shift+R
```
