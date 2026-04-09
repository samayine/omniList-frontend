'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImagesApi, createPropertyApi } from '@/features/properties/api/properties-api';

const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export function PropertyForm() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file) => file.size <= 5 * 1024 * 1024);

      if (validFiles.length !== newFiles.length) {
        toast.warning('Some files were rejected (max size: 5MB).');
      }

      if (selectedFiles.length + validFiles.length > 10) {
        toast.error('You can only upload up to 10 images.');
        return;
      }

      const mergedFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(mergedFiles);

      // Extract thumbnails safely
      const newThumbnails = validFiles.map((file) => URL.createObjectURL(file));
      setThumbnails((prev) => [...prev, ...newThumbnails]);
    }
  }, [selectedFiles]);

  const removeFile = (index: number) => {
    URL.revokeObjectURL(thumbnails[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setThumbnails((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormValues) => {
    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one image.');
      return;
    }

    try {
      setIsUploading(true);
      
      // Stage 1: Upload Images natively via multipart/form-data
      toast.info('Uploading images...');
      const uploadedImageMeta = await uploadImagesApi(selectedFiles);

      // Stage 2: Create precise Property DB Record mapped with new image URIs
      toast.info('Saving property details...');
      await createPropertyApi({
        ...data,
        images: uploadedImageMeta,
      });

      toast.success('Property successfully created!');
      router.push('/dashboard');
      router.refresh();
      
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to create property';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title <span className="text-red-500">*</span></Label>
          <Input id="title" placeholder="e.g. Modern Architecture Villa" disabled={isUploading} {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <Label htmlFor="price">Ask Price (USD) <span className="text-red-500">*</span></Label>
            <Input id="price" type="number" placeholder="450000" disabled={isUploading} {...register('price')} />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
            <Input id="location" placeholder="Beverly Hills, CA" disabled={isUploading} {...register('location')} />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description <span className="text-red-500">*</span></Label>
          <textarea
            id="description"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            placeholder="Describe the overarching amenities and style..."
            disabled={isUploading}
            {...register('description')}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
      </div>

      {/* Image Uploader */}
      <div className="space-y-4">
        <Label>Property Images <span className="text-red-500">*</span></Label>
        
        <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/40 hover:bg-muted/80 transition-colors relative cursor-pointer group">
           <Input 
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              multiple 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleFileChange}
              disabled={isUploading || selectedFiles.length >= 10}
           />
           <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors pointer-events-none">
              <UploadCloud className="w-10 h-10 mb-2" />
              <p className="font-medium text-sm">Drag & drop files or click to browse</p>
              <p className="text-xs">Supports JPG, PNG and WebP (Max 5MB each, up to 10 files)</p>
           </div>
        </div>

        {/* Thumbnail Preview Grid */}
        {thumbnails.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
            {thumbnails.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border shadow-sm group">
                <Image src={url} alt={`preview-${i}`} fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  disabled={isUploading}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button size="lg" type="submit" disabled={isUploading} className="min-w-[150px]">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            'Publish Listing'
          )}
        </Button>
      </div>
    </form>
  );
}
