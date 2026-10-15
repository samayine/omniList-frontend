import { Card, CardContent } from '@/components/ui/card';
import { Building2, Globe, FileText, BarChart3 } from 'lucide-react';
import { Property, Status } from '@/types';

type OwnerMetricsProps = {
  properties: Property[];
};

export function OwnerMetrics({ properties }: OwnerMetricsProps) {
  const total = properties.length;
  const published = properties.filter((p) => p.status === Status.PUBLISHED).length;
  const drafts = properties.filter((p) => p.status === Status.DRAFT).length;
  const totalValue = properties.reduce((sum, p) => sum + p.price, 0);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const cards = [
    { title: 'Total Properties', value: total.toString(), icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active Listings', value: published.toString(), icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'In Draft', value: drafts.toString(), icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Portfolio Value', value: formatter.format(totalValue), icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i} className="border-none shadow-sm dark:bg-zinc-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bg}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
