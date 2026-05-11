'use client';

import { useState, useEffect, useMemo } from 'react';
import { Movie, MovieRow } from '@/types/movie';

// ── Browse page rows ──────────────────────────────────────────────────────────
// Called from a server component — data is pre-fetched and passed as props.
// This hook is kept for components that need client-side state on top of
// the server-fetched data (e.g. real-time watchlist filtering).

export function useMovies(initialMovies?: Movie[], initialRows?: MovieRow[]) {
  const [movies] = useState<Movie[]>(initialMovies ?? []);
  const [rows]   = useState<MovieRow[]>(initialRows ?? []);
  return { movies, rows, loading: false };
}

// ── Single movie + similar ────────────────────────────────────────────────────
export function useMovieById(id: number, initial?: Movie | null, initialSimilar?: Movie[]) {
  const [movie]   = useState<Movie | null>(initial ?? null);
  const [similar] = useState<Movie[]>(initialSimilar ?? []);
  return { movie, similar, loading: false };
}
