'use client';

import AppShell from '@/components/layout/AppShell';
import HeroBanner from '@/components/movie/HeroBanner';
import MovieRow from '@/components/movie/MovieRow';
import { useAuth } from '@/hooks/useAuth';
import type { Movie, MovieRow as MovieRowType } from '@/types/movie';

interface BrowseClientProps {
  rows:     MovieRowType[];
  featured: Movie;
}

export default function BrowseClient({ rows, featured }: BrowseClientProps) {
  const { isAuthenticated, myList } = useAuth();

  // Build My List row from fetched movies (intersection with watchlist IDs)
  const allMovies = rows.flatMap(r => r.movies);
  const myListIds = myList.map(m => m.id);
  const myListMovies = allMovies.filter((m, idx, arr) =>
    myListIds.includes(m.id) && arr.findIndex(x => x.id === m.id) === idx
  );

  return (
    <AppShell>
      <HeroBanner movies={rows[0]?.movies.slice(0, 5)} />

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
        {rows.map(row => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))}
      </div>
    </AppShell>
  );
}
