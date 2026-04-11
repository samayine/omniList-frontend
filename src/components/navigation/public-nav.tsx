'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, LayoutDashboard, Heart, List, PlusCircle } from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PublicNav() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user?.email?.substring(0, 2).toUpperCase() || 'U';
  const role = user?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/" className="font-space font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors shrink-0">
          OmniList<span className="text-primary text-2xl leading-none">.</span>
        </Link>

        <nav className="flex items-center gap-1">
          {!isAuthenticated ? (
            /* ── Unauthenticated ── */
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => router.push('/login')} className="rounded-full hidden sm:flex">
                Log in
              </Button>
              <Button onClick={() => router.push('/register')} className="rounded-full px-5">
                Sign up
              </Button>
            </div>
          ) : (
            /* ── Authenticated ── */
            <div className="flex items-center gap-2">

              {/* Context nav links — visible md+ */}
              <div className="hidden md:flex items-center">
                {role === 'USER' && (
                  <Link
                    href="/favorites"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <>
                    <Link
                      href="/dashboard/all-properties"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                    >
                      <List className="h-4 w-4" />
                      All Properties
                    </Link>
                    <Link
                      href="/dashboard/properties/new"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                    >
                      <PlusCircle className="h-4 w-4" />
                      New Listing
                    </Link>
                  </>
                )}
                {role === 'OWNER' && (
                  <>
                    <Link
                      href="/dashboard/listings"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                    >
                      <List className="h-4 w-4" />
                      My Listings
                    </Link>
                    <Link
                      href="/dashboard/properties/new"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                    >
                      <PlusCircle className="h-4 w-4" />
                      New Listing
                    </Link>
                  </>
                )}
              </div>

              {/* Avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="h-9 w-9 rounded-full bg-primary/10 border-2 border-primary/20 hover:border-primary/50 transition-all outline-none cursor-pointer flex items-center justify-center text-primary font-semibold text-sm uppercase shrink-0">
                  {initials}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 mt-2 rounded-xl shadow-lg">
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-semibold truncate">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{role?.toLowerCase()}</p>
                  </div>
                  <DropdownMenuSeparator />

                  {/* Dashboard — shown for OWNER and ADMIN always, and in mobile for USER */}
                  {(role === 'OWNER' || role === 'ADMIN') && (
                    <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer gap-2">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </DropdownMenuItem>
                  )}

                  {/* Mobile-only nav links */}
                  {role === 'USER' && (
                    <DropdownMenuItem onClick={() => router.push('/favorites')} className="cursor-pointer gap-2 md:hidden">
                      <Heart className="h-4 w-4" /> Favorites
                    </DropdownMenuItem>
                  )}
                  {role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem onClick={() => router.push('/dashboard/all-properties')} className="cursor-pointer gap-2 md:hidden">
                        <List className="h-4 w-4" /> All Properties
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/dashboard/properties/new')} className="cursor-pointer gap-2 md:hidden">
                        <PlusCircle className="h-4 w-4" /> New Listing
                      </DropdownMenuItem>
                    </>
                  )}
                  {role === 'OWNER' && (
                    <>
                      <DropdownMenuItem onClick={() => router.push('/dashboard/listings')} className="cursor-pointer gap-2 md:hidden">
                        <List className="h-4 w-4" /> My Listings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/dashboard/properties/new')} className="cursor-pointer gap-2 md:hidden">
                        <PlusCircle className="h-4 w-4" /> New Listing
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
