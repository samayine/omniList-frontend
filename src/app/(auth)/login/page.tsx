import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Login - OmniList',
  description: 'Login to your account to manage your listings and favorites.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl hover:text-primary transition-colors">
              OmniList<span className="text-primary">.</span>
            </h1>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">← Back to home</Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
