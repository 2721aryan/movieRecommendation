'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/layout/AppShell';
import HeroBanner from '@/components/movie/HeroBanner';
import MovieRow from '@/components/movie/MovieRow';
import { useAuth } from '@/hooks/useAuth';
import { movieService } from '@/services/movie.service';
import type { Movie, MovieRow as MovieRowType } from '@/types/movie';

interface BrowseClientProps {
  rows:     MovieRowType[];
  featured: Movie;
}

export default function BrowseClient({ rows: initialRows, featured }: BrowseClientProps) {
  const { user, isAuthenticated, myList, dislikedMovies } = useAuth();
  const [rows, setRows] = useState<MovieRowType[]>(initialRows);
  const isMounted = useRef(true);

  const activeProfileId = user?.active_profile?.id ?? user?.profiles?.[0]?.id;

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Fetch personalised rows on mount/profile change AND whenever dislikes change
  useEffect(() => {
    if (activeProfileId) {
      movieService.getRows(activeProfileId)
        .then(fresh => { if (isMounted.current) setRows(fresh); })
        .catch(console.error);
    } else {
      setRows(initialRows);
    }
  }, [activeProfileId, initialRows, dislikedMovies]); // ← dislikedMovies triggers re-fetch

  // Optimistically strip disliked movies from every row immediately (instant UI)
  const visibleRows = rows.map(row => ({
    ...row,
    movies: row.movies.filter(m => !dislikedMovies.includes(m.id)),
  })).filter(row => row.movies.length > 0); // hide empty rows

  // Build My List row from fetched movies (intersection with watchlist IDs)
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
