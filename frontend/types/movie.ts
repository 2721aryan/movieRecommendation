export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres: Genre[];
  runtime?: number;
  director?: string;
  cast?: CastMember[];
  keywords?: string[];
  trailer_key?: string;
  maturity_rating?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface MovieRow {
  title: string;
  movies: Movie[];
  endpoint?: string; // future backend endpoint
}

export interface UserInteraction {
  movie_id: number;
  type: 'like' | 'dislike' | 'watchlist_add' | 'watchlist_remove' | 'click' | 'watch';
  timestamp: string;
}
