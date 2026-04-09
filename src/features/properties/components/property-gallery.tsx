'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PropertyImage } from '@/types';
import { cn } from '@/lib/utils';

type PropertyGalleryProps = {
  images: PropertyImage[];
  title: string;
};

const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  return apiUrl.replace(/\/api$/, '');
};

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full max-h-[600px] bg-muted rounded-2xl overflow-hidden flex items-center justify-center border">
         <span className="text-muted-foreground font-medium">No Images Available</span>
      </div>
    );
  }

  const baseUrl = getBaseUrl();
  const getImageUrl = (url: string) => url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const activeImage = getImageUrl(images[activeIndex].url);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="relative aspect-[16/9] w-full max-h-[600px] bg-black rounded-2xl overflow-hidden shadow-md group">
        <Image
          src={activeImage}
          alt={`${title} - View ${activeIndex + 1}`}
          fill
          className="object-contain transition-opacity duration-500"
          sizes="(max-width: 1200px) 100vw, 1200px"
          unoptimized
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar">
          {images.map((image, idx) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-24 w-36 flex-shrink-0 snap-start bg-muted rounded-lg overflow-hidden transition-all duration-200 border-2",
                activeIndex === idx ? "border-primary ring-2 ring-primary/20 ring-offset-1" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={getImageUrl(image.url)}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="150px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
