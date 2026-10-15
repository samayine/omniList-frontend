// Mirrors the backend Prisma enums and models

export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  USER = 'USER',
}

export enum Status {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  CONDO = 'CONDO',
  VILLA = 'VILLA',
  TOWNHOUSE = 'TOWNHOUSE',
  COMMERCIAL = 'COMMERCIAL',
}

export type User = {
  id: string;
  email: string;
  role: Role;
};

export type PropertyImage = {
  id: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  order: number;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  status: Status;
  propertyType?: PropertyType;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqFt?: number | null;
  amenities?: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: User;
  images: PropertyImage[];
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};
