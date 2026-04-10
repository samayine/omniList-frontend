'use client';

import { Settings as SettingsIcon, User as UserIcon, Mail, Shield } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6 max-w-4xl pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Manage your platform preferences and profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-semibold border-b pb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> Email Address</Label>
                <Input value={user?.email || ''} disabled className="bg-muted/50" />
                <p className="text-xs text-muted-foreground">Your email is used for login and notifications.</p>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="flex items-center gap-2"><Shield className="w-4 h-4 text-muted-foreground" /> Access Role</Label>
                <Input value={user?.role || ''} disabled className="bg-muted/50 capitalize" />
              </div>

              <div className="space-y-2 pt-2">
                <Label className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-muted-foreground" /> Account ID</Label>
                <Input value={user?.id || ''} disabled className="bg-muted/50 font-mono text-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="md:col-span-1">
          <div className="bg-muted/30 border rounded-2xl p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
             <SettingsIcon className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
             <h3 className="text-lg font-medium mb-2">Profile Updates</h3>
             <p className="text-sm text-muted-foreground mb-6">
                Direct profile and password updates are currently locked. 
             </p>
             <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
