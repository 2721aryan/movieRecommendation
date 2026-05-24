import { Movie, Genre } from '@/types/movie';

// ─────────────────────────────────────────────────────────────────────────────
// TMDB API client
// Uses NEXT_PUBLIC_TMDB_API_KEY from .env.local
// All functions return the same Movie shape used throughout the app
// so swapping mock → real data requires zero changes to components.
// ─────────────────────────────────────────────────────────────────────────────

const API_KEY  = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.warn('[TMDB] NEXT_PUBLIC_TMDB_API_KEY is not set in .env.local');
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY ?? '');
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  // 5-second timeout — never let a slow TMDB response block the page for 30s.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: 3600 }, // cache 1 hour
    });
    if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

// ── TMDB response shapes ──────────────────────────────────────────────────────
interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
}

interface TMDBListResponse {
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// Map TMDB response → our Movie type
function mapMovie(m: TMDBMovie): Movie {
  return {
    id:              m.id,
    title:           m.title,
    overview:        m.overview,
    poster_path:     m.poster_path  ?? '/placeholder-poster.jpg',
    backdrop_path:   m.backdrop_path ?? '/placeholder-backdrop.jpg',
    release_date:    m.release_date,
    vote_average:    m.vote_average,
    vote_count:      m.vote_count,
    genre_ids:       m.genre_ids ?? m.genres?.map(g => g.id) ?? [],
    genres:          m.genres ?? [],
    runtime:         m.runtime,
    maturity_rating: m.vote_average >= 7 ? 'PG-13' : 'R', // rough fallback
  };
}

// ── Public API functions ──────────────────────────────────────────────────────

export async function fetchPopular(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>('/movie/popular', { page: String(page) });
  return data.results.map(mapMovie);
}

export async function fetchTrending(): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>('/trending/movie/day');
  return data.results.slice(0, 20).map(mapMovie);
}

export async function fetchTrendingWeek(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>('/trending/movie/week', { page: String(page) });
  return data.results.map(mapMovie);
}

export async function fetchByKeyword(keywordId: number, page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>('/discover/movie', {
    with_keywords:    String(keywordId),
    sort_by:          'vote_average.desc',
    'vote_count.gte': '1000',              // filter out low-vote noise
    page:             String(page),
  });
  return data.results.map(mapMovie);
}

export async function fetchTopRated(page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>('/movie/top_rated', { page: String(page) });
  return data.results.map(mapMovie);
}

export async function fetchByGenre(genreId: number, page = 1): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>('/discover/movie', {
    with_genres: String(genreId),
    sort_by:     'popularity.desc',
    page:        String(page),
  });
  return data.results.map(mapMovie);
}

export async function fetchMovieById(id: number): Promise<Movie | null> {
  try {
    const m = await tmdbFetch<TMDBMovie>(`/movie/${id}`, { append_to_response: 'credits' });
    const movie = mapMovie(m);
    // Attach genres from detail response
    movie.genres = m.genres ?? [];
    movie.genre_ids = m.genres?.map(g => g.id) ?? [];
    return movie;
  } catch {
    return null;
  }
}

export async function fetchSimilar(id: number): Promise<Movie[]> {
  const data = await tmdbFetch<TMDBListResponse>(`/movie/${id}/similar`);
  return data.results.slice(0, 12).map(mapMovie);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<TMDBListResponse>('/search/movie', { query });
  return data.results.map(mapMovie);
}

export async function fetchGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
}
