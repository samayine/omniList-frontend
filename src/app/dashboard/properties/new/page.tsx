'use client';

import { PropertyForm } from '@/features/properties/components/property-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-4xl pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Listing</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Upload stunning visuals and define everything your property has to offer.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
         <PropertyForm />
      </div>
    </div>
  );
}
