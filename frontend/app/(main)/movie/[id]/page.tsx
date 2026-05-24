'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchMovieById, fetchSimilar } from '@/lib/tmdb';
import { movieService } from '@/services/movie.service';
import MovieDetailClient from './MovieDetailClient';
import type { Movie } from '@/types/movie';
import AppShell from '@/components/layout/AppShell';

export default function MovieDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [movie, setMovie] = useState<Movie | null | undefined>(undefined); // undefined = loading
  const [similar, setSimilar] = useState<Movie[]>([]);

  useEffect(() => {
    const load = async () => {
      // 1. Try local backend DB first (fast, always works)
      const dbMovie = await movieService.getById(id);
      if (dbMovie) {
        setMovie(dbMovie);
        const sim = await movieService.getSimilar(id).catch(() => [] as Movie[]);
        setSimilar(sim);
        return;
      }

      // 2. DB doesn't have it (e.g. live TMDB trending movie) — try TMDB from browser
      const [tmdbMovie, tmdbSimilar] = await Promise.all([
        fetchMovieById(id).catch(() => null),
        fetchSimilar(id).catch(() => [] as Movie[]),
      ]);
      setMovie(tmdbMovie);
      setSimilar(tmdbSimilar);
    };

    load();
  }, [id]);

  // Loading state
  if (movie === undefined) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return <MovieDetailClient movie={movie} similar={similar} />;
}
