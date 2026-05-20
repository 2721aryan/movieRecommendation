// services/movie.service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Wired to the FastAPI backend. Falls back to mock data if backend is offline.
// ─────────────────────────────────────────────────────────────────────────────
import { Movie, MovieRow } from '@/types/movie';
import { MOCK_MOVIES, MOVIE_ROWS } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { REC_ENDPOINTS } from '@/lib/constants';

export const movieService = {
  // Get all movies
  getAll: async (): Promise<Movie[]> => {
    try {
      return await api.get<Movie[]>('/api/movies');
    } catch {
      return MOCK_MOVIES;
    }
  },

  // Get movie by ID
  getById: async (id: number): Promise<Movie | null> => {
    try {
      return await api.get<Movie>(`/api/movies/${id}`);
    } catch {
      return MOCK_MOVIES.find(m => m.id === id) ?? null;
    }
  },

  // Get recommendation rows for the Browse page
  getRows: async (profileId?: string): Promise<MovieRow[]> => {
    try {
      const endpoint = profileId
        ? `${REC_ENDPOINTS.rows}?profile_id=${profileId}`
        : REC_ENDPOINTS.rows;
      return await api.get<MovieRow[]>(endpoint);
    } catch {
      return MOVIE_ROWS;
    }
  },

  // Get similar movies (content-based)
  getSimilar: async (id: number): Promise<Movie[]> => {
    try {
      return await api.get<Movie[]>(REC_ENDPOINTS.similar(id));
    } catch {
      const movie = MOCK_MOVIES.find(m => m.id === id);
      if (!movie) return [];
      return MOCK_MOVIES
        .filter(m => m.id !== id && m.genre_ids.some(g => movie.genre_ids.includes(g)))
        .slice(0, 8);
    }
  },

  // Get trending movies
  getTrending: async (): Promise<Movie[]> => {
    try {
      return await api.get<Movie[]>(REC_ENDPOINTS.trending);
    } catch {
      return MOCK_MOVIES.slice(0, 10);
    }
  },

  // Log user interaction — feeds the ML recommendation engine
  logInteraction: async (
    movieId: number,
    type: 'like' | 'dislike' | 'watchlist_add' | 'watchlist_remove' | 'click' | 'watch',
    profileId?: string
  ): Promise<void> => {
    if (!profileId) {
      console.log('[ML Interaction - no profile]', { movieId, type });
      return;
    }
    try {
      await api.post('/api/interactions', {
        movie_id: movieId,
        action_type: type,
        profile_id: profileId,
      });
    } catch {
      // Non-critical — log locally if backend is offline
      console.log('[ML Interaction - offline]', { movieId, type, profileId, ts: new Date().toISOString() });
    }
  },
};
