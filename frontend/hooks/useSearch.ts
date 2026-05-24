'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie } from '@/types/movie';
import { fetchByGenre } from '@/lib/tmdb';
import { SEARCH_DEBOUNCE_MS, API_BASE_URL } from '@/lib/constants';

const API_BASE = API_BASE_URL ?? 'http://localhost:8000';

async function searchMoviesLocal(q: string): Promise<Movie[]> {
  try {
    const res = await fetch(`${API_BASE}/api/movies/search?q=${encodeURIComponent(q)}&limit=40`);
    if (!res.ok) return [];
    return res.json() as Promise<Movie[]>;
  } catch {
    return [];
  }
}

export function useSearch() {
  const [query,    setQuery]   = useState('');
  const [genreId,  setGenreId] = useState<number | null>(null);
  const [results,  setResults] = useState<Movie[]>([]);
  const [loading,  setLoading] = useState(false);

  useEffect(() => {
    if (!query && genreId === null) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (query.trim()) {
          const res = await searchMoviesLocal(query);
          setResults(genreId ? res.filter(m => m.genre_ids.includes(genreId)) : res);
        } else if (genreId !== null) {
          const res = await fetchByGenre(genreId);
          setResults(res);
        }
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, genreId]);

  const handleQuery = useCallback((q: string) => setQuery(q), []);
  const handleGenre = useCallback((id: number | null) => setGenreId(id), []);

  return { query, results, genreId, loading, handleQuery, handleGenre };
}
