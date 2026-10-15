'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Users, Building2, Globe, Heart, Archive, Shield, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import {
  getAdminMetrics,
  getAdminProperties,
  disablePropertyApi,
  type AdminProperty,
} from '@/features/admin/api/admin-api';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  return apiUrl.replace(/\/api$/, '');
};
const getImageUrl = (url: string) => url.startsWith('http') ? url : `${getBaseUrl()}${url}`;

export default function AdminPage() {
  const queryClient = useQueryClient();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: getAdminMetrics,
  });

  const { data: properties, isLoading: propsLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: () => getAdminProperties(1, 50),
  });

  const disableMutation = useMutation({
    mutationFn: disablePropertyApi,
    onSuccess: () => {
      toast.success('Property has been disabled.');
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
    onError: () => toast.error('Failed to disable property.'),
  });

  const isLoading = metricsLoading || propsLoading;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-8 p-8">
        <div className="h-10 w-1/3 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[1,2,3,4,5].map(i => <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  const metricCards = [
    { title: 'Total Users', value: metrics?.users ?? 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'All Properties', value: metrics?.properties.total ?? 0, icon: Building2, color: 'text-zinc-600', bg: 'bg-zinc-500/10' },
    { title: 'Published', value: metrics?.properties.published ?? 0, icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Archived', value: metrics?.properties.archived ?? 0, icon: Archive, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Total Favorites', value: metrics?.favorites ?? 0, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <header className="sticky top-0 z-40 border-b bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold tracking-tight">Admin Console</h1>
          <Badge variant="outline" className="ml-auto text-xs uppercase tracking-wider">
            Platform Admin
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Metrics */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Platform Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {metricCards.map((card, i) => {
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

        {/* Properties Table */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-2xl font-bold tracking-tight mb-6">All Listings</h2>
          <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Property</th>
                    <th className="px-6 py-4 font-medium">Owner</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Created</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(!properties || properties.length === 0) ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No properties on the platform yet.
                      </td>
                    </tr>
                  ) : (
                    properties.map((prop: AdminProperty) => (
                      <tr key={prop.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 relative rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                              {prop.images?.[0] ? (
                                <Image src={getImageUrl(prop.images[0].url)} alt={prop.title} fill className="object-cover" unoptimized />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-[10px]">No Img</div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground line-clamp-1">{prop.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{prop.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm truncate max-w-[140px]">{prop.owner?.email}</p>
                          <p className="text-xs text-muted-foreground capitalize">{prop.owner?.role?.toLowerCase()}</p>
                        </td>
                        <td className="px-6 py-4">
                          {prop.status === 'PUBLISHED' && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Published</Badge>
                          )}
                          {prop.status === 'DRAFT' && (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border border-amber-500/20">Draft</Badge>
                          )}
                          {prop.status === 'ARCHIVED' && (
                            <Badge variant="outline" className="text-muted-foreground">Archived</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium">{formatter.format(prop.price)}</td>
                        <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                          {format(new Date(prop.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {prop.status !== 'ARCHIVED' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent outline-none">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuItem
                                  onClick={() => disableMutation.mutate(prop.id)}
                                  disabled={disableMutation.isPending}
                                  className="cursor-pointer text-red-500 focus:text-red-600"
                                >
                                  <Archive className="h-4 w-4 mr-2" /> Force Archive
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
