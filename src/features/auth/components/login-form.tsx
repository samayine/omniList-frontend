'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { ShieldCheck, Building2, User, Loader2, Sparkles, Coffee } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { loginApi } from '../api/auth-api';
import { useAuthStore } from '../store/auth-store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN',
    badge: 'Admin',
    email: 'admin@omnilist.local',
    password: 'Admin@123',
    icon: ShieldCheck,
    color: 'text-purple-600 dark:text-purple-400',
    border: 'hover:border-purple-500/50 hover:bg-purple-500/5',
    tag: 'Platform metrics & moderation',
  },
  {
    role: 'OWNER',
    badge: 'Owner',
    email: 'owner@omnilist.local',
    password: 'Owner@123',
    icon: Building2,
    color: 'text-blue-600 dark:text-blue-400',
    border: 'hover:border-blue-500/50 hover:bg-blue-500/5',
    tag: 'Create, edit & publish listings',
  },
  {
    role: 'USER',
    badge: 'Buyer',
    email: 'buyer@omnilist.local',
    password: 'Buyer@123',
    icon: User,
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
    tag: 'Browse & saved favorites',
  },
];

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const wakeUpTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const executeLogin = async (email: string, pass: string, roleBadge?: string) => {
    setIsLoading(true);
    setIsWakingUp(false);

    // If server is on Render free-tier, it might take 15-20s to wake up on first call
    wakeUpTimerRef.current = setTimeout(() => {
      setIsWakingUp(true);
    }, 2500);

    try {
      const response = await loginApi(email, pass);
      login(response.accessToken, response.user);
      toast.success(roleBadge ? `Logged in as ${roleBadge}!` : 'Successfully logged in!');
      const role = response.user?.role;
      router.push(role === 'USER' ? '/' : '/dashboard');
    } catch (error: unknown) {
      let message = 'Login failed. Please check your credentials.';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      if (wakeUpTimerRef.current) {
        clearTimeout(wakeUpTimerRef.current);
      }
      setIsLoading(false);
      setActiveDemoRole(null);
      setIsWakingUp(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    await executeLogin(data.email, data.password);
  };

  const handleQuickLogin = async (demo: typeof DEMO_ACCOUNTS[number]) => {
    setValue('email', demo.email, { shouldValidate: true });
    setValue('password', demo.password, { shouldValidate: true });
    setActiveDemoRole(demo.role);
    await executeLogin(demo.email, demo.password, demo.badge);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <Badge variant="outline" className="text-xs font-normal text-muted-foreground gap-1">
            <Sparkles className="h-3 w-3 text-primary" />
            Live Demo
          </Badge>
        </div>
        <CardDescription>
          Choose a 1-click test role below, or enter your credentials.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Demo Logins for Evaluators */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick 1-Click Access
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((demo) => {
              const Icon = demo.icon;
              const isSelected = activeDemoRole === demo.role && isLoading;
              return (
                <button
                  key={demo.role}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickLogin(demo)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all bg-card ${demo.border} ${
                    isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isSelected ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary mb-1" />
                  ) : (
                    <Icon className={`h-5 w-5 mb-1 ${demo.color}`} />
                  )}
                  <span className="font-semibold text-xs text-foreground">{demo.badge}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                    {demo.tag.split('&')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cold-start notification */}
        {isWakingUp && (
          <div className="flex items-center gap-2 p-3 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg animate-in fade-in duration-300">
            <Coffee className="h-4 w-4 flex-shrink-0 animate-bounce" />
            <span>Waking up cloud backend (Render instances may take ~20s on first spin)...</span>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">Or with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && !activeDemoRole ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 pt-0">
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-normal text-primary"
            onClick={() => router.push('/register')}
          >
            Create account
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
