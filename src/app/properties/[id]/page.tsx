import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowLeft, Building2, Calendar, Share, Heart } from 'lucide-react';

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
            
            {/* Added specs area to make it feel premium */}
            <div className="bg-white dark:bg-zinc-900 border shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row gap-6 sm:gap-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                   <p className="text-sm text-muted-foreground font-medium">Property Type</p>
                   <p className="font-semibold text-foreground">Premium Listing</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                   <p className="text-sm text-muted-foreground font-medium">Listed Info</p>
                   <p className="font-semibold text-foreground">
                     {property.publishedAt ? new Date(property.publishedAt).toLocaleDateString() : 'Unpublished'}
                   </p>
                </div>
              </div>
            </div>
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
