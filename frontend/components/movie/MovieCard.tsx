'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, ThumbsUp, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Movie } from '@/types/movie';
import { useAuth } from '@/hooks/useAuth';
import { getPosterUrl, getBackdropUrl } from '@/lib/tmdb-image';
import { formatYear, formatRuntime } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface MovieCardProps {
  movie: Movie;
}

// The hover popup is rendered via a portal into document.body so it is
// completely outside the overflow-x scroll container — this prevents the
// dual-axis scroll glitch.
function HoverPopup({
  movie,
  rect,
  onClose,
  onProtected,
  inList,
  liked,
  onToggleList,
  onToggleLike,
}: {
  movie: Movie;
  rect: DOMRect;
  onClose: () => void;
  onProtected: (action: () => void) => void;
  inList: boolean;
  liked: boolean;
  onToggleList: () => void;
  onToggleLike: () => void;
}) {
  const router = useRouter();
  const POPUP_WIDTH = 256;

  // Calculate position — stay within viewport
  const viewportW  = typeof window !== 'undefined' ? window.innerWidth : 1200;
  let left = rect.left + rect.width / 2 - POPUP_WIDTH / 2;
  left = Math.max(8, Math.min(left, viewportW - POPUP_WIDTH - 8));
  const top = rect.bottom + 8;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={movie.id}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={  { opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        style={{ position: 'fixed', top, left, width: POPUP_WIDTH, zIndex: 9999 }}
        className="bg-gray-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden"
        onMouseLeave={onClose}
        onClick={e => e.stopPropagation()}
      >
        {/* Mini backdrop */}
        <div className="relative h-32">
          <Image
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            fill
            className="object-cover"
            onError={e => { (e.target as HTMLImageElement).src = '/images/backdrop-fallback.png'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-white font-bold text-sm leading-tight line-clamp-1">{movie.title}</p>
          </div>
        </div>

        <div className="p-3">
          {/* Action buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => router.push(`/movie/${movie.id}`)}
              className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-black hover:bg-gray-200 transition-colors"
              aria-label="Play"
            >
              <Play size={14} fill="black" />
            </button>
            <button
              onClick={() => onProtected(onToggleList)}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                inList ? 'border-white text-white bg-white/20' : 'border-gray-500 text-gray-400 hover:border-white hover:text-white'
              }`}
              aria-label={inList ? 'Remove from list' : 'Add to list'}
            >
              {inList ? <Check size={14} /> : <Plus size={14} />}
            </button>
            <button
              onClick={() => onProtected(onToggleLike)}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                liked ? 'border-green-400 text-green-400' : 'border-gray-500 text-gray-400 hover:border-white hover:text-white'
              }`}
              aria-label="Like"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              onClick={() => router.push(`/movie/${movie.id}`)}
              className="ml-auto flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-500 text-gray-400 hover:border-white hover:text-white transition-colors"
              aria-label="More info"
            >
              <Info size={14} />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 flex-wrap">
            <span className="text-green-400 font-semibold">{Math.round(movie.vote_average * 10)}% Match</span>
            <span>{formatYear(movie.release_date)}</span>
            {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
            {movie.maturity_rating && (
              <span className="border border-gray-500 px-1 rounded text-[10px]">{movie.maturity_rating}</span>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map(g => (
              <span key={g.id} className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const { isAuthenticated, isInMyList, addToMyList, removeFromMyList, isLiked, toggleLike } = useAuth();
  const [hovered,    setHovered]    = useState(false);
  const [cardRect,   setCardRect]   = useState<DOMRect | null>(null);
  const [guestModal, setGuestModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const inList = isInMyList(movie.id);
  const liked  = isLiked(movie.id);

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    if (cardRef.current) setCardRect(cardRef.current.getBoundingClientRect());
    setHovered(true);
  };

  const handleMouseLeave = () => {
    // Small delay so user can move into the popup
    leaveTimer.current = setTimeout(() => setHovered(false), 80);
  };

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const handleProtected = (action: () => void) => {
    if (!isAuthenticated) { setGuestModal(true); return; }
    action();
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        className="relative flex-shrink-0 w-44 md:w-52 lg:w-56 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={() => router.push(`/movie/${movie.id}`)}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
          <Image
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 176px, 224px"
            onError={e => { (e.target as HTMLImageElement).src = '/images/poster-fallback.png'; }}
          />
          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
            ★ {movie.vote_average.toFixed(1)}
          </div>
          {/* Bottom title overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs font-semibold line-clamp-2">{movie.title}</p>
          </div>
        </div>
        {/* Title below poster */}
        <p className="text-gray-300 text-xs font-medium mt-1.5 truncate px-0.5">{movie.title}</p>
      </motion.div>

      {/* Hover popup — portal-rendered to escape overflow-x container */}
      {hovered && cardRect && (
        <HoverPopup
          movie={movie}
          rect={cardRect}
          onClose={() => setHovered(false)}
          onProtected={handleProtected}
          inList={inList}
          liked={liked}
          onToggleList={() => inList ? removeFromMyList(movie.id) : addToMyList(movie)}
          onToggleLike={() => toggleLike(movie.id)}
        />
      )}

      {/* Guest modal */}
      <Modal open={guestModal} onClose={() => setGuestModal(false)} title="Sign in to continue">
        <p className="text-gray-300 text-sm mb-5">
          Create a free account to save movies to your list and like your favourites.
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
