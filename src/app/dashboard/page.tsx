'use client';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>You are logged in as {user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">Role: <span className="text-primary">{user?.role}</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-md">
             <p className="text-muted-foreground italic">Property metrics coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
