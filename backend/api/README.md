# API - NRSgirls Backend

## Overview
RESTful API server for the NRSgirls platform, handling all backend operations including authentication, data management, streaming, and payment processing.

## Technology Stack
- **Runtime**: Node.js 18+ or Python 3.10+
- **Framework**: Express.js (Node) or FastAPI (Python)
- **Database**: PostgreSQL (primary), MongoDB (media metadata)
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 or compatible
- **Search**: Elasticsearch (optional)
- **Queue**: Bull (Node) or Celery (Python) for background jobs

## Architecture

### Microservices Structure
- **Auth Service**: Authentication and authorization
- **User Service**: User profile management
- **Media Service**: File upload and management
- **Streaming Service**: Live stream management
- **Payment Service**: Transaction processing
- **Notification Service**: Email and push notifications
- **Analytics Service**: Data aggregation and reporting

### API Design Principles
- RESTful conventions
- Versioned endpoints (`/api/v1/`)
- JSON request/response format
- Standardized error responses
- Rate limiting
- Request validation
- CORS configuration

## API Endpoints

### Authentication Endpoints

#### `POST /api/v1/auth/register`
Register a new user
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "role": "dj|performer|viewer",
  "username": "username"
}

Response:
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "dj"
  },
  "message": "Registration successful. Please verify your email."
}
```

#### `POST /api/v1/auth/login`
User login
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "dj"
    }
  }
}
```

#### `POST /api/v1/auth/logout`
User logout (invalidate tokens)

#### `POST /api/v1/auth/refresh`
Refresh access token

#### `POST /api/v1/auth/reset-password`
Request password reset

#### `GET /api/v1/auth/verify-email/:token`
Verify email address

#### `POST /api/v1/auth/2fa/enable`
Enable two-factor authentication

#### `POST /api/v1/auth/2fa/verify`
Verify 2FA code

### DJ Endpoints

#### `GET /api/v1/dj/profile/:id`
Get DJ profile
```json
Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "stageName": "DJ Name",
    "bio": "Bio text",
    "genres": ["house", "techno"],
    "avatarUrl": "https://cdn.example.com/avatar.jpg",
    "rating": 4.8,
    "followers": 1234,
    "totalEarnings": 5000
  }
}
```

#### `PUT /api/v1/dj/profile`
Update DJ profile

#### `POST /api/v1/dj/upload-track`
Upload music track
- Multipart form data
- File validation
- Virus scanning
- Metadata extraction

#### `GET /api/v1/dj/tracks`
Get DJ's track library
- Pagination support
- Search and filter
- Sort options

#### `DELETE /api/v1/dj/track/:id`
Delete a track

#### `POST /api/v1/dj/start-stream`
Start live streaming session

#### `POST /api/v1/dj/end-stream`
End streaming session

#### `GET /api/v1/dj/analytics`
Get DJ analytics data
- Query parameters for date range
- Aggregated statistics

#### `GET /api/v1/dj/earnings`
Get earnings data
- Pagination
- Date filtering
- Export options

### Performer Endpoints

#### `GET /api/v1/performer/profile/:id`
Get performer profile

#### `PUT /api/v1/performer/profile`
Update performer profile

#### `PUT /api/v1/performer/privacy-settings`
Update privacy settings
```json
Request:
{
  "blockedCountries": ["US-CA", "US-TX"],
  "allowRecording": false,
  "showViewerList": false,
  "anonymousMode": true
}
```

#### `POST /api/v1/performer/block-user`
Block a user

#### `GET /api/v1/performer/blocked-users`
Get list of blocked users

#### `POST /api/v1/performer/start-stream`
Start streaming session

#### `POST /api/v1/performer/end-stream`
End streaming session

#### `GET /api/v1/performer/analytics`
Get performer analytics

### Streaming Endpoints

#### `GET /api/v1/stream/live`
Get all live streams
```json
Response:
{
  "success": true,
  "data": {
    "streams": [
      {
        "id": "uuid",
        "creatorId": "uuid",
        "creatorType": "dj",
        "title": "Stream Title",
        "viewerCount": 123,
        "startTime": "2024-01-01T00:00:00Z",
        "thumbnailUrl": "https://cdn.example.com/thumb.jpg"
      }
    ],
    "total": 50,
    "page": 1,
    "perPage": 20
  }
}
```

#### `GET /api/v1/stream/:id`
Get stream details

#### `POST /api/v1/stream/:id/join`
Join a stream (viewer)

#### `POST /api/v1/stream/:id/leave`
Leave a stream

#### `GET /api/v1/stream/:id/viewers`
Get current viewers

#### `POST /api/v1/stream/chat/message`
Send chat message

#### `GET /api/v1/stream/chat/:streamId`
Get chat messages
- WebSocket alternative available
- Pagination for history

### Payment Endpoints

#### `POST /api/v1/payment/tip`
Send tip to creator

#### `POST /api/v1/payment/subscribe`
Subscribe to creator

#### `POST /api/v1/payment/unsubscribe`
Cancel subscription

#### `GET /api/v1/payment/transactions`
Get transaction history

#### `GET /api/v1/payment/balance`
Get account balance

#### `POST /api/v1/payment/payout`
Request payout

#### `GET /api/v1/payment/payout-history`
Get payout history

### User Endpoints

