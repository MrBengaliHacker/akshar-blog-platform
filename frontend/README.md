# Akshar Blog Platform — Frontend

A modern, responsive blog platform frontend built with React, TypeScript, and Vite. It provides a rich blog-reading and writing experience, user authentication, profile management, an AI-powered writing assistant, and an admin dashboard.

**Live Demo:** [Akshar Blog Platform](https://akshar-blog-platform.vercel.app)

**Backend API:** [Akshar REST API](https://akshar-blog-platform.onrender.com/api/v1)

**API Documentation:** [Swagger UI](https://akshar-blog-platform.onrender.com/api/v1/docs)

**Main Project README:** [View full project documentation](../README.md)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## Features

- **Blog experience:** Browse published blogs, read individual posts, and explore author profiles.
- **Authentication:** Register and log in with JWT-based authentication.
- **Automatic token refresh:** Axios interceptors handle access-token refresh and retry eligible requests.
- **Rich text editing:** Create and edit blog content using the Tiptap editor.
- **AI writing assistant:** Access AI-powered writing tools through the backend API.
- **User profiles:** Manage profile information, avatars, biographies, and social links.
- **Admin dashboard:** Access administrative pages for managing platform content and users, subject to role permissions.
- **Form validation:** Use React Hook Form and Zod for form handling and validation.
- **Reusable UI:** Build consistent interfaces using shadcn/ui components.
- **Responsive interface:** Use a modern component-based UI designed for different screen sizes.

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript | Static typing |
| Vite | Development server and build tooling |
| React Router v7 | Routing, loaders, and actions |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Reusable UI components |
| Axios | HTTP requests and authentication interceptors |
| Tiptap | Rich text editor |
| React Hook Form | Form state management |
| Zod | Schema validation |
| TanStack Table | Data tables |
| Motion | UI animations |
| Sonner | Toast notifications |

## Getting Started

### Prerequisites

- Node.js compatible with the project's dependencies
- npm
- The Akshar backend running locally or a deployed backend API

### 1. Clone the repository

```bash
git clone https://github.com/MrBengaliHacker/akshar-blog-platform.git
cd akshar-blog-platform/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell, you can instead run:

```powershell
Copy-Item .env.example .env
```

Set the API URL in `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Make sure the backend is running at the configured address.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

| Variable | Description | Local development value |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API, including the `/api/v1` prefix | `http://localhost:3000/api/v1` |

For production, set `VITE_API_URL` to the deployed backend API URL:

```env
VITE_API_URL=https://akshar-blog-platform.onrender.com/api/v1
```

**Important:** Vite exposes variables prefixed with `VITE_` to client-side code. Never put private API keys, database credentials, or JWT secrets in frontend environment variables.

## Available Scripts

Run these commands from the `frontend` directory.

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Application Architecture

### Routing and data loading

The routing layer uses React Router v7.

- `src/routes/index.ts` — central route configuration.
- `src/routes/loaders/` — loads data required by routes.
- `src/routes/actions/` — handles route-associated mutations and submissions.

Loaders and actions help organize data fetching and form-related operations around the routing system.

### API client and authentication

The Axios client in `src/api/index.ts` centralizes communication with the backend.

Its responsibilities include:

- Sending requests to the configured API base URL.
- Attaching the access token where required.
- Attempting to refresh expired access tokens.
- Retrying eligible requests after successful token refresh.
- Handling failed refresh attempts through the application's authentication flow.

The refresh token is managed through the backend's HTTP-only cookie mechanism. The frontend must use the appropriate credential settings for the deployed backend.

### Role-based pages

The frontend separates regular user pages from administrative pages.

- **User dashboard:** Available to authenticated users.
- **Admin panel:** Restricted to users with the administrator role.

The backend remains responsible for enforcing authorization; hiding or protecting frontend routes alone is not a security boundary.

### Reusable components

The `src/components/` directory contains shared UI and application components. The `src/components/ui/` directory contains shadcn/ui components.

## Project Structure

```text
frontend/
├── public/                 # Public static assets, if present
├── src/
│   ├── api/                # Axios client and API integration
│   ├── components/         # Shared application and UI components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Reusable React hooks
│   ├── lib/                # Helpers and shared utilities
│   ├── pages/              # Page components
│   ├── routes/             # Route configuration, loaders, and actions
│   │   ├── loaders/
│   │   └── actions/
│   ├── types/              # Shared TypeScript types
│   └── main.tsx            # Application entry point
├── .env.example            # Environment variable template
├── vercel.json             # Vercel routing configuration
├── package.json            # Dependencies and scripts
└── README.md               # Frontend documentation
```

*Note: The tree describes the documented organization. Keep it aligned with the actual folders and files in your repository.*

## Deployment

The frontend is deployed on Vercel.

### Deploy with Vercel

1. Import the Akshar GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Configure the production environment variable:

   ```env
   VITE_API_URL=https://akshar-blog-platform.onrender.com/api/v1
   ```

4. Deploy the application.
5. Verify that the frontend can communicate with the backend and that the backend's CORS configuration allows the deployed frontend origin.

The `vercel.json` configuration supports client-side route handling so that refreshing a nested frontend URL can serve the application correctly.

### Production links

- **Frontend:** https://akshar-blog-platform.vercel.app
- **Backend API:** https://akshar-blog-platform.onrender.com/api/v1
- **API documentation:** https://akshar-blog-platform.onrender.com/api/v1/docs

---

For backend configuration, API endpoints, security details, and full-stack setup instructions, see the [main project README](../README.md).
