'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ListVideo, Star, TrendingUp } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { MOCK_MOVIES } from '@/lib/mock-data';
import { getBackdropUrl } from '@/lib/tmdb-image';
import Image from 'next/image';

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
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-14 h-16 bg-gradient-to-b from-black to-transparent">
        <span className="text-red-600 font-black text-2xl tracking-tight">{APP_NAME}</span>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background collage */}
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-1 opacity-20">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black" />

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
            Find Movies<br />
            <span className="text-red-500">You&apos;ll Love</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
            Explore thousands of movies, build your watchlist, and get personalised picks just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-base w-full sm:w-auto justify-center"
            >
              <Play size={18} fill="white" /> Start Watching
            </Link>
            <Link
              href="/browse"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base w-full sm:w-auto justify-center backdrop-blur-sm"
            >
              Browse Movies
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-14 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Why <span className="text-red-500">{APP_NAME}</span>?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 hover:border-red-600/40 transition-colors"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-red-600/10 border-y border-red-600/20">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Ready to start?</h2>
          <p className="text-gray-300 mb-6 text-sm">Free forever. No credit card required.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors"
          >
            <Play size={16} fill="white" /> Create Free Account
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/5">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
