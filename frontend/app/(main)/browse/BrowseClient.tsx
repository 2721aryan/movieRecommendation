'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/layout/AppShell';
import HeroBanner from '@/components/movie/HeroBanner';
import MovieRow from '@/components/movie/MovieRow';
import { useAuth } from '@/hooks/useAuth';
import { movieService } from '@/services/movie.service';
import { fetchTrending } from '@/lib/tmdb';
import type { Movie, MovieRow as MovieRowType } from '@/types/movie';

// Module-level cache — survives client-side navigation so going back is instant
let _cachedRows: MovieRowType[] = [];
let _cachedProfileId: string | undefined;

interface BrowseClientProps {
  rows:     MovieRowType[];
  featured: Movie | null;
}

export default function BrowseClient({ rows: initialRows, featured: _ }: BrowseClientProps) {
  const { user, isAuthenticated, myList, dislikedMovies } = useAuth();
  const [rows, setRows] = useState<MovieRowType[]>(_cachedRows.length ? _cachedRows : initialRows);
  const isMounted = useRef(true);

  const activeProfileId = user?.active_profile?.id ?? user?.profiles?.[0]?.id;

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // On mount: fetch TMDB trending + backend rows. Skip if same profile already cached.
  useEffect(() => {
    const isSameProfile = _cachedProfileId === (activeProfileId || '');
    if (isSameProfile && _cachedRows.length > 0) {
      setRows(_cachedRows);
      return; // instant — no fetch needed
    }

    const load = async () => {
      const [trendingMovies, backendRows] = await Promise.all([
        fetchTrending().catch(() => [] as Movie[]),
        movieService.getRows(activeProfileId || undefined).catch(() => [] as MovieRowType[]),
      ]);

      if (!isMounted.current) return;

      const trendingRow: MovieRowType = {
        title: 'Trending Now',
        movies: trendingMovies,
        endpoint: '/api/recommendations/trending',
      };

      const withTrending = (trendingMovies.length > 0)
        ? backendRows.map(r => r.title === 'Trending Now' ? trendingRow : r)
        : backendRows;

      const hasTrending = withTrending.some(r => r.title === 'Trending Now');
      const finalRows = hasTrending ? withTrending : trendingMovies.length > 0 ? [trendingRow, ...withTrending] : withTrending;

      // Save to cache
      _cachedRows = finalRows;
      _cachedProfileId = activeProfileId || '';
      setRows(finalRows);
    };

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileId, dislikedMovies]);

  // Optimistically strip disliked movies from every row
  const visibleRows = rows
    .map(row => ({
      ...row,
      movies: row.movies.filter(m => !dislikedMovies.includes(m.id)),
    }))
    .filter(row => row.movies.length > 0);

  // Build My List row
  const allMovies = visibleRows.flatMap(r => r.movies);
  const myListIds = myList.map(m => m.id);
  const myListMovies = allMovies.filter((m, idx, arr) =>
    myListIds.includes(m.id) && arr.findIndex(x => x.id === m.id) === idx
  );

  return (
    <AppShell>
      <HeroBanner movies={visibleRows[0]?.movies.slice(0, 5)} />

      {/* Guest nudge */}
      {!isAuthenticated && (
        <div style={{ margin: '0 60px', marginTop: '24px', marginBottom: '8px', padding: '12px 16px' }} className="bg-gray-900/50 border border-white/[0.08] rounded-lg flex items-center gap-3">
          <span className="text-red-500 text-lg">🎬</span>
          <p className="text-gray-400 text-sm">
            <span className="font-semibold text-white">Sign in</span>{' '}
            to get personalised recommendations and build your watchlist.
          </p>
        </div>
      )}

      {/* My List row */}
      {isAuthenticated && myListMovies.length > 0 && (
        <div className="mt-6">
          <MovieRow title="My List" movies={myListMovies} href="/my-list" />
        </div>
      )}

      {/* Content rows */}
      <div style={{ marginTop: '32px', paddingBottom: '60px' }}>
        {visibleRows.map(row => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))}
      </div>
    </AppShell>
  );
}
