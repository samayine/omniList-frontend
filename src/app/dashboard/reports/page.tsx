'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Building2, Globe, Archive, Heart, FileText, TrendingUp } from 'lucide-react';

import { getAdminMetrics } from '@/features/admin/api/admin-api';

import { Card, CardContent } from '@/components/ui/card';

export default function ReportsPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: getAdminMetrics,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-10 w-1/3 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const totalProps = metrics?.properties.total ?? 0;
  const published = metrics?.properties.published ?? 0;
  const draft = metrics?.properties.draft ?? 0;
  const archived = metrics?.properties.archived ?? 0;
  const publishRate = totalProps > 0 ? Math.round((published / totalProps) * 100) : 0;
  const draftRate = totalProps > 0 ? Math.round((draft / totalProps) * 100) : 0;

  const reports = [
    {
      title: 'Property Distribution',
      icon: Building2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      items: [
        { label: 'Published', value: published, bar: publishRate, barColor: 'bg-emerald-500' },
        { label: 'Draft', value: draft, bar: draftRate, barColor: 'bg-amber-500' },
        { label: 'Archived', value: archived, bar: totalProps > 0 ? Math.round((archived / totalProps) * 100) : 0, barColor: 'bg-red-400' },
      ],
    },
    {
      title: 'Platform Health',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      stats: [
        { label: 'Total Users', value: metrics?.users ?? 0, icon: Users },
        { label: 'Total Properties', value: totalProps, icon: Building2 },
        { label: 'Live Listings', value: published, icon: Globe },
        { label: 'Total Favorites', value: metrics?.favorites ?? 0, icon: Heart },
      ],
    },
    {
      title: 'Engagement',
      icon: Heart,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      stats: [
        { label: 'Favorites per User', value: metrics?.users ? (metrics.favorites / metrics.users).toFixed(1) : '0', icon: Heart },
        { label: 'Properties per User', value: metrics?.users ? (totalProps / metrics.users).toFixed(1) : '0', icon: Building2 },
        { label: 'Publish Rate', value: `${publishRate}%`, icon: Globe },
        { label: 'Archive Rate', value: `${totalProps > 0 ? Math.round((archived / totalProps) * 100) : 0}%`, icon: Archive },
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Reports</h1>
        <p className="text-muted-foreground text-lg">
          Platform analytics and performance insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Distribution */}
        <Card className="border-none shadow-sm dark:bg-zinc-900/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${reports[0].bg}`}>
                <Building2 className={`h-5 w-5 ${reports[0].color}`} />
              </div>
              <h3 className="font-semibold text-lg">{reports[0].title}</h3>
            </div>
            <div className="space-y-4">
              {reports[0].items!.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">{item.value} <span className="text-muted-foreground font-normal">({item.bar}%)</span></span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.barColor} rounded-full transition-all duration-700`} style={{ width: `${item.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card className="border-none shadow-sm dark:bg-zinc-900/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${reports[1].bg}`}>
                <TrendingUp className={`h-5 w-5 ${reports[1].color}`} />
              </div>
              <h3 className="font-semibold text-lg">{reports[1].title}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {reports[1].stats!.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="p-3 rounded-xl bg-muted/50">
                    <Icon className="h-4 w-4 text-muted-foreground mb-2" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card className="border-none shadow-sm dark:bg-zinc-900/50 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${reports[2].bg}`}>
                <Heart className={`h-5 w-5 ${reports[2].color}`} />
              </div>
              <h3 className="font-semibold text-lg">{reports[2].title}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reports[2].stats!.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="p-4 rounded-xl bg-muted/50 text-center">
                    <Icon className="h-5 w-5 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
