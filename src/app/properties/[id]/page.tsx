import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowLeft, Building2, Calendar, Bed, Bath, Maximize2 } from 'lucide-react';

import { Property, Status } from '@/types';
import { PropertyGallery } from '@/features/properties/components/property-gallery';
import { FavoriteButton } from '@/features/properties/components/favorite-button';
import { PublicNav } from '@/components/navigation/public-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

async function fetchProperty(id: string): Promise<Property | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = baseUrl === '/api' ? 'http://localhost:8000/api' : baseUrl || 'http://localhost:8000/api';
  try {
    const res = await fetch(`${apiUrl}/properties/${id}`, {
      next: { revalidate: 30 }, // Revalidate every 30 seconds
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch property: ${res.statusText}`);
    }
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const property = await fetchProperty(resolvedParams.id);

  if (!property) {
    notFound(); 
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-32">
      <PublicNav />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Link 
            href="/" 
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to listings
          </Link>

          <div className="flex items-center gap-3">
            {/* These buttons are decorative for now, will implement logic later if requested */}
            <FavoriteButton propertyId={property.id} />
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {/* Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {property.status === Status.PUBLISHED && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Active Listing</Badge>
                )}
                {property.status === Status.DRAFT && (
                  <Badge variant="secondary">Draft Mode</Badge>
                )}
                <Badge variant="outline" className="text-muted-foreground bg-transparent">
                   Property ID: {property.id.split('-')[0]}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
                {property.title}
              </h1>
              <div className="flex items-center text-lg text-muted-foreground">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                {property.location}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground">About this property</h2>
              <div className="prose dark:prose-invert prose-zinc max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </div>
            
            {/* Property Overview / Specs Grid */}
            <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight mb-4 text-foreground">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Type</p>
                    <p className="font-semibold text-foreground text-sm capitalize">
                      {property.propertyType ? property.propertyType.toLowerCase() : 'Apartment'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <Bed className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Bedrooms</p>
                    <p className="font-semibold text-foreground text-sm">
                      {property.bedrooms != null ? property.bedrooms : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <Bath className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Bathrooms</p>
                    <p className="font-semibold text-foreground text-sm">
                      {property.bathrooms != null ? property.bathrooms : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                    <Maximize2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Area</p>
                    <p className="font-semibold text-foreground text-sm">
                      {property.areaSqFt != null ? `${property.areaSqFt.toLocaleString()} sq ft` : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Listed: {property.publishedAt ? new Date(property.publishedAt).toLocaleDateString() : 'Unpublished (Draft)'}
                </span>
                <span>ID: {property.id}</span>
              </div>
            </div>

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Amenities & Key Features</h2>
                <div className="flex flex-wrap gap-2.5">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-zinc-900 border shadow-xs text-zinc-800 dark:text-zinc-200"
                    >
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / CTA */}
          <div className="lg:col-span-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="sticky top-8 bg-white dark:bg-zinc-900 border rounded-3xl p-6 sm:p-8 shadow-xl">
               <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Asking Price</p>
               <h2 className="text-4xl font-bold tracking-tight text-foreground mb-6">
                 {formatter.format(property.price)}
               </h2>
               
               <Button className="w-full h-14 rounded-xl text-lg font-semibold shadow-md active:scale-[0.98] transition-transform">
                 Contact Agent
               </Button>
               <Button variant="secondary" className="w-full h-14 rounded-xl text-lg font-semibold mt-3 active:scale-[0.98] transition-transform">
                 Request Tour
               </Button>
               
               <p className="text-xs text-center text-muted-foreground mt-6">
                 Listed by verified owner {/* {property.owner?.email} */}
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
