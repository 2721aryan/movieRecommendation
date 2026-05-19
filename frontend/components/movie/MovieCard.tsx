'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ThumbsUp, ThumbsDown, Check, ChevronDown } from 'lucide-react';
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

// ─── Netflix-style hover card ─────────────────────────────────────────────────
// Rendered via portal so it escapes the overflow-x scroll container.
// Positioned to COVER the original card (starts at rect.top, not rect.bottom)
// so there is zero gap for the mouse to accidentally cross.
function HoverCard({
  movie,
  rect,
  onEnter,
  onLeave,
  onProtected,
  inList,
  liked,
  disliked,
  onToggleList,
  onToggleLike,
  onToggleDislike,
}: {
  movie: Movie;
  rect: DOMRect;
  onEnter: () => void;
  onLeave: () => void;
  onProtected: (action: () => void) => void;
  inList: boolean;
  liked: boolean;
  disliked: boolean;
  onToggleList: () => void;
  onToggleLike: () => void;
  onToggleDislike: () => void;
}) {
  const router = useRouter();

  // Card expands to 1.45× the original width, minimum 320px
  const POPUP_W = Math.max(320, rect.width * 1.45);
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 900;

  // Centre the popup horizontally over the original card
  let left = rect.left + rect.width / 2 - POPUP_W / 2;
  left = Math.max(8, Math.min(left, viewportW - POPUP_W - 8));

  // Start at the card's top — this is the key: NO gap between card and popup
  // If the popup would overflow below the viewport, shift it up.
  const POPUP_ESTIMATED_H = rect.height + 110; // image + controls
  let top = rect.top;
  if (top + POPUP_ESTIMATED_H > viewportH - 8) {
    top = Math.max(8, viewportH - POPUP_ESTIMATED_H - 8);
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={movie.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top,
          left,
          width: POPUP_W,
          zIndex: 9999,
          transformOrigin: 'top center',
        }}
        className="rounded-xl shadow-2xl overflow-hidden bg-[#181818] border border-white/10"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Backdrop image (replaces the poster at the top) ── */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: rect.height }}
        >
          <Image
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            fill
            className="object-cover"
            onError={e => {
              const t = e.target as HTMLImageElement;
              if (!t.src.includes('backdrop-fallback')) t.src = '/images/backdrop-fallback.png';
            }}
          />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

          {/* Play on click */}
          <button
            className="absolute inset-0 w-full h-full flex items-center justify-center group/play"
            onClick={() => router.push(`/movie/${movie.id}`)}
            aria-label="Play"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-opacity">
              <Play size={20} className="text-white" fill="white" />
            </div>
          </button>

          {/* Title over gradient */}
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-white font-bold text-sm leading-tight line-clamp-1">
              {movie.title}
            </p>
          </div>
        </div>

        {/* ── Controls & meta ── */}
        <div className="px-3 pt-3 pb-3">

          {/* Single row of icon circles */}
          <div className="flex items-center gap-2 mb-3">

            {/* Play */}
            <button
              onClick={() => router.push(`/movie/${movie.id}`)}
              className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-black hover:bg-gray-200 transition-colors flex-shrink-0"
              aria-label="Play"
            >
              <Play size={16} fill="black" />
            </button>

            {/* Add / Remove from list */}
            <button
              onClick={() => onProtected(onToggleList)}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${
                inList
                  ? 'border-white text-white bg-white/20'
                  : 'border-gray-500 text-gray-400 hover:border-white hover:text-white'
              }`}
              aria-label={inList ? 'Remove from list' : 'Add to list'}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>

            {/* Like */}
            <button
              onClick={() => onProtected(onToggleLike)}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${
                liked
                  ? 'border-green-400 text-green-400 bg-green-400/10'
                  : 'border-gray-500 text-gray-400 hover:border-white hover:text-white'
              }`}
              aria-label="Like"
            >
              <ThumbsUp size={16} />
            </button>

            {/* Dislike */}
            <button
              onClick={() => onProtected(onToggleDislike)}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${
                disliked
                  ? 'border-red-400 text-red-400 bg-red-400/10'
                  : 'border-gray-500 text-gray-400 hover:border-white hover:text-white'
              }`}
              aria-label="Dislike"
            >
              <ThumbsDown size={16} />
            </button>

            {/* More Info — pushed to right */}
            <button
              onClick={() => router.push(`/movie/${movie.id}`)}
              className="ml-auto flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-500 text-gray-400 hover:border-white hover:text-white transition-all flex-shrink-0"
              aria-label="More info"
            >
              <ChevronDown size={16} />
            </button>

          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 text-xs mb-2 flex-wrap">
            <span className="text-green-400 font-bold">
              {Math.round(movie.vote_average * 10)}% Match
            </span>
            <span className="text-gray-400">{formatYear(movie.release_date)}</span>
            {movie.runtime && (
              <span className="text-gray-400">{formatRuntime(movie.runtime)}</span>
            )}
            {movie.maturity_rating && (
              <span className="border border-gray-600 text-gray-400 px-1 rounded text-[10px]">
                {movie.maturity_rating}
              </span>
            )}
          </div>

          {/* Genre dots */}
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((g, i) => (
              <span key={g.id} className="flex items-center gap-1 text-[11px] text-gray-300">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-gray-500 inline-block" />}
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

// ─── Main MovieCard ───────────────────────────────────────────────────────────
export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const { isAuthenticated, isInMyList, addToMyList, removeFromMyList, isLiked, toggleLike, isDisliked, toggleDislike } =
    useAuth();

  const [hovered, setHovered] = useState(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const [guestModal, setGuestModal] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const inList   = isInMyList(movie.id);
  const liked    = isLiked(movie.id);
  const disliked = isDisliked(movie.id);

  const clearLeave = useCallback(() => clearTimeout(leaveTimer.current), []);

  const scheduleClose = useCallback(() => {
    // 120ms grace period — enough to move from card edge into popup
    leaveTimer.current = setTimeout(() => setHovered(false), 120);
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearLeave();
    if (cardRef.current) setCardRect(cardRef.current.getBoundingClientRect());
    setHovered(true);
  }, [clearLeave]);

  const handleMouseLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  // Close popup on ANY scroll or wheel input:
  //  - document capture: catches scroll on the horizontal row div (scroll doesn't bubble
  //    so window capture misses it, but document capture is close enough to the target)
  //  - wheel: fires on trackpad horizontal swipe before the div even scrolls
  //  - rowscroll: custom event from MovieRow for programmatic scrollBy() calls
  useEffect(() => {
    const close = () => {
      clearTimeout(leaveTimer.current);
      setHovered(false);
    };
    document.addEventListener('scroll', close, { passive: true, capture: true });
    window.addEventListener('wheel',     close, { passive: true });
    window.addEventListener('rowscroll', close);
    return () => {
      document.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('wheel',     close);
      window.removeEventListener('rowscroll', close);
    };
  }, []);

  const handleProtected = (action: () => void) => {
    if (!isAuthenticated) { setGuestModal(true); return; }
    action();
  };

  return (
    <>
      {/* ── Original card (poster) ── */}
      <motion.div
        ref={cardRef}
        className="relative flex-shrink-0 w-44 md:w-52 lg:w-56 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // When the popup is shown it covers the card, so we suppress the
        // card's own scale — the popup provides the visual expansion.
        animate={{ scale: hovered ? 1 : 1 }}
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
            onError={e => {
              const t = e.target as HTMLImageElement;
              if (!t.src.includes('poster-fallback')) t.src = '/images/poster-fallback.png';
            }}
          />
          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        </div>

        {/* Title below poster */}
        <p className="text-gray-300 text-xs font-medium mt-1.5 truncate px-0.5">
          {movie.title}
        </p>
      </motion.div>

      {/* ── Netflix-style hover card (portal) ── */}
      {hovered && cardRect && (
        <HoverCard
          movie={movie}
          rect={cardRect}
          onEnter={clearLeave}
          onLeave={scheduleClose}
          onProtected={handleProtected}
          inList={inList}
          liked={liked}
          disliked={disliked}
          onToggleList={() => (inList ? removeFromMyList(movie.id) : addToMyList(movie))}
          onToggleLike={() => toggleLike(movie.id)}
          onToggleDislike={() => toggleDislike(movie.id)}
        />
      )}

      {/* ── Guest modal ── */}
      <Modal open={guestModal} onClose={() => setGuestModal(false)} title="Sign in to continue">
        <p className="text-gray-300 text-sm mb-5">
          Create a free account to save movies to your list and like your favourites.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => { setGuestModal(false); router.push('/signup'); }}
            className="flex-1"
          >
            Create Account
          </Button>
          <Button
            variant="secondary"
            onClick={() => { setGuestModal(false); router.push('/login'); }}
            className="flex-1"
          >
            Sign In
          </Button>
        </div>
      </Modal>
    </>
  );
}
