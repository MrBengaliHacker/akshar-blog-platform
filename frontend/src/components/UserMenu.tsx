import { Link } from 'react-router';

// Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Avatar from "react-avatar";
import { SettingsDialog } from '@/components/SettingsDialog';

// Custom Hooks
import { useUser } from '@/hooks/useUser';
import { useLogout } from '@/hooks/useLogout';

// Assets
import { LayoutDashboardIcon, LogOutIcon, SettingsIcon } from "lucide-react";

export const UserMenu = () => {
  const user = useUser();
  const logout = useLogout();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
          >
            <Avatar name={user.username} email={user.email} size='28' className='rounded-sm' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="min-w-56"
          align="end"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar name={user.username} email={user.email} size='32' className='rounded-lg' />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="truncate font-medium">{user.username}</div>
                <div className="truncate text-xs">{user.email}</div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {user.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link to="/dashboard" viewTransition>
                  <LayoutDashboardIcon />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}

            <SettingsDialog>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
            </SettingsDialog>

            <DropdownMenuItem onClick={logout}>
              <LogOutIcon />
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};