# Akshar Blog Platform — Backend

The backend REST API for **Akshar Blog Platform**, a full-stack MERN blogging application. Built with Node.js and Express 5, it provides secure authentication, blog and comment management, role-based authorization, image uploads, and an AI-powered writing assistant.

## API Links

- **Live Application:** [Akshar Blog Platform](https://akshar-blog-platform.vercel.app)
- **Production API:** [REST API Base URL](https://akshar-blog-platform.onrender.com/api/v1)
- **Interactive API Documentation:** [Swagger UI](https://akshar-blog-platform.onrender.com/api/v1/docs)
- **Main Project README:** [Full project documentation](../README.md)

> **Note:** The backend is hosted on Render's free tier. After a period of inactivity, the first request may take around 50 seconds while the service starts.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Security](#security)
- [AI Writing Assistant](#ai-writing-assistant)
- [Deployment](#deployment)
- [License](#license)

## Features

### Authentication and authorization

- User registration and login using JSON Web Tokens (JWT).
- Short-lived access tokens and refresh tokens stored in HTTP-only cookies.
- Refresh-token rotation and database-backed token revocation.
- Role-based access control for users and administrators.
- Account banning, session invalidation, and protected account operations.
- Admin account creation controlled by an email whitelist.

### Blog management

- Create, update, publish, unpublish, and delete blog posts.
- Automatically generated, SEO-friendly slugs.
- Draft and published blog statuses.
- Owner and administrator access to draft content.
- Paginated blog listings.
- Blog likes, comments, and view-count tracking.
- Image uploads for blog banners.

### User and comment management

- Public author profiles with biographies, avatars, social links, and published blogs.
- Profile updates and password changes.
- Account deletion with associated blogs, likes, and images removed.
- Comment creation, listing, and deletion.
- Administrative user and comment management.

### AI writing assistant

- Improve grammar, continue writing, summarize, and expand content.
- Generate title suggestions and rewrite text in formal or casual tones.
- Generate complete blog drafts and respond to custom writing prompts.
- Per-user daily limits and a shared global daily limit.
- Optional Gemini integration; the rest of the application can operate without an AI API key.

### Infrastructure and observability

- Versioned REST API under `/api/v1`.
- Swagger UI documentation.
- Structured logging with Winston.
- Request validation and centralized error handling.
- Security headers, CORS configuration, and rate limiting.
- MongoDB integration through Mongoose.
- Image storage and CDN delivery through Cloudinary.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 5 | HTTP server and REST API |
| MongoDB | Database |
| Mongoose | Database models and queries |
| JSON Web Tokens | Access-token authentication |
| Bcrypt | Password hashing |
| Express Validator | Request validation |
| Helmet | HTTP security headers |
| CORS | Cross-origin request configuration |
| Rate limiting | Request throttling |
| Cloudinary | Image storage and delivery |
| Multer | Multipart file uploads |
| Google Gemini | AI writing assistance |
| DOMPurify + JSDOM | HTML sanitization |
| Winston | Application logging |
| Swagger UI | Interactive API documentation |

## Getting Started

### Prerequisites

- Node.js v18 or later
- npm
- A MongoDB Atlas account or another configured MongoDB instance
- A Cloudinary account for image uploads
- A Google Gemini API key for AI functionality (optional)

### 1. Clone the repository

```bash
git clone https://github.com/MrBengaliHacker/akshar-blog-platform.git
cd akshar-blog-platform/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the required values. See [Environment Variables](#environment-variables) for the full list.

### 4. Start the development server

```bash
npm run dev
```

The local API uses port `3000` by default.

### 5. Verify the API

Once the server is running, open:

- **API base:** http://localhost:3000/api/v1
- **Swagger UI:** http://localhost:3000/api/v1/docs

Use Swagger UI to inspect available endpoints, review request parameters, and test API operations.

## Environment Variables

Configure these values in `backend/.env`. Never commit your actual `.env` file or expose secret values in public repositories.

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port; defaults to `3000` | No |
| `NODE_ENV` | Runtime environment; use `production` for deployment | No |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens | Yes |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens | Yes |
| `ACCESS_TOKEN_EXPIRY` | Access-token lifetime; defaults to `15m` | No |
| `REFRESH_TOKEN_EXPIRY` | Refresh-token lifetime; defaults to `7d` | No |
| `WHITELIST_ORIGINS` | Comma-separated list of permitted frontend origins | Production |
| `ADMIN_EMAILS` | Comma-separated administrator email addresses | No |
| `DEMO_ADMIN_EMAIL` | Email address configured for the view-only demo administrator | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | For image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | For image uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | For image uploads |
| `GEMINI_API_KEY` | Google Gemini API key | Optional |
| `AI_DAILY_LIMIT` | Daily AI request limit per regular user; defaults to `3` | No |
| `AI_ADMIN_DAILY_LIMIT` | Daily AI request limit per administrator; defaults to `10` | No |
| `AI_GLOBAL_DAILY_LIMIT` | Global daily AI request limit; defaults to `50` | No |
| `LOG_LEVEL` | Winston logging level; defaults to `info` | No |

### Example local configuration

```env
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

WHITELIST_ORIGINS=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key

AI_DAILY_LIMIT=3
AI_ADMIN_DAILY_LIMIT=10
AI_GLOBAL_DAILY_LIMIT=50

LOG_LEVEL=info
```

Replace placeholder values with your own configuration. The Cloudinary and Gemini variables can be omitted when those integrations are not needed, subject to the application's configuration validation.

**Production configuration:** Set `NODE_ENV=production` and configure `WHITELIST_ORIGINS` with the exact deployed frontend origin. Do not add a trailing slash to the origin.

## API Overview

All endpoints use the `/api/v1` prefix.

For complete request schemas, response details, authentication requirements, and error responses, use the [interactive Swagger documentation](https://akshar-blog-platform.onrender.com/api/v1/docs).

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a user |
| `POST` | `/auth/login` | Public | Authenticate a user |
| `POST` | `/auth/refresh-token` | Cookie-based | Refresh the access token |
| `POST` | `/auth/logout` | Protected | Log out the user |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users/current` | Protected | Get the current user |
| `PATCH` | `/users/current` | Protected | Update profile or password |
| `DELETE` | `/users/current` | Protected | Delete the current account |
| `GET` | `/users/profile/:userId` | Public | Get a public profile and published blogs |
| `GET` | `/users` | Admin | List users with pagination |
| `GET` | `/users/:userId` | Admin | Get a user by ID |
| `PATCH` | `/users/:userId/ban` | Admin | Ban or unban a user |
| `DELETE` | `/users/:userId` | Admin | Delete a user |

### Blogs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/blogs` | Protected | Create a blog with banner upload |
| `GET` | `/blogs` | Public | List published blogs with pagination |
| `GET` | `/blogs/user/:userId` | Public | List a user's blogs |
| `GET` | `/blogs/:slug` | Public | Get a blog by slug |
| `PATCH` | `/blogs/:blogId` | Protected | Update a blog |
| `DELETE` | `/blogs/:blogId` | Protected | Delete a blog |

The owner and administrators can access eligible drafts when authenticated. Administrators can request drafts in the main listing using `?includeDrafts=true`.

### Likes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/likes/blog/:blogId` | Protected | Check the current user's like status |
| `POST` | `/likes/blog/:blogId` | Protected | Like a blog |
| `DELETE` | `/likes/blog/:blogId` | Protected | Unlike a blog |

### Comments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/comments` | Admin | List comments with pagination |
| `POST` | `/comments/blog/:blogId` | Protected | Add a comment |
| `GET` | `/comments/blog/:blogId` | Public | List comments for a blog |
| `DELETE` | `/comments/:commentId` | Protected | Delete a comment as its owner or an admin |

Comment content is plain text and is limited to 1,000 characters.

### AI writing assistant

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/ai/assist` | Protected | Request AI writing assistance |
| `GET` | `/ai/usage` | Protected | Check today's AI usage |

Supported AI actions include:

- `improve` — improve grammar and writing quality.
- `continue` — continue a piece of writing.
- `summarize` — summarize content.
- `title` — suggest SEO-friendly titles.
- `expand` — expand text with more detail.
- `tone_formal` — rewrite in a formal tone.
- `tone_casual` — rewrite in a casual tone.
- `fullBlog` — generate a complete blog from a topic.
- `freePrompt` — process a custom writing prompt.

The AI service is optional. Requests are subject to per-user and global daily limits.

## Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── index.js              # Environment configuration and validation
│   ├── controllers/
│   │   └── v1/
│   │       ├── ai/               # AI assistance and usage
│   │       ├── auth/             # Registration, login, logout, refresh
│   │       ├── blog/             # Blog operations
│   │       ├── comment/          # Comment operations
│   │       ├── like/             # Like operations
│   │       └── user/             # User and profile operations
│   ├── lib/                      # Shared integrations and utilities
│   │   ├── aiUsage.js             # Daily AI limits
│   │   ├── cloudinary.js          # Cloudinary integration
│   │   ├── cookies.js             # Cookie configuration
│   │   ├── deleteUserData.js      # Related user-data cleanup
│   │   ├── gemini.js              # Gemini integration
│   │   ├── jwt.js                 # JWT utilities
│   │   ├── logger.js              # Winston logger
│   │   ├── mongoose.js            # Database connection
│   │   ├── rateLimit.js           # Rate-limit configuration
│   │   └── swagger.js             # API documentation
│   ├── middlewares/               # Authentication, authorization, validation
│   ├── models/                    # Mongoose models
│   ├── routes/
│   │   └── v1/                    # Versioned API routes
│   ├── utils/                     # Shared utility functions
│   └── server.js                  # Server entry point
├── .env.example
└── package.json
```

The tree summarizes the backend organization. Refer to the actual repository for the complete list of files and subdirectories.

## Architecture

The backend follows a modular Express architecture.

- **Routes:** Define API endpoints and attach middleware.
- **Controllers:** Handle incoming requests and generate responses.
- **Models:** Represent application data and interact with MongoDB through Mongoose.
- **Middleware:** Handles authentication, authorization, upload processing, validation errors, and view-count tracking.
- **Libraries and utilities:** Encapsulate shared integrations, token utilities, logging, AI usage tracking, and database configuration.
- **API versioning:** Routes are grouped under `/api/v1` to establish a versioned API boundary.

This separation keeps request handling, business logic, data access, and shared infrastructure organized.

## Security

Security controls implemented in the project include:

- Password hashing using Bcrypt with 10 salt rounds.
- Short-lived access tokens and refresh tokens stored in HTTP-only cookies.
- Database-backed refresh-token revocation and expiration.
- Authentication and authorization checks for protected operations.
- Blocking banned and deleted users during login, refresh, and protected requests.
- Helmet security headers and configured CORS restrictions.
- Rate limiting of 60 requests per minute per IP and a separate limit of 10 AI requests per minute per IP.
- Request-body size limits of 10 KB, with a larger limit for the AI route.
- Input validation and HTML sanitization with DOMPurify and JSDOM.
- Plain-text comment storage and rendering.
- Upload limits of 2 MB for blog banners and 1 MB for avatars.
- Ownership checks for blog modifications and protected administrative operations.
- A view-only demo administrator with sensitive operations disabled.

The backend is responsible for enforcing permissions; frontend route restrictions are not a substitute for server-side authorization.

## AI Writing Assistant

The AI writing assistant uses Google Gemini for supported writing operations.

### Usage limits

| User type | Default daily limit |
|---|---:|
| Regular user | 3 requests |
| Administrator | 10 requests |
| All users combined | 50 requests |

These values can be changed through environment variables. Requests may also be subject to the AI endpoint's rate limit. The AI feature can be disabled by omitting the Gemini API key, while the rest of the platform remains available.

Use `GET /api/v1/ai/usage` to retrieve the authenticated user's current daily usage.

## Deployment

The backend is deployed as a Web Service on Render.

### Deploy to Render

1. Connect your GitHub repository to Render.
2. Create a **Web Service** and set the root directory to `backend`.
3. Configure the build/install command as:

   ```bash
   npm install
   ```

4. Configure the start command as:

   ```bash
   npm start
   ```

5. Add the required production environment variables in the Render dashboard.
6. Set `NODE_ENV=production`.
7. Configure `WHITELIST_ORIGINS` with the production frontend origin:

   ```env
   WHITELIST_ORIGINS=https://akshar-blog-platform.vercel.app
   ```

8. Deploy and verify the service using the API base URL and Swagger UI.

Make sure MongoDB Atlas network access, Cloudinary credentials, JWT secrets, and any optional Gemini configuration are set correctly.

### Production endpoints

- **API base:** https://akshar-blog-platform.onrender.com/api/v1
- **Swagger UI:** https://akshar-blog-platform.onrender.com/api/v1/docs

### Cross-site cookies

The frontend and backend are hosted on different sites. In production, refresh-token cookies require cross-site cookie settings such as `SameSite=None; Secure`. Browser privacy settings that block third-party cookies may affect refresh-token behavior.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

For the frontend setup and the complete full-stack overview, see the [main project README](../README.md).
