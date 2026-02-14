# BlogApp Backend Server

A robust Express.js REST API server for a full-featured blogging application with user authentication, blog management, comments, likes, and admin controls.

## Features

- 🔐 JWT-based authentication with secure token generation
- 👤 User registration and login with bcrypt password hashing
- 📝 Complete blog CRUD operations
- 🏷️ Category management for organizing blogs
- 💬 Comments system for blog discussions
- 👍 Like/Unlike functionality for blogs and comments
- 👨‍💼 Admin dashboard and user management
- 🛡️ Role-based access control (User, Admin)
- 🚨 Comprehensive error handling and validation
- ⚡ Rate limiting for security
- 🔒 CORS security with Vercel support
- 📦 MongoDB integration with Mongoose
- 🍪 Cookie-based session support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: 
  - Helmet (security headers)
  - bcryptjs (password hashing)
  - express-rate-limit (rate limiting)
  - express-validator (input validation)
- **Utilities**: Cookie Parser, CORS, dotenv
- **Dev Tools**: Nodemon (development), eslint, TypeScript support

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Setup Steps

1. **Navigate to server directory**
   ```bash
   cd blogappbackend/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** with the following variables:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/blogapp
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   
   # Server Port
   PORT=5000
   
   # Frontend URL (for local development)
   CLIENT_URL=http://localhost:3000
   
   # Frontend Domain (for production)
   FRONTEND_DOMAIN=yourdomain.com
   
   # Node Environment
   NODE_ENV=development
   ```

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

## environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/blogapp` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-jwt-key-change-in-production` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `FRONTEND_DOMAIN` | Frontend domain for production | N/A |
| `NODE_ENV` | Environment mode | `development` |

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run server:dev
```

### Production Mode
```bash
npm run server
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user profile

### Blog Routes (`/api/blogs`)
- `GET /` - Get all blogs (with pagination)
- `GET /:id` - Get specific blog by ID
- `POST /` - Create new blog (authenticated)
- `PUT /:id` - Update blog (owner/admin only)
- `DELETE /:id` - Delete blog (owner/admin only)
- `GET /:id/comments` - Get comments for a blog

### Category Routes (`/api/categories`)
- `GET /` - Get all categories
- `POST /` - Create category (admin only)
- `PUT /:id` - Update category (admin only)
- `DELETE /:id` - Delete category (admin only)

### Comments Routes (`/api/comments`)
- `POST /` - Add comment to blog (authenticated)
- `PUT /:id` - Update comment (owner only)
- `DELETE /:id` - Delete comment (owner/admin only)

### Likes Routes (`/api/likes`)
- `POST /` - Like a blog or comment (authenticated)
- `DELETE /:id` - Unlike (owner only)
- `GET /:blogId` - Get likes for a blog

### Admin Routes (`/api/admin`)
- `GET /users` - Get all users (admin only)
- `GET /stats` - Get platform statistics (admin only)
- `DELETE /users/:id` - Delete user (admin only)


## Database Models

### User
```
- username (unique, required)
- email (unique, required)
- password (hashed)
- role (User, Admin)
- createdAt (timestamp)
```

### Blog
```
- title (required)
- content (required)
- author (User reference)
- category (Category reference)
- likes (count)
- comments (count)
- createdAt, updatedAt
```

### Category
```
- name (unique, required)
- description
- createdAt
```

### Comment
```
- text (required)
- author (User reference)
- blog (Blog reference)
- likes (count)
- createdAt, updatedAt
```

### Like
```
- user (User reference)
- blog/comment (target reference)
- createdAt
```

## Middleware

### Authentication (`middleware/auth.js`)
- Validates JWT tokens from headers or cookies
- Extracts and verifies user information
- Returns 401 for invalid/missing tokens

### Error Handler (`middleware/errorHandler.js`)
- Handles MongoDB validation errors
- Processes JWT errors
- Returns appropriate HTTP status codes
- Logs errors to console

### Role Check (`middleware/roleCheck.js`)
- Validates user role (Admin)
- Used for protected admin routes

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **CORS**: Configured for specific origins + Vercel support
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Sets security HTTP headers
- **Input Validation**: express-validator for request validation
- **Cookie Support**: Secure cookie parsing and handling

## Error Handling

The server returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad request / Validation error
- `401` - Unauthorized / Invalid token
- `403` - Forbidden / Insufficient permissions
- `404` - Not found
- `500` - Internal server error

## CORS Configuration

The server allows requests from:
- Local development: `http://localhost:3000`, `http://localhost:3001`
- Environment variable: `CLIENT_URL`
- Vercel deployments: All `.vercel.app` domains
- Production: Configured domain via `FRONTEND_DOMAIN`

## Deployment (Vercel)

1. **Set environment variables** in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel URL)
   - `FRONTEND_DOMAIN`
   - `NODE_ENV=production`

2. **Options for deployment**:
   - Deploy separately as a Vercel backend function
   - Use a dedicated hosting service (Railway, Render, Heroku)
   - Use serverless functions in Vercel

## Development Workflow

1. **Start development server**
   ```bash
   npm run server:dev
   ```

2. **Make changes** - Nodemon auto-reloads
3. **Test endpoints** using Postman/Thunder Client
4. **Check logs** in terminal for errors
5. **Commit and push** changes

## Troubleshooting

### CORS Error
- Ensure `CLIENT_URL` environment variable is set correctly
- For Vercel: includes `.vercel.app` in allowed origins
- Check browser console for exact origin being blocked

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Ensure MongoDB is running (for local)
- Check network access (for MongoDB Atlas)

### Token Invalid/Expired
- Clear localStorage and cookies
- Verify `JWT_SECRET` is same in frontend and backend
- Token expires after 7 days by default

### Rate Limit Exceeded
- Wait 15 minutes for limit to reset
- Adjust `windowMs` and `max` in `index.js` if needed

## API Testing

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```
