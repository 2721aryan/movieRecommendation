// services/movie.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Currently returns mock data. Replace with `api.get(...)` calls when backend ready.
// ─────────────────────────────────────────────────────────────────────────────

import { Movie, MovieRow } from '@/types/movie';
import { MOCK_MOVIES, MOVIE_ROWS } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { REC_ENDPOINTS } from '@/lib/constants';

export const movieService = {
  // Get all movies (mock)
  getAll: async (): Promise<Movie[]> => {
    return MOCK_MOVIES;
    // Backend: return api.get<Movie[]>('/api/movies');
  },

  // Get movie by ID (mock)
  getById: async (id: number): Promise<Movie | null> => {
    return MOCK_MOVIES.find(m => m.id === id) ?? null;
    // Backend: return api.get<Movie>(`/api/movies/${id}`);
  },

  // Get recommendation rows (mock)
  getRows: async (): Promise<MovieRow[]> => {
    return MOVIE_ROWS;
    // Backend: return api.get<MovieRow[]>('/api/recommendations/rows');
  },

  // Get similar movies (mock – content-based)
  getSimilar: async (id: number): Promise<Movie[]> => {
    const movie = MOCK_MOVIES.find(m => m.id === id);
    if (!movie) return [];
    return MOCK_MOVIES
      .filter(m => m.id !== id && m.genre_ids.some(g => movie.genre_ids.includes(g)))
      .slice(0, 8);
    // Backend: return api.get<Movie[]>(REC_ENDPOINTS.similar(id));
  },

  // Get trending (mock)
  getTrending: async (): Promise<Movie[]> => {
    return MOCK_MOVIES.slice(0, 10);
    // Backend: return api.get<Movie[]>(REC_ENDPOINTS.trending);
  },

  // Log user interaction (for ML training data)
  // Call this whenever user likes/dislikes/watchlists/clicks a movie
  logInteraction: async (
    movieId: number,
    type: 'like' | 'dislike' | 'watchlist_add' | 'watchlist_remove' | 'click',
    userId?: string
  ): Promise<void> => {
    console.log('[ML Interaction]', { movieId, type, userId, ts: new Date().toISOString() });
    // Backend: await api.post('/api/interactions', { movie_id: movieId, type, user_id: userId });
  },
};
