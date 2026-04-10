import { PropertyList } from '@/features/properties/components/property-list';
import { PublicNav } from '@/components/navigation/public-nav';

async function fetchInitialProperties() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = baseUrl === '/api' ? 'http://localhost:8000/api' : baseUrl || 'http://localhost:8000/api';
  try {
    const res = await fetch(`${apiUrl}/properties?page=1&limit=12`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });
    if (!res.ok) {
      console.error('Failed to fetch initial properties', res.statusText);
      return { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
    }
    return res.json();
  } catch (err) {
    console.error('Error fetching initial properties:', err);
    return { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
  }
}

export default async function Home() {
  const initialData = await fetchInitialProperties();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans pb-24">
      <PublicNav />
      {/* Hero Section */}
      <section className="relative w-full h-[55vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black z-0" />
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-400/20 via-black to-black" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
            Find Your Dream Space.
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-8 font-light">
            Discover a curated collection of premium properties tailored to your lifestyle.
          </p>
        </div>
      </section>

      {/* Main Listing Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyList initialData={initialData} />
      </main>
    </div>
  );
}

