'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { 
  getFavoritesApi, 
  addFavoriteApi, 
  removeFavoriteApi 
} from '@/features/properties/api/favorites-api';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/auth-store';

type FavoriteButtonProps = {
  propertyId: string;
  className?: string;
};

export function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // 1. Fetch current favorites list to check if this property is saved
  const { data: favorites, isLoading: isFetching } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesApi,
    enabled: isAuthenticated, // Only fetch if logged in
  });

  const isFavorited = favorites?.some((fav) => fav.id === propertyId);

  // 2. Mutation for toggling
  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        return removeFavoriteApi(propertyId);
      } else {
        return addFavoriteApi(propertyId);
      }
    },
    onSuccess: () => {
      // Invalidate the favorites query to refresh the UI everywhere
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(isFavorited ? 'Removed from favorites' : 'Saved to favorites');
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        toast.error('Please login to save properties');
      } else {
        toast.error('Failed to update favorites');
      }
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save properties');
      return;
    }
    
    toggleFavorite.mutate();
  };

  const isPending = toggleFavorite.isPending || isFetching;

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "h-9 px-4 rounded-full transition-all active:scale-95 hover:bg-rose-50 dark:hover:bg-rose-950/20 group",
        isFavorited && "text-rose-500 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20",
        className
      )}
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Heart 
          className={cn(
            "h-4 w-4 mr-2 transition-colors", 
            isFavorited ? "fill-current text-rose-500" : "text-rose-500 group-hover:scale-110"
          )} 
        />
      )}
      {isFavorited ? 'Saved' : 'Save'}
    </Button>
  );
}
