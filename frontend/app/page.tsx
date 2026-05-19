'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ListVideo, Star, TrendingUp } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { MOCK_MOVIES } from '@/lib/mock-data';
import { getBackdropUrl } from '@/lib/tmdb-image';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';

const features = [
  {
    icon: <TrendingUp className="text-red-500" size={28} />,
    title: 'Personalised Recommendations',
    desc:  'Discover movies tailored to your taste based on your watch history, ratings, and preferences.',
  },
  {
    icon: <ListVideo className="text-red-500" size={28} />,
    title: 'Build Your Watchlist',
    desc:  'Save movies to your personal list and never lose track of what you want to watch next.',
  },
  {
    icon: <Star className="text-red-500" size={28} />,
    title: 'Rate & Discover',
    desc:  'Rate movies to fine-tune your recommendations and explore curated lists by genre and mood.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ─── Subtle Navbar (Netflix-style) ──────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: '20px 48px' }}
        >
          <Link href="/">
            <span className="text-red-600 font-black tracking-tight" style={{ fontSize: '28px' }}>
              {APP_NAME}
            </span>
          </Link>
          <div className="flex items-center" style={{ gap: '16px' }}>
            <Link
              href="/login"
              className="text-sm text-gray-200 hover:text-white transition-colors"
              style={{ padding: '8px 12px' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
              style={{ padding: '8px 20px', borderRadius: '4px' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ height: '100vh' }}>
        {/* Background collage */}
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-1 opacity-25">
          {MOCK_MOVIES.slice(0, 12).map(m => (
            <div key={m.id} className="relative overflow-hidden">
              <Image
                src={getBackdropUrl(m.backdrop_path)}
                alt={m.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10 text-center"
          style={{ maxWidth: '720px', padding: '0 24px' }}
        >
          <h1 className="font-black leading-tight" style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: '20px' }}>
            Find Movies<br />
            <span className="text-red-500">You&apos;ll Love</span>
          </h1>
          <p className="text-gray-300 leading-relaxed" style={{ fontSize: '18px', marginBottom: '40px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            Explore thousands of movies, build your watchlist, and get personalised picks just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: '16px' }}>
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors text-base w-full sm:w-auto justify-center"
              style={{ padding: '16px 32px', borderRadius: '8px' }}
            >
              <Play size={18} fill="white" /> Start Watching
            </Link>
            <Link
              href="/browse"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-colors text-base w-full sm:w-auto justify-center backdrop-blur-sm"
              style={{ padding: '16px 32px', borderRadius: '8px' }}
            >
              Browse Movies
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Features ───────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center"
          style={{ marginBottom: '60px' }}
        >
          Why <span className="text-red-500">{APP_NAME}</span>?
        </motion.h2>
        <div className="grid md:grid-cols-3" style={{ gap: '32px' }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-gray-900/60 border border-white/10 hover:border-red-600/40 transition-colors"
              style={{ borderRadius: '16px', padding: '32px' }}
            >
              <div style={{ marginBottom: '20px' }}>{f.icon}</div>
              <h3 className="text-white font-bold text-lg" style={{ marginBottom: '10px' }}>{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-red-600/10 border-y border-red-600/20" style={{ padding: '80px 24px' }}>
        <div className="text-center" style={{ maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 className="text-3xl font-bold" style={{ marginBottom: '16px' }}>Ready to start?</h2>
          <p className="text-gray-300 text-sm" style={{ marginBottom: '32px' }}>Free forever. No credit card required.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
            style={{ padding: '16px 32px', borderRadius: '8px' }}
          >
            <Play size={16} fill="white" /> Create Free Account
          </Link>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