#### `GET /api/v1/user/profile`
Get current user profile

#### `PUT /api/v1/user/profile`
Update user profile

#### `POST /api/v1/user/avatar`
Upload avatar image

#### `GET /api/v1/user/notifications`
Get user notifications

#### `PUT /api/v1/user/notifications/:id/read`
Mark notification as read

#### `GET /api/v1/user/settings`
Get user settings

#### `PUT /api/v1/user/settings`
Update user settings

### Admin Endpoints

#### `GET /api/v1/admin/users`
List all users (admin only)

#### `PUT /api/v1/admin/user/:id/status`
Update user status (ban/unban)

#### `GET /api/v1/admin/reports`
Get user reports

#### `PUT /api/v1/admin/report/:id/resolve`
Resolve a report

#### `GET /api/v1/admin/analytics`
Platform-wide analytics

## Request/Response Format

### Standard Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional error details */ }
  }
}
```

### Pagination Format
```json
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "pagination": {
      "total": 100,
      "page": 1,
      "perPage": 20,
      "totalPages": 5
    }
  }
}
```

## Authentication

### JWT Token Structure
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "dj",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Authorization Header
```
Authorization: Bearer <jwt-token>
```

### Refresh Token Flow
1. Access token expires (15 minutes)
2. Client sends refresh token
3. Server validates refresh token
4. Server issues new access token
5. Client continues with new token

## Middleware

### Authentication Middleware
- Validates JWT tokens
- Extracts user information
- Handles expired tokens

### Authorization Middleware
- Role-based access control
- Resource ownership verification
- Permission checking

### Validation Middleware
- Request body validation
- Query parameter validation
- File upload validation

### Rate Limiting Middleware
- Per-endpoint rate limits
- Per-user rate limits
- IP-based rate limits

### Error Handling Middleware
- Global error catching
- Error formatting
- Logging

### CORS Middleware
- Origin whitelisting
- Credentials support
- Preflight handling

### Logging Middleware
- Request logging
- Response logging
- Performance metrics

## Database Models

### User Model
```javascript
{
  id: UUID,
  email: String (unique),
  passwordHash: String,
  role: Enum ['dj', 'performer', 'viewer', 'admin'],
  verified: Boolean,
  twoFactorEnabled: Boolean,
  twoFactorSecret: String (encrypted),
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLogin: Timestamp
}
```

### DJ Profile Model
```javascript
{
  id: UUID,
  userId: UUID (foreign key),
  stageName: String,
  bio: Text,
  genres: Array,
  avatarUrl: String,
  rating: Decimal,
  totalEarnings: Decimal,
  followerCount: Integer,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Performer Profile Model
```javascript
{
  id: UUID,
  userId: UUID (foreign key),
  stageName: String,
  bio: Text,
  avatarUrl: String,
  privacySettings: JSON,
  blockedRegions: Array,
  totalEarnings: Decimal,
  followerCount: Integer,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Track Model
```javascript
{
  id: UUID,
  djId: UUID (foreign key),
  title: String,
  fileUrl: String,
  fileSize: BigInt,
  duration: Integer,
  metadata: JSON,
  scanned: Boolean,
  scanResults: JSON,
  uploadDate: Timestamp
}
```

### Stream Model
```javascript
{
  id: UUID,
  creatorId: UUID (foreign key),
  creatorType: Enum ['dj', 'performer'],
  title: String,
  description: Text,
  thumbnailUrl: String,
  startTime: Timestamp,
  endTime: Timestamp,
  viewerCount: Integer,
  peakViewers: Integer,
  status: Enum ['scheduled', 'live', 'ended'],
  recordingUrl: String,
  earnings: Decimal
}
```

## File Structure
```
api/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── dj.controller.js
│   │   ├── performer.controller.js
│   │   ├── stream.controller.js
│   │   ├── payment.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── djProfile.model.js
│   │   ├── performerProfile.model.js
│   │   ├── track.model.js
│   │   └── stream.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── dj.routes.js
│   │   ├── performer.routes.js
│   │   ├── stream.routes.js
│   │   ├── payment.routes.js
│   │   └── user.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── error.middleware.js
│   │   └── cors.middleware.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── upload.service.js
│   │   ├── payment.service.js
│   │   └── analytics.service.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── validation.js
│   │   ├── encryption.js
│   │   └── logger.js
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── aws.js
│   │   └── app.js
│   └── app.js
├── tests/
├── package.json
└── README.md
```

## Environment Variables
```bash
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/nrsgirls
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=nrsgirls-media

# Payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@nrsgirls.com
SMTP_PASS=your-password

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://nrsgirls.com
```

## Development

### Setup
```bash
# Install dependencies
npm install

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### API Documentation
- Swagger/OpenAPI documentation available at `/api/docs`
- Postman collection provided
- Interactive API explorer

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t nrsgirls-api .
docker run -p 3000:3000 nrsgirls-api
```

### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

## Monitoring
- Error tracking with Sentry
- Performance monitoring with New Relic
- Log aggregation with CloudWatch
- Uptime monitoring with Pingdom

## Security
- HTTPS only
- Rate limiting
- SQL injection prevention
- XSS protection
- CSRF protection
- Input sanitization
- Password hashing (bcrypt)
- Token encryption
- Regular security audits
