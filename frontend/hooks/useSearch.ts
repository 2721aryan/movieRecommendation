'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie } from '@/types/movie';
import { searchMovies, fetchByGenre } from '@/lib/tmdb';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';

export function useSearch() {
  const [query,    setQuery]   = useState('');
  const [genreId,  setGenreId] = useState<number | null>(null);
  const [results,  setResults] = useState<Movie[]>([]);
  const [loading,  setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query && genreId === null) { setResults([]); return; }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (query.trim()) {
          const res = await searchMovies(query);
          // If genre filter also active, narrow the results
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
