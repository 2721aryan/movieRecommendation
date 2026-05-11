'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Film } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { APP_NAME } from '@/lib/constants';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router    = useRouter();
  const { login, signup, isLoading } = useAuth();
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      router.push('/profile/select');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <Film className="text-red-600" size={24} />
        <span className="text-red-600 font-black text-xl">{APP_NAME}</span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-1">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        {mode === 'login' ? "Sign in to continue watching" : "Start your free trial today"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-3 top-[34px] text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button type="submit" size="lg" loading={isLoading} className="w-full mt-2">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        {mode === 'login' ? (
          <p className="text-gray-400 text-sm">
            New to {APP_NAME}?{' '}
            <Link href="/signup" className="text-white hover:text-red-400 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-red-400 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        )}
      </div>

      {/* Continue as guest */}
      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/browse')}
          className="text-gray-500 hover:text-gray-300 text-xs transition-colors underline underline-offset-2"
        >
          Continue browsing as guest
        </button>
      </div>
    </motion.div>
  );
}
