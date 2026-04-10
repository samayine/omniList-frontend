import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

type ClientMetricsProps = {
  favoritesCount: number;
};

export function ClientMetrics({ favoritesCount }: ClientMetricsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-none shadow-sm dark:bg-zinc-900/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Saved Properties</p>
              <p className="text-3xl font-bold tracking-tight">{favoritesCount}</p>
            </div>
            <div className="p-3 rounded-full bg-rose-500/10">
              <Heart className="h-6 w-6 text-rose-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
