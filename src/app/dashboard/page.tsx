'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Building2, Globe, Archive, Heart, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { getPropertiesApi } from '@/features/properties/api/properties-api';
import { getFavoritesApi } from '@/features/properties/api/favorites-api';
import { getAdminMetrics } from '@/features/admin/api/admin-api';
import { Status, Role } from '@/types';

import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const isAdmin = user?.role === Role.ADMIN;
  const isOwner = user?.role === Role.OWNER;
  const isClient = user?.role === Role.USER;

  // Owner: fetch their properties for metrics
  const { data: propertiesRes, isLoading: isLoadingProps } = useQuery({
    queryKey: ['owner-properties'],
    queryFn: () => getPropertiesApi({ limit: 100, onlyMine: true }),
    enabled: isOwner,
  });

  // Client: fetch favorites count
  const { data: favorites, isLoading: isLoadingFavs } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesApi,
    enabled: isClient,
  });

  // Admin: platform metrics
  const { data: adminMetrics, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: getAdminMetrics,
    enabled: isAdmin,
  });

  const isLoading = (isOwner && isLoadingProps) || (isClient && isLoadingFavs) || (isAdmin && isLoadingAdmin);

  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="h-12 w-1/3 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  // ── Build metric cards per role ──
  const properties = propertiesRes?.data || [];

  const adminCards = [
    { title: 'Total Users', value: adminMetrics?.users ?? 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'All Properties', value: adminMetrics?.properties.total ?? 0, icon: Building2, color: 'text-zinc-600', bg: 'bg-zinc-500/10' },
    { title: 'Published', value: adminMetrics?.properties.published ?? 0, icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Archived', value: adminMetrics?.properties.archived ?? 0, icon: Archive, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Total Favorites', value: adminMetrics?.favorites ?? 0, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const ownerCards = [
    { title: 'Total Properties', value: properties.length, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Published', value: properties.filter(p => p.status === Status.PUBLISHED).length, icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Drafts', value: properties.filter(p => p.status === Status.DRAFT).length, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Portfolio Value', value: formatter.format(properties.reduce((s, p) => s + p.price, 0)), icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const clientCards = [
    { title: 'Saved Properties', value: favorites?.length ?? 0, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const cards = isAdmin ? adminCards : isOwner ? ownerCards : clientCards;
  const gridCols = isAdmin ? 'lg:grid-cols-5' : isClient ? 'lg:grid-cols-1 max-w-sm' : 'lg:grid-cols-4';

  // ── Quick links per role ──
  const quickLinks = isAdmin ? [
    { label: 'Manage All Properties', href: '/dashboard/all-properties', icon: Building2 },
    { label: 'Create New Listing', href: '/dashboard/properties/new', icon: FileText },
    { label: 'Manage Users', href: '/dashboard/users', icon: Users },
  ] : isOwner ? [
    { label: 'View My Listings', href: '/dashboard/listings', icon: Building2 },
    { label: 'Create New Listing', href: '/dashboard/properties/new', icon: FileText },
  ] : [
    { label: 'View Favorites', href: '/favorites', icon: Heart },
    { label: 'Browse Properties', href: '/', icon: Building2 },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.email.split('@')[0]}.</h1>
        <p className="text-muted-foreground text-lg">
          {isAdmin && "Platform overview and moderation tools."}
          {isOwner && "Your portfolio at a glance."}
          {isClient && "Your activity and saved properties."}
        </p>
      </div>

      {/* Metrics */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className={`grid grid-cols-2 sm:grid-cols-3 ${gridCols} gap-4`}>
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={i} className="border-none shadow-sm dark:bg-zinc-900/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${card.bg}`}>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{card.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Links */}
      <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
        <h2 className="text-lg font-semibold tracking-tight mb-4 text-muted-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/50 hover:shadow-sm transition-all group"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
