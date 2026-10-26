![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express.js-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)
![License](https://img.shields.io/badge/license-MIT-blue)

# Akshar Blog Platform

A full-stack MERN blog platform with a React frontend, an AI writing assistant, secure authentication, role-based access control and a versioned REST API.

🌐 **Live App**  
https://akshar-blog-platform.vercel.app

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

> 👀 The demo admin is **view-only**. You can open every admin page (dashboard, blogs, users, comments), but creating or editing blogs, deleting, banning and changing the profile are disabled.  
> ⏳ The backend runs on the Render free tier, so the first request may take around 50 seconds after a period of inactivity.  
> 🤖 The AI assistant works for the demo admin, with a small shared daily limit.

---

## Tech Stack

**Frontend**
- React 19 + TypeScript + Vite
- React Router v7 (data router with loaders and actions)
- Tailwind CSS v4 + shadcn/ui (Radix UI)
- Tiptap rich text editor
- React Hook Form + Zod (forms and validation)
- Axios (token header and automatic token refresh)
- TanStack Table, Motion, Sonner (toasts)

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

**DevOps**
- Vercel (frontend hosting)
- Render (backend hosting)
- MongoDB Atlas

---

## Features

**Reading and writing**
- Public blog list with pagination, blog pages with view count, likes and comments
- Rich text editor (Tiptap) with draft / published status
- Auto generated slugs (SEO friendly URLs)
- Public author profiles with avatar, bio and social links
- About and Contact pages, 404 page and friendly error pages

**AI writing assistant (Google Gemini)**
- Improve, expand, summarize, suggest titles, change tone (formal / casual), continue writing
- Write a full blog from a topic, or ask the AI anything
- Daily limit per user (default 3, admin 10) and a global daily cap, so one person cannot use up the quota
- AI is optional: without a Gemini key the rest of the app works

**Accounts**
- Register / login with JWT; the refresh token lives in an httpOnly cookie and the frontend refreshes the access token automatically
- Profile settings: name, username, email, photo, bio, social links
- Password change requires the current password and logs out the other devices
- Delete own account (removes the blogs, likes and images too)

**Admin panel**
- Dashboard with counts and recent activity
- Manage blogs (publish, unpublish, delete), users (ban, unban, delete) and comments
- Admin accounts are created from an email whitelist only
- Demo admin account with view-only access

**Platform**
- Draft blogs are visible only to the owner and admins
- One like per user and blog (unique index) with atomic counters
- Cookie-based view count (prevents spam views)
- Image upload and CDN delivery via Cloudinary (blog banners and avatars)
- Structured logging, graceful shutdown, versioned API (`/api/v1`), Swagger UI

---

## Project Structure

```bash
akshar-blog-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── index.js                    # Environment configuration and validation
│   │   ├── controllers/v1/
│   │   │   ├── ai/                         # aiAssist, getAiUsage
│   │   │   ├── auth/                       # register, login, logout, refreshToken
│   │   │   ├── blog/                       # create, update, delete, get all, by slug, by user
│   │   │   ├── comment/                    # add, delete, by blog, get all (admin)
│   │   │   ├── like/                       # like, unlike, like status
│   │   │   └── user/                       # current user, public profile, ban, delete, ...
│   │   ├── lib/
│   │   │   ├── aiUsage.js                  # Daily AI limits
│   │   │   ├── cloudinary.js
│   │   │   ├── cookies.js                  # Cookie options (cross-site safe in production)
│   │   │   ├── deleteUserData.js           # Deletes a user with blogs, likes, images
│   │   │   ├── gemini.js
│   │   │   ├── jwt.js
│   │   │   ├── logger.js
│   │   │   ├── mongoose.js
│   │   │   ├── rateLimit.js
│   │   │   └── swagger.js
│   │   ├── middlewares/
│   │   │   ├── authenticate.js
│   │   │   ├── authorize.js
│   │   │   ├── demoGuard.js
│   │   │   ├── incrementViewCount.js
│   │   │   ├── optionalAuthenticate.js     # Works for guests and logged in users
│   │   │   ├── uploadAvatar.js
│   │   │   ├── uploadBlogBanner.js
│   │   │   └── validationError.js
│   │   ├── models/                         # aiUsage, blog, comment, like, token, user
│   │   ├── routes/v1/                      # ai, auth, blog, comment, like, user, index
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                            # Axios client (token header and refresh)
│   │   ├── components/                     # App components (ui/ = shadcn/ui)
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/                          # admin, auth, error, user
│   │   ├── routes/                         # Route table, loaders and actions
│   │   ├── types/
│   │   └── main.tsx
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account (image uploads)
- Google Gemini API key (optional, for the AI assistant)

### Clone the repo

```bash
git clone https://github.com/MrBengaliHacker/akshar-blog-platform.git
cd akshar-blog-platform
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env     # fill in your values
npm run dev
```

**Test these URLs:**
```
http://localhost:3000/api/v1    → API health check
http://localhost:3000/api/v1/docs → Swagger UI
```

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3000/api/v1
npm run dev
```

Open http://localhost:5173. Make sure `http://localhost:5173` is allowed in `WHITELIST_ORIGINS` of the backend (in development all origins are allowed).

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login user (banned users are refused) |
| POST | `/api/v1/auth/refresh-token` | Public | Get a new access token (uses the refresh cookie) |
| POST | `/api/v1/auth/logout` | Protected | Logout user |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users/current` | Protected | Get current user |
| PATCH | `/api/v1/users/current` | Protected | Update profile (name, photo, bio, social links, password) |
| DELETE | `/api/v1/users/current` | Protected | Delete own account |
| GET | `/api/v1/users/profile/:userId` | Public | Public profile with published blogs |
| GET | `/api/v1/users` | Admin | Get all users with pagination |
| GET | `/api/v1/users/:userId` | Admin | Get user by ID |
| PATCH | `/api/v1/users/:userId/ban` | Admin | Ban or unban user |
| DELETE | `/api/v1/users/:userId` | Admin | Delete user by ID |

### Blogs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/blogs` | Protected | Create blog with banner upload |
| GET | `/api/v1/blogs` | Public | Published blogs with pagination (admin: `?includeDrafts=true`) |
| GET | `/api/v1/blogs/user/:userId` | Public | Blogs of a user (owner and admin also see drafts) |
| GET | `/api/v1/blogs/:slug` | Public | Blog by slug, increments the view count (drafts: owner or admin) |
| PATCH | `/api/v1/blogs/:blogId` | Protected | Update blog (owner or admin) |
| DELETE | `/api/v1/blogs/:blogId` | Protected | Delete blog with its comments and likes (owner or admin) |

### Likes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/likes/blog/:blogId` | Protected | Did I like this blog? |
| POST | `/api/v1/likes/blog/:blogId` | Protected | Like a blog |
| DELETE | `/api/v1/likes/blog/:blogId` | Protected | Unlike a blog |

### Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/comments` | Admin | Get all comments with pagination |
| POST | `/api/v1/comments/blog/:blogId` | Protected | Add comment to blog (plain text, max 1000 characters) |
| GET | `/api/v1/comments/blog/:blogId` | Public | Get comments by blog |
| DELETE | `/api/v1/comments/:commentId` | Protected | Delete comment (owner or admin) |

### AI
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/ai/assist` | Protected | AI writing assistant (daily limit) |
| GET | `/api/v1/ai/usage` | Protected | How many AI requests are left today |

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
| `fullBlog` | Write complete blog from topic (returns HTML) |
| `freePrompt` | Free form AI writing prompt |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment. Use `production` on Render (needed for cross-site cookies) | No (default: development) |
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `JWT_ACCESS_SECRET` | JWT access token secret | ✅ Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | ✅ Yes |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry | No (default: 15m) |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry | No (default: 7d) |
| `WHITELIST_ORIGINS` | Comma-separated allowed frontend URLs (add your Vercel URL) | In production |
| `ADMIN_EMAILS` | Comma-separated admin emails | No |
| `DEMO_ADMIN_EMAIL` | Demo admin email (view-only account) | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | For image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | For image uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | For image uploads |
| `GEMINI_API_KEY` | Google Gemini API key | No (AI is disabled without it) |
| `AI_DAILY_LIMIT` | AI requests per user per day | No (default: 3) |
| `AI_ADMIN_DAILY_LIMIT` | AI requests per admin per day | No (default: 10) |
| `AI_GLOBAL_DAILY_LIMIT` | AI requests per day for all users together | No (default: 50) |
| `LOG_LEVEL` | Winston log level | No (default: info) |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Base URL of the API, for example `http://localhost:3000/api/v1` | No (default: `http://localhost:3000/api/v1`) |

---

## Deployment

**Backend (Render)**
1. Create a Web Service from the `backend` folder (`npm install` / `npm start`).
2. Add the environment variables above. Set `NODE_ENV=production` and `WHITELIST_ORIGINS=http://localhost:5173,https://akshar-blog-platform.vercel.app` (no `/` at the end).

**Frontend (Vercel)**
1. Import the repository and set **Root Directory** to `frontend`.
2. Add the environment variable `VITE_API_URL=https://akshar-blog-platform.onrender.com/api/v1`.
3. `frontend/vercel.json` sends every address to `index.html`, so reloading a page like `/blogs/my-blog` works.

> In production the frontend and the backend are on different sites. The refresh cookie is therefore sent with `SameSite=None; Secure`. Browsers that block cross-site cookies (for example Safari) can log users out after 15 minutes. Putting both on the same domain solves it.

---

## Security

- Passwords hashed with Bcrypt (salt rounds: 10)
- Short-lived access token (15 minutes) and a refresh token in an httpOnly cookie (XSS safe)
- Refresh tokens are stored in the database (revocable) and expire after 7 days (MongoDB TTL)
- Banned and deleted users are blocked at login, token refresh and every request; banning removes all their sessions
- Changing the password needs the current password and logs out the other devices
- Draft blogs are visible only to the owner and admins
- Only the owner or an admin can replace a blog image (checked before the upload)
- Upload limits: blog banner 2MB, avatar 1MB
- Helmet security headers on all responses
- Rate limiting: 60 requests per minute per IP, and 10 AI requests per minute per IP
- Request size limit: 10kb (50kb for the AI route)
- CORS whitelist for allowed origins
- Password never returned in any API response
- Admin accounts only through an email whitelist
- Blog content sanitized with DOMPurify; comments are stored as plain text and shown as text
- One like per user and blog (unique index), counters updated atomically
- The demo admin is view-only (blog create/edit/delete, comment delete, ban, user delete and profile changes are blocked)
- Cookie-based view count (prevents spam)

---

## Author

**Ritam Mondal**  
GitHub: [@MrBengaliHacker](https://github.com/MrBengaliHacker)

---

## License

MIT © Ritam Mondal
