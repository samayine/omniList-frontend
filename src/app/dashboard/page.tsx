'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MoreHorizontal, ExternalLink, Edit, Globe, Archive } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { getPropertiesApi, publishPropertyApi, archivePropertyApi } from '@/features/properties/api/properties-api';
import { OwnerMetrics } from '@/features/dashboard/components/owner-metrics';
import { Status } from '@/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  return apiUrl.replace(/\/api$/, '');
};

const getImageUrl = (url: string) => url.startsWith('http') ? url : `${getBaseUrl()}${url}`;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['owner-properties'],
    queryFn: () => getPropertiesApi({ limit: 50 }), 
  });

  const publishMutation = useMutation({
    mutationFn: publishPropertyApi,
    onSuccess: () => {
      toast.success('Property successfully published!');
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to publish property';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  });

  const archiveMutation = useMutation({
    mutationFn: archivePropertyApi,
    onSuccess: () => {
      toast.success('Property has been archived.');
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (err: any) => toast.error('Failed to archive property.')
  });

  const properties = data?.data || [];

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back.</h1>
        <p className="text-muted-foreground text-lg">
          Here's what's happening with your properties today.
        </p>
      </div>

      {isLoading ? (
        <div className="h-32 w-full bg-muted animate-pulse rounded-2xl" />
      ) : error ? (
        <div className="p-6 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
          Failed to load dashboard data. Please check your connection.
        </div>
      ) : (
        <>
          <OwnerMetrics properties={properties} />

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-semibold tracking-tight">Recent Listings</h2>
               <Button asChild>
                 <Link href="/dashboard/properties/new">New Listing</Link>
               </Button>
            </div>
            
            <div className="rounded-2xl border bg-card overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider border-b">
                    <tr>
                      <th className="px-6 py-4 font-medium">Property</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Price</th>
                      <th className="px-6 py-4 font-medium hidden sm:table-cell">Created</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {properties.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          You haven't listed any properties yet.
                        </td>
                      </tr>
                    ) : (
                      properties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                                {prop.images?.[0] ? (
                                  <Image
                                    src={getImageUrl(prop.images[0].url)}
                                    alt={prop.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs text-center border">No Img</div>
                                )}
                              </div>
                              <div className="min-w-[150px]">
                                <p className="font-semibold text-foreground line-clamp-1">{prop.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{prop.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {prop.status === Status.PUBLISHED && (
                              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 dark:text-emerald-400">Published</Badge>
                            )}
                            {prop.status === Status.DRAFT && (
                              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20 dark:text-amber-400">Draft</Badge>
                            )}
                            {prop.status === Status.ARCHIVED && (
                              <Badge variant="outline" className="text-muted-foreground">Archived</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground">
                            {formatter.format(prop.price)}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                            {format(new Date(prop.createdAt), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/properties/${prop.id}/edit`} className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" /> Edit Property
                                  </Link>
                                </DropdownMenuItem>
                                
                                {prop.status === Status.DRAFT && (
                                   <DropdownMenuItem 
                                     onClick={() => publishMutation.mutate(prop.id)}
                                     disabled={publishMutation.isPending}
                                     className="cursor-pointer text-emerald-600 focus:text-emerald-700"
                                   >
                                     <Globe className="h-4 w-4 mr-2" /> Publish Live
                                   </DropdownMenuItem>
                                )}
                                
                                {prop.status === Status.PUBLISHED && (
                                   <DropdownMenuItem asChild>
                                     <Link href={`/properties/${prop.id}`} className="cursor-pointer">
                                       <ExternalLink className="h-4 w-4 mr-2" /> View Public Page
                                     </Link>
                                   </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                
                                {prop.status !== Status.ARCHIVED && (
                                  <DropdownMenuItem 
                                     onClick={() => archiveMutation.mutate(prop.id)}
                                     disabled={archiveMutation.isPending}
                                     className="cursor-pointer text-red-500 focus:text-red-600"
                                  >
                                    <Archive className="h-4 w-4 mr-2" /> Archive
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
