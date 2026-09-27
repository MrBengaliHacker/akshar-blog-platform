import { createBrowserRouter } from "react-router";

// Loaders
import refreshTokenLoader from "@/routes/loaders/refreshToken";
import homeLoader from "@/routes/loaders/user/home";
import userBlogLoader from "@/routes/loaders/user/blogs";
import blogDetailLoader from "@/routes/loaders/user/blogDetail";
import profileLoader from "@/routes/loaders/user/profile";

// Pages
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import { RootLayout } from "@/components/layouts/Root";
import { Home } from "@/pages/user/Home";
import { Blogs } from "@/pages/user/Blogs";
import { BlogDetail } from "@/pages/user/BlogDetail";
import { Profile } from "@/pages/user/Profile";

// Actions
import signupAction from "@/routes/actions/auth/signup";
import loginAction from "@/routes/actions/auth/login";
import settingsAction from "@/routes/actions/user/settings";

// Error boundries

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
    children:[
      {
        path: 'dashboard',
      },
      {
        path: 'blogs',
      },
      {
        path: 'blogs/create',
      },
      {
        path: 'blogs/:slug/edit',
      },
      {
        path: 'comments',
      },
      {
        path: 'users',
      },
    ]
  },
  {
    path: '/settings',
    action: settingsAction,
  }
])

export default router;