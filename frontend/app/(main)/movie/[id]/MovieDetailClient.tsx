'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Plus, Check, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import MovieMeta from '@/components/movie/MovieMeta';
import SimilarMoviesRow from '@/components/movie/SimilarMoviesRow';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb-image';
import type { Movie } from '@/types/movie';

interface Props {
  movie: Movie | null;
  similar: Movie[];
}

export default function MovieDetailClient({ movie, similar }: Props) {
  const router = useRouter();
  const {
    isAuthenticated,
    isInMyList, addToMyList, removeFromMyList,
    isLiked, toggleLike,
    isDisliked, toggleDislike,
  } = useAuth();
  const [guestModal, setGuestModal] = useState(false);

  // ── Not found ──
  if (!movie) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-gray-400 text-lg">Movie not found.</p>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
      </AppShell>
    );
  }

  const inList   = isInMyList(movie.id);
  const liked    = isLiked(movie.id);
  const disliked = isDisliked(movie.id);

  const handleProtected = (action: () => void) => {
    if (!isAuthenticated) { setGuestModal(true); return; }
    action();
  };

  return (
    <AppShell>
      {/* Backdrop hero */}
      <div className="relative h-[65vh] min-h-[420px] overflow-hidden">
        <Image
          src={getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          fill priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <button
          onClick={() => router.back()}
          className="absolute top-20 left-4 md:left-12 flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-lg px-3 py-2 backdrop-blur-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Content */}
      <div className="px-4 md:px-12 -mt-36 relative z-10 pb-14">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 w-44 md:w-56 mx-auto md:mx-0"
          >
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                width={224} height={336}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              {movie.title}
            </h1>
            <MovieMeta movie={movie} />
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-4 mb-6 max-w-2xl">
              {movie.overview}
            </p>

            {/* ── Actions — all same style: labeled pill, same height ── */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">

              {/* Play — white pill */}
              <button className="flex items-center gap-2 px-8 py-3 bg-white rounded-lg text-black font-bold text-base hover:bg-gray-100 active:scale-95 transition-all">
                {/* strokeWidth=0 removes Lucide's outline so only the fill shows — clean solid triangle */}
                <Play size={20} fill="currentColor" strokeWidth={0} />
                Play
              </button>

              {/* My List — dark pill */}
              <button
                onClick={() => handleProtected(() => inList ? removeFromMyList(movie.id) : addToMyList(movie))}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-base border transition-all active:scale-95 ${
                  inList
                    ? 'bg-white/20 border-white text-white'
                    : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white'
                }`}
              >
                {inList ? <Check size={20} /> : <Plus size={20} />}
                {inList ? 'In My List' : 'My List'}
              </button>

              {/* Like — dark pill */}
              <button
                onClick={() => handleProtected(() => toggleLike(movie.id))}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-base border transition-all active:scale-95 ${
                  liked
                    ? 'bg-green-500/20 border-green-400 text-green-400'
                    : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white'
                }`}
              >
                <ThumbsUp size={20} />
                {liked ? 'Liked' : 'Like'}
              </button>

              {/* Dislike — dark pill */}
              <button
                onClick={() => handleProtected(() => toggleDislike(movie.id))}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-base border transition-all active:scale-95 ${
                  disliked
                    ? 'bg-red-500/20 border-red-400 text-red-400'
                    : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white'
                }`}
              >
                <ThumbsDown size={20} />
                {disliked ? 'Disliked' : 'Dislike'}
              </button>

            </div>

            {/* Community score */}
            <div className="p-4 bg-gray-900/70 border border-white/10 rounded-xl max-w-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Community Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-700"
                    style={{ width: `${movie.vote_average * 10}%` }}
                  />
                </div>
                <span className="text-green-400 font-bold text-sm">
                  {Math.round(movie.vote_average * 10)}%
                </span>
              </div>
              <p className="text-gray-600 text-xs mt-1.5">
                {movie.vote_count.toLocaleString()} ratings on TMDB
              </p>
            </div>
          </motion.div>
        </div>

        {/* Similar */}
        <div className="mt-12">
          <SimilarMoviesRow movies={similar} />
        </div>
      </div>

      {/* Guest modal */}
      <Modal open={guestModal} onClose={() => setGuestModal(false)} title="Sign in to continue">
        <p className="text-gray-300 text-sm mb-5">
          Create a free account to like movies, save to your watchlist, and track what you want to watch.
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
    </AppShell>
  );
}
