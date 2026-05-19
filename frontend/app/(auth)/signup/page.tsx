import AuthForm from '@/components/auth/AuthForm';
import AuthBackground from '@/components/auth/AuthBackground';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — NFLIX',
  description: 'Create your free NFLIX account and start discovering movies.',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Rotating TMDB backdrop — fetches trending & crossfades every 2 min */}
      <AuthBackground />

      {/* Form card */}
      <div className="relative z-10 w-full" style={{ maxWidth: '450px', padding: '0 24px' }}>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
