import { fetchTrending, fetchTopRated, fetchByGenre, fetchPopular } from '@/lib/tmdb';
import BrowseClient from './BrowseClient';
import type { MovieRow } from '@/types/movie';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse — NFLIX',
};

// Force server-render on every request so TMDB data is always fresh
export const dynamic = 'force-dynamic';


export default async function BrowsePage() {
  // Fetch all rows in parallel
  const [trending, topRated, action, drama, scifi, comedy] = await Promise.all([
    fetchTrending(),
    fetchTopRated(),
    fetchByGenre(28),   // Action
    fetchByGenre(18),   // Drama
    fetchByGenre(878),  // Sci-Fi
    fetchByGenre(35),   // Comedy
  ]);

  const rows: MovieRow[] = [
    { title: 'Trending Now',       movies: trending,         endpoint: '/api/recommendations/trending'   },
    { title: 'Top Rated',          movies: topRated,         endpoint: '/api/recommendations/top-rated'  },
    { title: 'Action & Adventure', movies: action,           endpoint: '/api/recommendations/genre/28'   },
    { title: 'Drama',              movies: drama,            endpoint: '/api/recommendations/genre/18'   },
    { title: 'Sci-Fi',             movies: scifi,            endpoint: '/api/recommendations/genre/878'  },
    { title: 'Comedy',             movies: comedy,           endpoint: '/api/recommendations/genre/35'   },
  ];

  const featured = trending[0] ?? topRated[0];

  return <BrowseClient rows={rows} featured={featured} />;
}
