'use client';

import { useQuery } from '@tanstack/react-query';
import { getPropertyApi } from '@/features/properties/api/properties-api';
import { PropertyForm } from '@/features/properties/components/property-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyApi(propertyId),
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
         <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md">
            <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Property</h2>
            <p className="text-red-400 mb-6">Could not locate the requested property or it was removed.</p>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Listing</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Modifying details for <span className="font-semibold text-foreground">{property.title}</span>.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
         <PropertyForm initialData={property} />
      </div>
    </div>
  );
}
