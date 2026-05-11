import AuthForm from '@/components/auth/AuthForm';
import Image from 'next/image';
import { getBackdropUrl } from '@/lib/tmdb-image';
import { MOCK_MOVIES } from '@/lib/mock-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — CineAI',
  description: 'Create your free CineAI account and start discovering movies.',
};

export default function SignupPage() {
  const bg = MOCK_MOVIES[3];
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <Image
        src={getBackdropUrl(bg.backdrop_path)}
        alt="Background"
        fill
        priority
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-black/40" />
      <div className="relative z-10 w-full max-w-md">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
