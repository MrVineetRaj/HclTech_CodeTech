# Frontend Setup Instructions

## 1. Create Environment File

Create a `.env` file in the `Frontend` directory with the following content:

```env
VITE_API_URL=http://localhost:8080
```

## 2. Install Dependencies

```bash
cd Frontend
npm install
```

## 3. Install Axios (if not already installed)

```bash
npm install axios
```

## 4. Run the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 5. Test Login/Register

### Register a New Patient:
1. Go to `http://localhost:5173/register`
2. Fill in all required fields
3. Click "Create Account"
4. You'll be redirected to login

### Login:
1. Go to `http://localhost:5173/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the patient dashboard

## Important Notes

- **healthProviderId**: Currently hardcoded in register form as `000000000000000000000001`. 
  - You need to get a valid health provider ID from your seeded database
  - Update `app/routes/register.tsx` line 130 with the actual ID

- **Backend**: Make sure the backend is running on `http://localhost:8080`
- **CORS**: Backend should allow `http://localhost:5173` in VALID_ORIGINS

## Get Health Provider ID

Run this in MongoDB to get a valid health provider ID:

```javascript
db.healthproviders.findOne({}, { _id: 1 })
```

Then update the register form with this ID.

