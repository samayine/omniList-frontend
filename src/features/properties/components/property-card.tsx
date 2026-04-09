import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Standard } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property, Status } from '@/types';

type PropertyCardProps = {
  property: Property;
};

const getBaseUrl = () => {
  // Extract base URL stripping the /api suffix to serve images from the backend host
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  return apiUrl.replace(/\/api$/, '');
};

export function PropertyCard({ property }: PropertyCardProps) {
  // Grab standard first image or fallback (handle both local uploads and external seeding URLs)
  const firstImage = property.images && property.images.length > 0 
    ? property.images[0].url.startsWith('http') 
        ? property.images[0].url 
        : `${getBaseUrl()}${property.images[0].url}`
    : '/placeholder.svg';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <Link href={`/properties/${property.id}`} className="block group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={firstImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized // Using unoptimized for external backend non-configured URLs for the mini-project
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {property.status === Status.PUBLISHED && (
              <Badge className="bg-emerald-500/90 hover:bg-emerald-600 text-white border-transparent">
                Active
              </Badge>
            )}
            {property.status === Status.DRAFT && (
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-zinc-800">
                Draft
              </Badge>
            )}
            {property.status === Status.ARCHIVED && (
              <Badge variant="destructive" className="bg-red-500/90 backdrop-blur-sm">
                Archived
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg line-clamp-1 leading-tight group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </div>
          <div className="flex gap-1 text-muted-foreground items-center text-sm pt-1 mt-0.5">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-1 flex-grow">
           <p className="text-2xl font-bold text-zinc-900 dark:text-white">
            {formatter.format(property.price)}
          </p>
        </CardContent>
        {/*
        <CardFooter className="p-4 pt-0 text-muted-foreground text-sm flex gap-4">
           If there were extra specs, we'd add them here
        </CardFooter>
        */}
      </Card>
    </Link>
  );
}
