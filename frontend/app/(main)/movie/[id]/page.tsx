'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Plus, Check, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import MovieMeta from '@/components/movie/MovieMeta';
import SimilarMoviesRow from '@/components/movie/SimilarMoviesRow';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Loader from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb-image';
import { fetchMovieById, fetchSimilar } from '@/lib/tmdb';
import type { Movie } from '@/types/movie';

export default function MovieDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = Number(params.id);
  const { isAuthenticated, isInMyList, addToMyList, removeFromMyList, isLiked, toggleLike } = useAuth();
  const [movie,       setMovie]       = useState<Movie | null>(null);
  const [similar,     setSimilar]     = useState<Movie[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [guestModal,  setGuestModal]  = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchMovieById(id), fetchSimilar(id)])
      .then(([m, s]) => { setMovie(m); setSimilar(s); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <AppShell><div className="min-h-screen pt-16"><Loader size={48} /></div></AppShell>;
  }

  if (!movie) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Movie not found.</p>
        </div>
      </AppShell>
    );
  }

  const inList = isInMyList(movie.id);
  const liked  = isLiked(movie.id);

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
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{movie.title}</h1>
            <MovieMeta movie={movie} />
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-4 mb-6 max-w-2xl">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Button size="lg" className="gap-2">
                <Play size={18} fill="white" /> Play
              </Button>
              <button
                onClick={() => handleProtected(() => inList ? removeFromMyList(movie.id) : addToMyList(movie))}
                className={`flex items-center gap-2 px-5 py-3 rounded font-semibold text-sm border-2 transition-all ${
                  inList ? 'border-white text-white bg-white/20' : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'
                }`}
              >
                {inList ? <Check size={18} /> : <Plus size={18} />}
                {inList ? 'In My List' : 'My List'}
              </button>
              <button
                onClick={() => handleProtected(() => toggleLike(movie.id))}
                className={`flex items-center gap-2 px-5 py-3 rounded font-semibold text-sm border-2 transition-all ${
                  liked ? 'border-green-400 text-green-400' : 'border-gray-600 text-gray-300 hover:border-white hover:text-white'
                }`}
              >
                <ThumbsUp size={18} /> {liked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={() => handleProtected(() => {})}
                className="flex items-center gap-2 px-5 py-3 rounded font-semibold text-sm border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white transition-all"
              >
                <ThumbsDown size={18} /> Dislike
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
                <span className="text-green-400 font-bold text-sm">{Math.round(movie.vote_average * 10)}%</span>
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
