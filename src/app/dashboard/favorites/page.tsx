import { ClientFavorites } from '@/features/dashboard/components/client-favorites';

export default function FavoritesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Favorites</h1>
        <p className="text-muted-foreground text-lg">
          Your curated collection of saved properties and dream spaces.
        </p>
      </div>

      <ClientFavorites />
    </div>
  );
}
