'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Movie } from '@/types/movie';
import { useAuth } from '@/hooks/useAuth';
import { getBackdropUrl } from '@/lib/tmdb-image';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface HeroBannerProps {
  // Pass top trending/popular movies (up to 5) for rotation
  movies?: Movie[];
  // OR a single movie (legacy — used for login/signup pages etc.)
  movie?: Movie;
}

export default function HeroBanner({ movies, movie }: HeroBannerProps) {
  const router = useRouter();
  const { isAuthenticated, isInMyList, addToMyList, removeFromMyList } = useAuth();
  const [muted,       setMuted]       = useState(true);
  const [guestModal,  setGuestModal]  = useState(false);
  const [currentIdx,  setCurrentIdx]  = useState(0);

  // Build the rotation list — prefer `movies` prop, fall back to single `movie`
  const featured: Movie[] = movies?.slice(0, 5) ?? (movie ? [movie] : []);
  const current = featured[currentIdx] ?? featured[0];

  useEffect(() => {
    if (featured.length <= 1) return;
    const t = setInterval(() => setCurrentIdx(i => (i + 1) % featured.length), 8000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featured.length]);

  if (!current) return null;

  const inList = isInMyList(current.id);

  const handleMyList = () => {
    if (!isAuthenticated) { setGuestModal(true); return; }
    inList ? removeFromMyList(current.id) : addToMyList(current);
  };

  return (
    <>
      <div className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
        {/* Backdrop with crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={  { opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={getBackdropUrl(current.backdrop_path)}
              alt={current.title}
              fill priority
              className="object-cover object-top"
              onError={e => { (e.target as HTMLImageElement).src = '/images/backdrop-fallback.png'; }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Text + buttons */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={  { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute bottom-[18%] left-0 px-6 md:px-14 max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-tight">
              {current.title}
            </h1>
            <div className="flex items-center gap-3 mb-3 text-sm text-gray-300">
              <span className="text-green-400 font-bold">{Math.round(current.vote_average * 10)}% Match</span>
              <span>{new Date(current.release_date).getFullYear()}</span>
              {current.maturity_rating && (
                <span className="border border-gray-500 px-1.5 py-0.5 rounded text-xs">
                  {current.maturity_rating}
                </span>
              )}
            </div>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
              {current.overview}
            </p>
            <div className="flex items-center gap-3">
              <Button size="lg" onClick={() => router.push(`/movie/${current.id}`)} className="gap-2">
                <Play size={18} fill="white" /> Play
              </Button>
              <Button variant="secondary" size="lg" onClick={() => router.push(`/movie/${current.id}`)}>
                <Info size={18} /> More Info
              </Button>
              <button
                onClick={handleMyList}
                className={`flex items-center gap-2 px-4 py-3 rounded font-semibold text-sm border-2 transition-all ${
                  inList ? 'border-white text-white bg-white/20' : 'border-gray-500 text-gray-300 hover:border-white hover:text-white'
                }`}
              >
                {inList ? <Check size={18} /> : <Plus size={18} />}
                {inList ? 'Added' : 'My List'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mute toggle */}
        <button
          onClick={() => setMuted(m => !m)}
          className="absolute bottom-[18%] right-6 md:right-14 w-10 h-10 flex items-center justify-center border-2 border-gray-400 rounded-full text-white hover:border-white transition-colors"
          aria-label="Toggle mute"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Dot indicators */}
        {featured.length > 1 && (
          <div className="absolute bottom-[10%] left-6 md:left-14 flex gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`h-2 rounded-full transition-all ${i === currentIdx ? 'bg-white w-6' : 'bg-gray-600 hover:bg-gray-400 w-2'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Guest modal */}
      <Modal open={guestModal} onClose={() => setGuestModal(false)} title="Sign in to continue">
        <p className="text-gray-300 text-sm mb-5">
          Create a free account to save movies to your list and get personalised picks.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => { setGuestModal(false); router.push('/signup'); }} className="flex-1">
            Create Account
          </Button>
          <Button variant="secondary" onClick={() => { setGuestModal(false); router.push('/login'); }} className="flex-1">
            Sign In
          </Button>
        </div>
      </Modal>
    </>
  );
}
