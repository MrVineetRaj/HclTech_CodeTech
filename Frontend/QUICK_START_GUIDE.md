# 🚀 MediTech Platform - Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Environment Setup (1 minute)

Create `Frontend/.env` file:

```env
VITE_API_URL=http://localhost:8080
```

### Step 2: Install Dependencies (2 minutes)

```bash
cd Frontend
npm install
```

### Step 3: Start Development Server (30 seconds)

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### Step 4: Access the Application (1 minute)

#### Option A: Login as Provider (Doctor)

1. Go to http://localhost:5173/login
2. Click "🏥 Provider" button
3. Enter provider credentials
4. Access provider dashboard

#### Option B: Login as Patient

1. Go to http://localhost:5173/login
2. Click "👤 Patient" button (default)
3. Enter patient credentials
4. Access patient dashboard

---

## 📱 What You Can Do

### As a Provider:

- ✅ View all patients
- ✅ Add medical conditions
- ✅ Assign health goals
- ✅ Send AI reminder calls
- ✅ Invite new patients

### As a Patient:

- ✅ View medications
- ✅ Track health goals
- ✅ See medical conditions
- ✅ Edit profile
- ✅ Mark goals complete

---

## 🔧 Backend Requirements

Make sure these services are running:

1. **Entry Server** (Port 8080)

   ```bash
   cd entry-server
   npm run dev
   ```

2. **Patient Services**

   ```bash
   cd services/patient-services
   npm run dev
   ```

3. **Admin Services**

   ```bash
   cd services/admin-services
   npm run dev
   ```

4. **MongoDB** - Should be running
5. **Redis** - Should be running (optional for caching)

---

## 🎯 Quick Test Checklist

### Provider Portal Test (2 minutes)

- [ ] Login as provider
- [ ] See patient list
- [ ] Click on a patient
- [ ] Add a medical condition
- [ ] Assign a goal
- [ ] Send AI call reminder
- [ ] Logout

### Patient Portal Test (2 minutes)

- [ ] Login as patient
- [ ] View dashboard stats
- [ ] Check medications
- [ ] View goals
- [ ] See medical conditions
- [ ] Edit profile
- [ ] Logout

---

## 🐛 Troubleshooting

### "Cannot connect to backend"

- Verify backend is running on port 8080
- Check `VITE_API_URL` in `.env` file
- Ensure CORS is enabled on backend

### "Login failed"

- Check backend logs for errors
- Verify MongoDB connection
- Ensure user exists in database
- Try provider signup endpoint first

### "Page not found"

- Clear browser cache
- Restart dev server
- Check routes.ts configuration

### "API returns 401"

- Check if JWT authentication is working
- Verify cookies are being sent
- Check backend auth middleware

---

## 📚 Page URLs Reference

### Public Pages

- Landing: `http://localhost:5173/`
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`

### Patient Pages

- Dashboard: `http://localhost:5173/patient/dashboard`
- Medications: `http://localhost:5173/patient/medications`
- Goals: `http://localhost:5173/patient/goals`
- Medical Conditions: `http://localhost:5173/patient/medical-conditions`
- Profile: `http://localhost:5173/patient/profile`

### Provider Pages

- Dashboard: `http://localhost:5173/provider/dashboard`
- Patient Detail: `http://localhost:5173/provider/patients/:id`
- Invite Patient: `http://localhost:5173/provider/patients/invite`
- Profile: `http://localhost:5173/provider/profile`

---

## 🔑 Test Account Creation

If you don't have test accounts, create them via backend:

### Create Provider Account

```bash
curl -X POST http://localhost:8080/api/v1/auth/signup/provider \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "doctor@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "address": "123 Medical St",
    "city": "New York",
    "state": "NY",
    "pincode": 10001,
    "country": "USA"
  }'
```

### Create Patient Account

```bash
curl -X POST http://localhost:8080/api/v1/auth/signup/patient \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Jane Doe",
    "email": "patient@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "address": "456 Patient Ave",
    "city": "New York",
    "state": "NY",
    "pincode": 10002,
    "country": "USA"
  }'
```

Or use the **Provider Portal's "Invite Patient"** feature after logging in as a provider!

---

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output will be in `dist/` folder.

---

## 🎨 Customization

### Change API URL

Edit `Frontend/.env`:

```env
VITE_API_URL=https://your-api-domain.com
```

### Change Colors

Edit `Frontend/app.css` or component classes using TailwindCSS utilities.

### Add Features

1. Create new route file in `app/routes/`
2. Add route in `app/routes.ts`
3. Create API functions in `app/lib/`
4. Use TypeScript types from `app/lib/types.ts`

---

## 📊 Performance Tips

- Use React DevTools to check re-renders
- Monitor Network tab for API calls
- Check Console for errors/warnings
- Test on mobile devices
- Verify all routes work without errors

---

## 🆘 Need Help?

1. **Check Documentation**:
   - `IMPLEMENTATION_COMPLETE.md` - Full feature docs
   - `FEATURES_SUMMARY.md` - Feature overview
   - `FRONTEND_SETUP.md` - Setup details

2. **Check Backend**:
   - Backend logs for API errors
   - MongoDB connection status
   - Redis connection status

3. **Check Frontend**:
   - Browser console for errors
   - Network tab for failed requests
   - React DevTools for state issues

---

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Can login as both provider and patient
- ✅ Provider sees patient list
- ✅ Patient sees dashboard with data
- ✅ Can add/edit medical conditions
- ✅ Can assign/complete goals
- ✅ No console errors
- ✅ All pages load correctly

---

## 🎉 You're Ready!

The MediTech Platform frontend is now running. Start exploring the provider and patient portals!

**Happy Coding! 🚀**
