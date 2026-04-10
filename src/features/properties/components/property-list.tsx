'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropertyCard } from './property-card';
import { getPropertiesApi } from '../api/properties-api';
import type { PaginatedResponse, Property } from '@/types';

type PropertyListProps = {
  initialData: PaginatedResponse<Property>;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function PropertyList({ initialData }: PropertyListProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;

  const debouncedSearch = useDebounce(search, 300);
  const debouncedMin = useDebounce(minPrice, 500);
  const debouncedMax = useDebounce(maxPrice, 500);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, debouncedMin, debouncedMax]);

  const isFiltering = debouncedSearch.length > 0 || debouncedMin.length > 0 || debouncedMax.length > 0;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['properties', debouncedSearch, debouncedMin, debouncedMax, page],
    queryFn: () => getPropertiesApi({
      search: debouncedSearch || undefined,
      minPrice: debouncedMin ? Number(debouncedMin) : undefined,
      maxPrice: debouncedMax ? Number(debouncedMax) : undefined,
      page,
      limit,
    }),
    initialData: !isFiltering && page === 1 ? initialData : undefined,
    placeholderData: (prev) => prev, // keep old data visible while fetching
  });

  const properties = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit, totalPages: 1 };

  const clearAll = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-8">
      {/* Search + Filters */}
      <div className="max-w-3xl mx-auto -mt-16 relative z-10 space-y-3">
        {/* Main Search */}
        <div className="relative bg-background/80 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl transition-shadow hover:shadow-2xl flex items-center">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by title, location, or keywords..."
            className="pl-13 pr-24 h-14 bg-transparent border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {search && (
              <button
                onClick={() => setSearch('')}
                className="h-7 w-7 flex items-center justify-center rounded-full bg-muted hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 w-9 flex items-center justify-center rounded-xl transition-colors ${
                showFilters || isFiltering
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-background/90 backdrop-blur-md rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">Price Range</p>
              {(minPrice || maxPrice) && (
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="text-xs text-primary hover:underline">
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-10 text-sm"
              />
              <span className="text-muted-foreground text-sm shrink-0">to</span>
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>
        )}

        {/* Active filter summary */}
        {isFiltering && (
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <p>
              {meta.total} result{meta.total !== 1 ? 's' : ''} found
              {debouncedSearch && <> for "<span className="font-medium text-foreground">{debouncedSearch}</span>"</>}
              {(debouncedMin || debouncedMax) && (
                <> · {debouncedMin ? formatter.format(Number(debouncedMin)) : '$0'} – {debouncedMax ? formatter.format(Number(debouncedMax)) : '∞'}</>
              )}
            </p>
            <button onClick={clearAll} className="text-primary hover:underline font-medium">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className={`pt-2 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 font-space">
          {isFiltering ? 'Search Results' : 'Explore Featured Listings'}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map((i) => (
               <div key={i} className="h-[400px] bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-32 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 mx-auto max-w-3xl">
             <Search className="h-12 w-12 text-muted-foreground mb-4 mx-auto opacity-50" />
             <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">No properties found</h3>
             <p className="text-muted-foreground text-lg">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded-lg"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
              .reduce((acc: (number | string)[], p, i, arr) => {
                if (i > 0 && typeof arr[i - 1] === 'number' && p - (arr[i - 1] as number) > 1) {
                  acc.push('...');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === '...' ? (
                  <span key={`dot-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
                ) : (
                  <Button
                    key={item}
                    variant={page === item ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPage(item as number)}
                    className={`w-9 h-9 rounded-lg ${page === item ? '' : 'text-muted-foreground'}`}
                  >
                    {item}
                  </Button>
                )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded-lg"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </nav>
      )}
    </div>
  );
}
