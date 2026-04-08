import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata = {
  title: 'Register - OmniList',
  description: 'Create a new account on OmniList to start listing or favoriting properties.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            OmniList
          </h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
