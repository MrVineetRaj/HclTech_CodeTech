# JWT Cookie Authentication Setup

## Overview
The entry server now supports JWT-based authentication via HTTP-only cookies, in addition to the existing session-based authentication. This provides a more secure and scalable authentication mechanism.

## What Was Implemented

### 1. JWT Utility Functions (`src/app/lib/jwt.ts`)
- `generateToken()` - Creates JWT tokens with user ID and user type
- `verifyToken()` - Verifies and decodes JWT tokens
- `getTokenFromCookie()` - Helper to extract tokens from cookie headers

### 2. Environment Configuration
Added new required environment variables:
- `JWT_SECRET` - Secret key for signing JWT tokens (required)
- `JWT_EXPIRES_IN` - Token expiration time (defaults to "7d" if not provided)

### 3. Login Endpoints Updated
Both `/api/v1/auth/login/patient` and `/api/v1/auth/login/provider` now:
- Generate JWT tokens upon successful authentication
- Set JWT tokens as HTTP-only cookies named `authToken`
- Cookies are secure in production, with SameSite protection

### 4. Authentication Middleware Enhanced
The `isAuthenticated` middleware now:
- First checks session-based authentication (Passport) for backward compatibility
- Falls back to JWT cookie verification if session is not found
- Attaches user info to `req.user` for consistency

### 5. Logout Updated
The logout endpoint now clears the JWT cookie in addition to destroying the session.

## Required Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters-recommended
JWT_EXPIRES_IN=7d  # Optional, defaults to 7 days
```

**Important**: Generate a strong, random secret for `JWT_SECRET`. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Cookie Configuration

JWT cookies are configured with:
- **httpOnly**: `true` - Prevents JavaScript access (XSS protection)
- **secure**: `true` in production - Only sent over HTTPS
- **sameSite**: `lax` - CSRF protection
- **maxAge**: 7 days (604800000 ms)
- **path**: `/` - Available for all routes

## How It Works

1. **Login Flow**:
   - User authenticates via Passport (username/password)
   - On success, a JWT token is generated with user ID and type
   - Token is set as an HTTP-only cookie
   - Response includes user data

2. **Authentication Flow**:
   - Middleware first checks if user has a valid session
   - If no session, checks for `authToken` cookie
   - Verifies JWT token signature and expiration
   - Attaches user info to request if valid

3. **Logout Flow**:
   - Destroys session (if exists)
   - Clears `authToken` cookie
   - Returns success response

## Testing

### Test Login (Patient)
```bash
curl -X POST http://localhost:3000/api/v1/auth/login/patient \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"password123"}' \
  -c cookies.txt
```

### Test Authenticated Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -b cookies.txt
```

### Test Logout
```bash
curl -X GET http://localhost:3000/api/v1/auth/logout \
  -b cookies.txt
```

## Benefits

1. **Security**: HTTP-only cookies prevent XSS attacks
2. **Scalability**: JWT tokens are stateless, no server-side session storage needed
3. **Compatibility**: Works alongside existing session-based auth
4. **Flexibility**: Can be used for API clients and web browsers

## Notes

- The implementation maintains backward compatibility with session-based authentication
- JWT tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)
- Cookies are automatically sent by browsers on subsequent requests
- The middleware checks both authentication methods for maximum compatibility

