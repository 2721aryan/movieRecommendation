// services/user.service.ts
import { WatchlistItem, UserStats } from '@/types/user';
import { api } from '@/lib/api';

export const userService = {
  getWatchlist: async (userId: string): Promise<WatchlistItem[]> => {
    return [];
    // Backend: return api.get<WatchlistItem[]>(`/api/users/${userId}/watchlist`);
  },
  addToWatchlist: async (userId: string, movieId: number): Promise<void> => {
    console.log('[Watchlist] Add', { userId, movieId });
    // Backend: await api.post(`/api/users/${userId}/watchlist`, { movie_id: movieId });
  },
  removeFromWatchlist: async (userId: string, movieId: number): Promise<void> => {
    console.log('[Watchlist] Remove', { userId, movieId });
    // Backend: await api.delete(`/api/users/${userId}/watchlist/${movieId}`);
  },
  getStats: async (userId: string): Promise<UserStats> => {
    return { total_watched: 0, total_liked: 0, watchlist_count: 0 };
    // Backend: return api.get<UserStats>(`/api/users/${userId}/stats`);
  },
};
