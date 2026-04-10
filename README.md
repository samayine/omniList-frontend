# OmniList Frontend

A property listing and management interface built with **Next.js**, **Tailwind CSS**, and **TanStack Query**.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query & Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Related Repository
This is the frontend client for the OmniList platform. The backend API repository can be found here:
**[OmniList Backend](https://github.com/samayine/omniList)**

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

## Key Features

- **Public Listings**: Browse and filter properties by price and keyword.
- **User Dashboard**: Secure area for owners to manage their property listings.
- **Property Creator**: Form with image upload support for adding new properties.
- **Authenticaton**: Role-based access for different user types (Admin, Owner, User).
