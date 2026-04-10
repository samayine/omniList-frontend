import { ClientFavorites } from '@/features/dashboard/components/client-favorites';
import { PageHeader } from '@/components/ui/page-header';

export const metadata = {
  title: 'My Favorites — OmniList',
  description: 'Your saved property listings on OmniList.',
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="My Favorites"
          description="Your curated collection of saved properties."
          showHomeLink={true}
        />
        <ClientFavorites />
      </div>
    </div>
  );
}
