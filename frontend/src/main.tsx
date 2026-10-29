import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router";
import { MotionConfig } from 'motion/react';

import './index.css'

//  Router
import router from "@/routes";

// Components
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {/* Animations are reduced for people who ask for it in their system settings */}
      <MotionConfig reducedMotion='user'>
        <RouterProvider router={router} />

        <Toaster richColors />
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>,
)
