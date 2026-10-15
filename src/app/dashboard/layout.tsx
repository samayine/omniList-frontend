'use client';

import { DashboardNav } from '@/features/dashboard/components/dashboard-nav';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-black w-full overflow-hidden">
      {/* Desktop Navigation */}
      <DashboardNav />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Mobile Header */}
        <header className="h-16 border-b bg-card flex items-center px-4 md:hidden sticky top-0 z-30 shadow-sm shrink-0">
          <Sheet>
            <SheetTrigger className="md:hidden mr-2 p-2 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r">
               {/* Re-use DashboardNav injected inside a sheet */}
               <DashboardNav />
            </SheetContent>
          </Sheet>
          <Link href="/" className="font-space font-bold text-xl tracking-tight">
            OmniList<span className="text-primary text-2xl leading-none">.</span>
          </Link>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-4 sm:p-8 md:p-12 max-w-7xl mx-auto w-full">
           {children}
        </div>
      </main>
    </div>
  );
}
