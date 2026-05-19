// Server component — runs on the Next.js server which CAN reach api.themoviedb.org
import { fetchMovieById, fetchSimilar, fetchTrending } from '@/lib/tmdb';
import { MOCK_MOVIES } from '@/lib/mock-data';
import MovieDetailClient from './MovieDetailClient';
import type { Metadata } from 'next';

// Next.js 15: params is a Promise — must be awaited before accessing properties.
interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const mockMovie = MOCK_MOVIES.find(m => m.id === id) ?? null;
  if (mockMovie) return { title: `${mockMovie.title} — NFLIX` };
  const movie = await fetchMovieById(id).catch(() => null);
  return { title: movie ? `${movie.title} — NFLIX` : 'Movie — NFLIX' };
}

export default async function MovieDetailPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);

  // ── Fast path: movie is in mock data ──────────────────────────────────────
  // Serve instantly — no TMDB call needed, no loading delay.
  const mockMovie = MOCK_MOVIES.find(m => m.id === id) ?? null;
  if (mockMovie) {
    const mockSimilar = MOCK_MOVIES.filter(m => m.id !== id).slice(0, 12);
    // Silently upgrade similar movies from TMDB in background (not awaited)
    // This doesn't block rendering — similar movies will update on next visit
    // due to Next.js's 1-hour cache on the fetchSimilar call.
    return <MovieDetailClient movie={mockMovie} similar={mockSimilar} />;
  }

  // ── Slow path: movie is not in mock data — fetch from TMDB ────────────────
  // Both fetches have a 5-second timeout (set in lib/tmdb.ts).
  // fetchTrending is only used as a fallback if fetchMovieById fails.
  const [movie, similar] = await Promise.all([
    fetchMovieById(id).catch(() => null),
    fetchSimilar(id).catch(() => []),
  ]);

  // If detail endpoint failed, try to find the movie in the trending list
  const resolvedMovie = movie ?? await fetchTrending().then(t => t.find(m => m.id === id) ?? null).catch(() => null);
  const resolvedSimilar = similar?.length ? similar : MOCK_MOVIES.slice(0, 12);

  return <MovieDetailClient movie={resolvedMovie ?? null} similar={resolvedSimilar} />;
}
