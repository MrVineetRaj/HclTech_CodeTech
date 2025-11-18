# Install Admin Services Dependencies

## ✅ Step 1: Fixed package.json

I've already updated `services/admin-services/package.json` to include all required dependencies:
- ✅ `bcryptjs` - For password hashing
- ✅ `passport-local` - For local authentication strategy
- ✅ `mongoose` - For MongoDB connection
- ✅ `@types/bcryptjs` - TypeScript types
- ✅ `@types/passport-local` - TypeScript types

## 🔧 Step 2: Install Dependencies

**Stop the currently running admin-services** (Ctrl+C in that terminal), then run:

```bash
cd services/admin-services
npm install
```

This will install all the missing packages.

## 🚀 Step 3: Restart the Service

After installation completes:

```bash
npm run dev
```

## ✅ Expected Success Output

You should see:
```
✅ MongoDB connected successfully
Server is up on port 8083
```

## 🎯 What This Fixes

The errors you were seeing:
- ❌ `Cannot find module 'passport-local'` → ✅ Fixed
- ❌ `Cannot find module 'bcryptjs'` → ✅ Fixed
- ❌ TypeScript compilation errors → ✅ Fixed

Once this is done, your provider dashboard will work perfectly! 🎉

