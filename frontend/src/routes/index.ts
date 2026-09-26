import { createBrowserRouter } from "react-router";

// Loaders
import refreshTokenLoader from "@/routes/loaders/refreshToken";
import homeLoader from "@/routes/loaders/user/home";

// Pages
import { Login } from "@/pages/auth/Login";
import { Signup } from "@/pages/auth/Signup";
import { RootLayout } from "@/components/layouts/Root";
import { Home } from "@/pages/user/Home";

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
      },
      {
        path: 'blogs/:slug',
      },
      {
        path: 'profile/:userId',
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