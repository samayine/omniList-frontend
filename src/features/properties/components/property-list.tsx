'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropertyCard } from './property-card';
import { getPropertiesApi } from '../api/properties-api';
import type { PaginatedResponse, Property } from '@/types';

type PropertyListProps = {
  initialData: PaginatedResponse<Property>;
};

export function PropertyList({ initialData }: PropertyListProps) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  
  // Real active state of filters
  const [filters, setFilters] = useState({ search: '', location: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => getPropertiesApi({ ...filters, page: 1, limit: 12 }),
    initialData: filters.search === '' && filters.location === '' ? initialData : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search, location });
  };

  const properties = data?.data || [];

  return (
    <div className="space-y-12">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 p-4 bg-background/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-4xl mx-auto -mt-16 relative z-10 transition-shadow hover:shadow-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by keywords..." 
            className="pl-11 h-14 bg-background border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-px bg-border hidden md:block" />
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Location..." 
            className="pl-11 h-14 bg-background border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button size="lg" type="submit" className="h-14 px-8 rounded-xl font-semibold text-base transition-transform active:scale-95">
          Search
        </Button>
      </form>

      {/* Grid */}
      <div className="pt-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 font-space">
          {filters.search || filters.location ? 'Search Results' : 'Explore Featured Listings'}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
               <div key={i} className="h-[400px] bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-32 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 mx-auto max-w-3xl">
             <Search className="h-12 w-12 text-muted-foreground mb-4 mx-auto opacity-50" />
             <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">No properties found</h3>
             <p className="text-muted-foreground text-lg">Try adjusting your filters or searching a different area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
