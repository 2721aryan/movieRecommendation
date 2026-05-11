export interface WatchlistItem {
  movie_id: number;
  added_at: string;
}

export interface UserPreferences {
  favorite_genres: number[];
  disliked_genres: number[];
  language: string;
  maturity_level: 'all' | 'teen' | 'adult';
}

export interface UserStats {
  total_watched: number;
  total_liked: number;
  watchlist_count: number;
}
