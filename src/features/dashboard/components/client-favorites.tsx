'use client';

import { useQuery } from '@tanstack/react-query';
import { Heart, Loader2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getFavoritesApi } from '@/features/properties/api/favorites-api';
import { PropertyCard } from '@/features/properties/components/property-card';
import { Button } from '@/components/ui/button';

export function ClientFavorites() {
  const router = useRouter();
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesApi,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-muted/20 border border-dashed rounded-3xl animate-pulse">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Syncing your favorite collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-500/5 border border-red-500/10 rounded-2xl">
        <p className="text-red-500 font-medium">Failed to load favorites. Please try again later.</p>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 bg-card border rounded-3xl shadow-sm text-center">
        <div className="p-4 bg-rose-500/10 rounded-full mb-6">
          <Heart className="h-10 w-10 text-rose-500 fill-rose-500/20" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight mb-2">No Saved Properties</h3>
        <p className="text-muted-foreground max-w-sm mb-8">
          You haven't saved any listings yet. Explore our featured properties and tap the heart icon to save them here.
        </p>
        <Button onClick={() => router.push('/')} size="lg" className="rounded-full px-8">
          Explore Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Heart className="h-6 w-6 text-rose-500 fill-rose-500/20" />
          My Favorites
        </h2>
        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full shrink-0">
          {favorites.length} Properties Saved
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {favorites.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
