'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MoreHorizontal, Edit, Globe, Archive, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { getPropertiesApi, publishPropertyApi, archivePropertyApi, deletePropertyApi } from '@/features/properties/api/properties-api';
import { Status } from '@/types';
import { useRouter } from 'next/navigation';

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

export default function MyListingsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: propertiesRes, isLoading } = useQuery({
    queryKey: ['owner-properties'],
    queryFn: () => getPropertiesApi({ limit: 50, onlyMine: true }),
  });

  const publishMutation = useMutation({
    mutationFn: publishPropertyApi,
    onSuccess: () => {
      toast.success('Property published!');
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to publish';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    }
  });

  const archiveMutation = useMutation({
    mutationFn: archivePropertyApi,
    onSuccess: () => {
      toast.success('Property archived.');
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: () => toast.error('Failed to archive.')
  });

  const deleteMutation = useMutation({
    mutationFn: deletePropertyApi,
    onSuccess: () => {
      toast.success('Property permanently deleted.');
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: () => toast.error('Failed to delete property.')
  });

  const properties = propertiesRes?.data || [];
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-10 w-1/3 bg-muted rounded-lg animate-pulse" />
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Listings</h1>
          <p className="text-muted-foreground text-lg">Manage all your property listings.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/properties/new')}>
          New Listing
        </Button>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
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
                  <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No listings yet</p>
                    <p className="mb-4">Create your first property listing to get started.</p>
                    <Button onClick={() => router.push('/dashboard/properties/new')} size="sm">
                      Create Listing
                    </Button>
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                          {prop.images?.[0] ? (
                            <Image src={getImageUrl(prop.images[0].url)} alt={prop.title} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs border">No Img</div>
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
                        <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Published</Badge>
                      )}
                      {prop.status === Status.DRAFT && (
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border border-amber-500/20">Draft</Badge>
                      )}
                      {prop.status === Status.ARCHIVED && (
                        <Badge variant="outline" className="text-muted-foreground">Archived</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{formatter.format(prop.price)}</td>
                    <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                      {format(new Date(prop.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/properties/${prop.id}/edit`)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {prop.status === Status.DRAFT && (
                            <DropdownMenuItem
                              onClick={() => publishMutation.mutate(prop.id)}
                              disabled={publishMutation.isPending}
                              className="cursor-pointer text-emerald-600"
                            >
                              <Globe className="h-4 w-4 mr-2" /> Publish Live
                            </DropdownMenuItem>
                          )}
                          {prop.status === Status.PUBLISHED && (
                            <DropdownMenuItem onClick={() => router.push(`/properties/${prop.id}`)} className="cursor-pointer">
                              <ExternalLink className="h-4 w-4 mr-2" /> View Public Page
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {prop.status !== Status.ARCHIVED && (
                            <DropdownMenuItem
                              onClick={() => archiveMutation.mutate(prop.id)}
                              disabled={archiveMutation.isPending}
                              className="cursor-pointer text-amber-600"
                            >
                              <Archive className="h-4 w-4 mr-2" /> Archive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              if (confirm(`Permanently delete "${prop.title}"? This cannot be undone.`)) {
                                deleteMutation.mutate(prop.id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            className="cursor-pointer text-red-500 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
                          </DropdownMenuItem>
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
  );
}
