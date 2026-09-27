import { createBrowserRouter } from "react-router";

// Loaders
import refreshTokenLoader from "@/routes/loaders/refreshToken";
import homeLoader from "@/routes/loaders/user/home";
import userBlogLoader from "@/routes/loaders/user/blogs";
import blogDetailLoader from "@/routes/loaders/user/blogDetail";
import profileLoader from "@/routes/loaders/user/profile";
import adminLoader from "@/routes/loaders/admin/admin";

// Pages
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import { RootLayout } from "@/components/layouts/Root";
import { Home } from "@/pages/user/Home";
import { Blogs } from "@/pages/user/Blogs";
import { BlogDetail } from "@/pages/user/BlogDetail";
import { Profile } from "@/pages/user/Profile";
import { AdminLayout } from "@/components/layouts/AdminLayout";

// Actions
import signupAction from "@/routes/actions/auth/signup";
import loginAction from "@/routes/actions/auth/login";
import settingsAction from "@/routes/actions/user/settings";

// Error boundries
import { RootErrorBoundary } from "@/pages/error/Root";

const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
    action: loginAction,
  },
  {
    path: '/signup',
    Component: Signup,
    action: signupAction,
  },
  {
    path: '/refresh-token',
    loader: refreshTokenLoader
  },
  {
    path: '/',
    Component: RootLayout,
    children:[
      {
        index: true,
        Component: Home,
        loader: homeLoader,
      },
      {
        path: 'blogs',
        Component: Blogs,
        loader: userBlogLoader,
      },
      {
        path: 'blogs/:slug',
        Component: BlogDetail,
        loader: blogDetailLoader,
      },
      {
        path: 'profile/:userId',
        Component: Profile,
        loader: profileLoader,
      },
    ]
  },
  {
    path: 'admin',
    Component: AdminLayout,
    loader: adminLoader,
    ErrorBoundary: RootErrorBoundary,
    children:[
      {
        path: 'dashboard',
        handle: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'blogs',
        handle: { breadcrumb: 'Blogs' },
      },
      {
        path: 'blogs/create',
        handle: { breadcrumb: 'Create a new blog' },
      },
      {
        path: 'blogs/:slug/edit',
        handle: { breadcrumb: 'Edit blog' },
      },
      {
        path: 'comments',
        handle: { breadcrumb: 'Comments' },
      },
      {
        path: 'users',
        handle: { breadcrumb: 'Users' },
      },
    ]
  },
  {
    path: '/settings',
    action: settingsAction,
  }
])

export default router;