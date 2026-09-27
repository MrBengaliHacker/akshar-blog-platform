import { Outlet } from 'react-router';

// Components
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TopAppBar } from '@/components/TopAppBar';

export const AdminLayout = () => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className='relative max-h-[calc(100dvh-16px)] overflow-auto'>
          <TopAppBar />

          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};