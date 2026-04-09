import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Manage your platform preferences and notification protocols.
        </p>
      </div>

      <div className="bg-card border rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
         <SettingsIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
         <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
         <p className="text-muted-foreground max-w-sm mb-6">
            The settings portal is currently under active development and will be rolled out in an upcoming pipeline phase.
         </p>
         <Button variant="secondary" disabled>Settings Locked</Button>
      </div>
    </div>
  );
}
