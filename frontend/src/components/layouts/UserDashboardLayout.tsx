import { Link, Outlet, useLocation } from 'react-router';

// Components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { SidebarUserMenu } from '@/components/SidebarUserMenu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TopAppBar } from '@/components/TopAppBar';

// Assets
import { FileTextIcon, PenLineIcon } from 'lucide-react';

// Constants
const DASHBOARD_MENU = [
  {
    label: 'My Blogs',
    url: '/dashboard',
    icon: FileTextIcon,
  },
  {
    label: 'Write a blog',
    url: '/dashboard/blogs/create',
    icon: PenLineIcon,
  },
];

const UserDashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation();

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg'>
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My Dashboard</SidebarGroupLabel>

          <SidebarMenu>
            {DASHBOARD_MENU.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  isActive={location.pathname === item.url}
                  tooltip={item.label}
                  asChild
                >
                  <Link to={item.url} viewTransition>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
};

export const UserDashboardLayout = () => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <UserDashboardSidebar />

        <SidebarInset className='relative max-h-[calc(100dvh-16px)] overflow-auto'>
          <TopAppBar />

          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};