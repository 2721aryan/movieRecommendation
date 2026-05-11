'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import SearchBar from '@/components/search/SearchBar';
import MovieCard from '@/components/movie/MovieCard';
import { useSearch } from '@/hooks/useSearch';
import { GENRES } from '@/lib/constants';
import { SlidersHorizontal } from 'lucide-react';
import Loader from '@/components/ui/Loader';

function SearchContent() {
  const searchParams = useSearchParams();
  const { query, results, genreId, loading, handleQuery, handleGenre } = useSearch();

  // Sync from URL params (set by navbar inline search)
  useEffect(() => {
    const q = searchParams.get('q');
    const g = searchParams.get('genre');
    if (q) handleQuery(q);
    if (g) handleGenre(Number(g));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasFilter = query.trim() || genreId !== null;

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 pb-16">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-5">Search</h1>
        <SearchBar onQuery={handleQuery} query={query} autoFocus={!query} />
      </div>

      {/* Genre filters */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={15} className="text-gray-500" />
          <span className="text-gray-500 text-sm font-medium">Filter by Genre</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGenre(null)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              genreId === null ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => handleGenre(genreId === g.id ? null : g.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                genreId === g.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <Loader />
      ) : hasFilter ? (
        results.length > 0 ? (
          <>
            <p className="text-gray-500 text-sm mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''}
              {query && ` for "${query}"`}
              {genreId !== null && ` · ${GENRES.find(g => g.id === genreId)?.name}`}
            </p>
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              <AnimatePresence>
                {results.map((movie, i) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={  { opacity: 0, scale: 0.92 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-lg font-medium text-gray-400">No movies found</p>
            <p className="text-sm mt-1 text-gray-600">Try a different search term or genre</p>
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-medium text-gray-400">Search for a movie</p>
          <p className="text-sm mt-1 text-gray-600">Type a title or select a genre above</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AppShell>
      <Suspense>
        <SearchContent />
      </Suspense>
    </AppShell>
  );
}
