// services/user.service.ts
import { WatchlistItem, UserStats } from '@/types/user';
import { api } from '@/lib/api';

export const userService = {
  getWatchlist: async (profileId: string): Promise<WatchlistItem[]> => {
    try {
      return await api.get<WatchlistItem[]>(`/api/users/${profileId}/watchlist`);
    } catch {
      return [];
    }
  },

  addToWatchlist: async (profileId: string, movieId: number): Promise<void> => {
    try {
      await api.post(`/api/users/${profileId}/watchlist`, { movie_id: movieId });
    } catch {
      console.log('[Watchlist] Add - offline', { profileId, movieId });
    }
  },

  removeFromWatchlist: async (profileId: string, movieId: number): Promise<void> => {
    try {
      await api.delete(`/api/users/${profileId}/watchlist/${movieId}`);
    } catch {
      console.log('[Watchlist] Remove - offline', { profileId, movieId });
    }
  },

  getStats: async (profileId: string): Promise<UserStats> => {
    try {
      return await api.get<UserStats>(`/api/users/${profileId}/stats`);
    } catch {
      return { total_watched: 0, total_liked: 0, watchlist_count: 0 };
    }
  },
};
