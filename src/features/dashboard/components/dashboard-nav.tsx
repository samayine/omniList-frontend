'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, PlusCircle, Settings, LogOut, Heart, Users, BarChart3, List } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const isClient = useIsClient();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    // Admin
    { name: 'Properties', href: '/dashboard/all-properties', icon: Building2, roles: [Role.ADMIN] },
    { name: 'Users', href: '/dashboard/users', icon: Users, roles: [Role.ADMIN] },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: [Role.ADMIN] },
    // Owner
    { name: 'My Listings', href: '/dashboard/listings', icon: List, roles: [Role.OWNER] },
    { name: 'New Listing', href: '/dashboard/properties/new', icon: PlusCircle, roles: [Role.OWNER] },
    // User
    { name: 'My Favorites', href: '/favorites', icon: Heart, roles: [Role.USER] },
    // All
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role as Role))
  );

  if (!isClient) return <div className="w-64 h-screen border-r bg-muted/20 animate-pulse" />; // Prevent hydration mismatch

  return (
    <div className="w-64 h-screen hidden md:flex flex-col border-r bg-card shadow-sm shrink-0 sticky top-0">
      <div className="h-16 flex items-center px-6 border-b shrink-0">
        <Link href="/" className="font-space font-bold text-xl tracking-tight text-foreground">
          OmniList<span className="text-primary text-2xl leading-none">.</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          // Overview uses exact match; all others use startsWith so sub-routes stay highlighted
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <Separator />
      
      <div className="p-4 space-y-4 shrink-0 bg-muted/10">
        <div className="px-2 cursor-default">
           <p className="text-sm font-semibold truncate leading-tight dark:text-zinc-200">{user?.email}</p>
           <p className="text-xs text-muted-foreground uppercase mt-0.5 tracking-wider">{user?.role}</p>
        </div>
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-950/30">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
