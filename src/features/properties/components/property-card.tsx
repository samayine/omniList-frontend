import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property, Status } from "@/types";

type PropertyCardProps = {
  property: Property;
};

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const baseUrl = apiUrl.replace(/\/api$/, "");
  return `${baseUrl}${url}`;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const firstImage = property.images?.[0] 
    ? getImageUrl(property.images[0].url)
    : "/placeholder.svg";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm text-zinc-800"
              >
                Draft
              </Badge>
            )}
            {property.status === Status.ARCHIVED && (
              <Badge
                variant="destructive"
                className="bg-red-500/90 backdrop-blur-sm"
              >
                Archived
              </Badge>
            )}
          </div>
          {property.propertyType && (
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-black/60 backdrop-blur-md text-white border-white/20 capitalize font-medium text-xs">
                {property.propertyType.toLowerCase()}
              </Badge>
            </div>
          )}
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

        {(property.bedrooms != null || property.bathrooms != null || property.areaSqFt != null) && (
          <CardFooter className="px-4 py-3 text-muted-foreground text-xs flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-4 text-xs font-medium">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                  <Bed className="h-3.5 w-3.5 text-muted-foreground" />
                  {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
                </span>
              )}
              {property.bathrooms != null && (
                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                  <Bath className="h-3.5 w-3.5 text-muted-foreground" />
                  {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
                </span>
              )}
              {property.areaSqFt != null && (
                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                  <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {property.areaSqFt.toLocaleString()} sq ft
                </span>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
