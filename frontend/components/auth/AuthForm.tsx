'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import { APP_NAME } from '@/lib/constants';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

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
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      /* Netflix card: rounded corners, black bg at 75% opacity */
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
        borderRadius: '4px',
        padding: '60px 68px 40px',
        width: '100%',
        maxWidth: '450px',
      }}
    >
      {/* ── App Name (top-left, Netflix red) ── */}
      <Link href="/" className="block" style={{ marginBottom: '28px' }}>
        <span
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#e50914',
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}
        >
          {APP_NAME}
        </span>
      </Link>

      {/* ── Page heading ── */}
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '28px',
          lineHeight: 1.1,
        }}
      >
        {mode === 'login' ? 'Sign In' : 'Sign Up'}
      </h1>

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {/* Name field (signup only) */}
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.25 }}
          >
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </motion.div>
        )}

        {/* Email */}
        <Input
          label="Email or mobile number"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        {/* Password */}
        <div className="relative">
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {/* Show/hide toggle */}
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            aria-label="Toggle password visibility"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8c8c8c',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: '#e87c03',
              fontSize: '13px',
              background: 'rgba(232, 124, 3, 0.08)',
              border: '1px solid rgba(232, 124, 3, 0.3)',
              borderRadius: '4px',
              padding: '10px 14px',
              margin: '0',
            }}
          >
            {error}
          </motion.p>
        )}

        {/* ── Submit button (Netflix red, full-width) ── */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ filter: 'brightness(1.08)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            marginTop: '8px',
            width: '100%',
            height: '56px',
            background: '#e50914',
            color: '#fff',
            fontWeight: 700,
            fontSize: '16px',
            borderRadius: '4px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            letterSpacing: '0.02em',
            transition: 'opacity 0.15s',
          }}
        >
          {isLoading
            ? 'Please wait…'
            : mode === 'login'
            ? 'Sign In'
            : 'Sign Up'}
        </motion.button>
      </form>

      {/* ── "OR" divider (login) ── */}
      {mode === 'login' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: '#404040' }} />
          <span style={{ color: '#737373', fontSize: '13px', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#404040' }} />
        </div>
      )}

      {/* ── Use a code button (login) ── */}
      {mode === 'login' && (
        <button
          onClick={() => router.push('/browse')}
          style={{
            marginTop: '12px',
            width: '100%',
            height: '48px',
            background: 'rgba(109, 109, 110, 0.7)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '15px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          Browse as Guest
        </button>
      )}

      {/* ── Forgot password (login) ── */}
      {mode === 'login' && (
        <p style={{ color: '#b3b3b3', fontSize: '13px', marginTop: '12px', textAlign: 'right' }}>
          <Link
            href="/forgot-password"
            style={{ color: '#fff', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            Forgot password?
          </Link>
        </p>
      )}

      {/* ── Auth switch link ── */}
      <p style={{ color: '#737373', fontSize: '15px', marginTop: '60px' }}>
        {mode === 'login' ? (
          <>
            New to {APP_NAME}?{' '}
            <Link
              href="/signup"
              style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              Sign up now.
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              Sign in.
            </Link>
          </>
        )}
      </p>

      {/* ── CAPTCHA disclaimer (Netflix has this) ── */}
      <p
        style={{
          color: '#737373',
          fontSize: '13px',
          marginTop: '16px',
          lineHeight: 1.5,
        }}
      >
        This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.{' '}
        <span style={{ color: '#0071eb', cursor: 'pointer' }}>Learn more.</span>
      </p>
    </motion.div>
  );
}