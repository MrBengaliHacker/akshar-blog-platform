![Node.js](https://img.shields.io/badge/Node.js-Express.js-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)
![License](https://img.shields.io/badge/license-MIT-blue)

# Akshar Blog Platform

A modern MERN blog application featuring AI-powered writing assistance, secure authentication, role-based access control, and production-style REST API architecture.

🚀 **Backend Server**  
https://akshar-blog-platform.onrender.com

📡 **API Base URL**  
https://akshar-blog-platform.onrender.com/api/v1

📖 **Interactive Swagger API Documentation**  
https://akshar-blog-platform.onrender.com/api/v1/docs

💻 **GitHub Repository**  
https://github.com/MrBengaliHacker/akshar-blog-platform

---

## Demo Access

| Role | Email | Password |
|------|-------|----------|
| Admin | `demo@akshar.com` | `Demo@1234` |

> ⚠️ Destructive actions (delete, ban) are disabled in demo mode.  
> ⏳ Backend is hosted on Render free tier, so the first request may take around 50 seconds after inactivity.

---

## Tech Stack

**Backend**
- Node.js + Express.js v5
- MongoDB + Mongoose
- JWT (Access + Refresh Token)
- Bcrypt
- Winston (structured logging)
- Express Validator
- Helmet + CORS + Rate Limiting
- Cloudinary (image uploads)
- Google Gemini AI
- DOMPurify + JSDOM (XSS sanitization)
- Multer (file uploads)
- Swagger UI (API documentation)

**Frontend**
- React frontend currently in development

**DevOps**
- Render (backend hosting)
- Vercel (frontend hosting — coming soon)
- MongoDB Atlas

---

## Features

- JWT authentication with access/refresh token rotation
- Role-based access control (user / admin)
- AI-powered writing assistance using Google Gemini API
  - Improve, expand, summarize, generate title
  - Change tone (formal/casual)
  - Write full blog from topic
  - Free prompt
- httpOnly cookie for refresh token (XSS safe)
- Image upload and CDN delivery via Cloudinary (blog banners + avatars)
- Admin panel for user management and content moderation
- Ban/Unban user system
- Demo admin account with restricted actions
- Like and comment system
- Draft / Published post status
- Auto slug generation from title (SEO friendly URLs)
- Cookie-based view count tracking (prevents spam views)
- Pagination on all list endpoints
- Content sanitization with DOMPurify
- Structured logging with Winston
- Rate limiting (60 requests/min per IP)
- Helmet security headers
- Request size limiting (10kb)
- Graceful server shutdown
- Versioned REST API architecture (`/api/v1`)
- Interactive API documentation with Swagger UI
- 404 handler for undefined routes

---

## Project Structure

```bash
akshar-blog-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── index.js                    # Environment configuration and validation
│   │   │
│   │   ├── controllers/
│   │   │   └── v1/                         # Route controllers
│   │   │       ├── ai/
│   │   │       │   └── aiAssist.js
│   │   │       │
│   │   │       ├── auth/
│   │   │       │   ├── login.js
│   │   │       │   ├── logout.js
│   │   │       │   ├── refreshToken.js
│   │   │       │   └── register.js
│   │   │       │
│   │   │       ├── blog/
│   │   │       │   ├── createBlog.js
│   │   │       │   ├── deleteBlog.js
│   │   │       │   ├── getAllBlogs.js
│   │   │       │   ├── getBlogBySlug.js
│   │   │       │   ├── getBlogsByUser.js
│   │   │       │   └── updateBlog.js
│   │   │       │
│   │   │       ├── comment/
│   │   │       │   ├── commentBlog.js
│   │   │       │   ├── deleteComment.js
│   │   │       │   └── getCommentsByBlog.js
│   │   │       │
│   │   │       ├── like/
│   │   │       │   ├── likeBlog.js
│   │   │       │   └── unlikeBlog.js
│   │   │       │
│   │   │       └── user/
│   │   │           ├── banUser.js
│   │   │           ├── deleteCurrentUser.js
│   │   │           ├── deleteUser.js
│   │   │           ├── getAllUsers.js
│   │   │           ├── getCurrentUser.js
│   │   │           ├── getUser.js
│   │   │           └── updateCurrentUser.js
│   │   │
│   │   ├── lib/                            # External service integrations
│   │   │   ├── cloudinary.js
│   │   │   ├── gemini.js
│   │   │   ├── jwt.js
│   │   │   ├── logger.js
│   │   │   ├── mongoose.js
│   │   │   ├── rateLimit.js
│   │   │   └── swagger.js
│   │   │
│   │   ├── middlewares/                    # Custom middlewares
│   │   │   ├── authenticate.js
│   │   │   ├── authorize.js
│   │   │   ├── demoGuard.js
│   │   │   ├── incrementViewCount.js
│   │   │   ├── uploadAvatar.js
│   │   │   ├── uploadBlogBanner.js
│   │   │   └── validationError.js
│   │   │
│   │   ├── models/                         # Mongoose models
│   │   │   ├── blog.js
│   │   │   ├── comment.js
│   │   │   ├── like.js
│   │   │   ├── token.js
│   │   │   └── user.js
│   │   │
│   │   ├── routes/
│   │   │   └── v1/                         # API routes
│   │   │       ├── ai.js
│   │   │       ├── auth.js
│   │   │       ├── blog.js
│   │   │       ├── comment.js
│   │   │       ├── like.js
│   │   │       ├── user.js
│   │   │       └── index.js
│   │   │
│   │   ├── utils/                          # Helper utilities
│   │   │   └── index.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── LICENSE
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── frontend/                               # Coming soon

```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key
- Cloudinary account

### Clone the repo

```bash
git clone https://github.com/MrBengaliHacker/akshar-blog-platform.git
cd akshar-blog-platform
```

### Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```bash
npm run dev
```

**Test these URLs:**
```
http://localhost:3000/          → 404 handler (NotFound JSON)
http://localhost:3000/api/v1    → API health check
http://localhost:3000/api/v1/docs → Swagger UI
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login user |
| POST | `/api/v1/auth/refresh-token` | Public | Refresh access token |
| POST | `/api/v1/auth/logout` | Protected | Logout user |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users/current` | Protected | Get current user |
| PATCH | `/api/v1/users/current` | Protected | Update profile (avatar, bio, social links) |
| DELETE | `/api/v1/users/current` | Protected | Delete own account |
| GET | `/api/v1/users` | Admin | Get all users with pagination |
| GET | `/api/v1/users/:userId` | Admin | Get user by ID |
| PATCH | `/api/v1/users/:userId/ban` | Admin | Ban or unban user |
| DELETE | `/api/v1/users/:userId` | Admin | Delete user by ID |

### Blogs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/blogs` | Protected | Create blog with banner upload |
| GET | `/api/v1/blogs` | Protected | Get all blogs with pagination |
| GET | `/api/v1/blogs/user/:userId` | Protected | Get blogs by user |
| GET | `/api/v1/blogs/:slug` | Protected | Get blog by slug (increments view count) |
| PATCH | `/api/v1/blogs/:blogId` | Protected | Update blog (owner or admin) |
| DELETE | `/api/v1/blogs/:blogId` | Protected | Delete blog (owner or admin) |

### Likes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/likes/blog/:blogId` | Protected | Like a blog |
| DELETE | `/api/v1/likes/blog/:blogId` | Protected | Unlike a blog |

### Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/comments/blog/:blogId` | Protected | Add comment to blog |
| GET | `/api/v1/comments/blog/:blogId` | Protected | Get comments by blog |
| DELETE | `/api/v1/comments/:commentId` | Protected | Delete comment (owner or admin) |

### AI
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/ai/assist` | Protected | AI writing assistant |

#### AI Actions
| Action | Description |
|--------|-------------|
| `improve` | Fix grammar and improve writing quality |
| `continue` | Continue writing naturally |
| `summarize` | Summarize content in 2-3 sentences |
| `title` | Generate 5 SEO friendly title suggestions |
| `expand` | Expand text with more details |
| `tone_formal` | Rewrite in formal tone |
| `tone_casual` | Rewrite in casual tone |
| `fullBlog` | Write complete blog from topic |
| `freePrompt` | Free form AI writing prompt |

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `JWT_ACCESS_SECRET` | JWT access token secret | ✅ Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | ✅ Yes |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry | No (default: 15m) |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry | No (default: 7d) |
| `ADMIN_EMAILS` | Comma-separated admin emails | No |
| `DEMO_ADMIN_EMAIL` | Demo admin email for HR access | No |
| `GEMINI_API_KEY` | Google Gemini API key | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | No |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No |
| `WHITELIST_ORIGINS` | Comma-separated allowed origins | No |
| `LOG_LEVEL` | Winston log level | No (default: info) |

---

## Security

- Passwords hashed with Bcrypt (salt rounds: 10)
- Refresh token stored in httpOnly cookie (XSS safe)
- Refresh token stored in DB (revocable on logout)
- Refresh tokens auto-expire after 7 days (MongoDB TTL)
- Access token expires in 15 minutes
- Helmet security headers on all responses
- Rate limiting: 60 requests per minute per IP
- Request size limit: 10kb (prevents large payload attacks)
- CORS whitelist for allowed origins
- Password never returned in any API response
- Admin registration via email whitelist only
- Blog and comment content sanitized with DOMPurify (XSS prevention)
- Banned users blocked at middleware level
- Demo admin restricted from destructive actions
- Cookie-based view count (prevents spam)

---

## Author

**Ritam Mondal**  
GitHub: [@MrBengaliHacker](https://github.com/MrBengaliHacker)

---

## License

MIT © Ritam Mondal
