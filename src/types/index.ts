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
