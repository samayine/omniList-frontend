'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MoreHorizontal, Archive, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { getAdminProperties, disablePropertyApi, restorePropertyApi } from '@/features/admin/api/admin-api';

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

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: () => getAdminProperties(1, 100),
  });

  const disableMutation = useMutation({
    mutationFn: disablePropertyApi,
    onSuccess: () => {
      toast.success('Property archived.');
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
    onError: () => toast.error('Failed to archive property.'),
  });

  const restoreMutation = useMutation({
    mutationFn: restorePropertyApi,
    onSuccess: () => {
      toast.success('Property restored to Draft.');
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
    onError: () => toast.error('Failed to restore property.'),
  });

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">All Properties</h1>
        <p className="text-muted-foreground text-lg">
          View and moderate every listing on the platform.
        </p>
      </div>

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
                properties.map((prop: any) => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          {prop.status !== 'ARCHIVED' && (
                            <DropdownMenuItem
                              onClick={() => disableMutation.mutate(prop.id)}
                              disabled={disableMutation.isPending}
                              className="cursor-pointer text-red-500 focus:text-red-600"
                            >
                              <Archive className="h-4 w-4 mr-2" /> Force Archive
                            </DropdownMenuItem>
                          )}
                          {prop.status === 'ARCHIVED' && (
                            <DropdownMenuItem
                              onClick={() => restoreMutation.mutate(prop.id)}
                              disabled={restoreMutation.isPending}
                              className="cursor-pointer text-emerald-600 focus:text-emerald-700"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" /> Restore to Draft
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
  );
}
