'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Profile, AuthState } from '@/types/auth';
import { Movie } from '@/types/movie';
import { mockLogin, mockSignup, mockLogout } from '@/lib/auth';

interface AuthContextValue extends AuthState {
  login:              (email: string, password: string) => Promise<void>;
  signup:             (name: string, email: string, password: string) => Promise<void>;
  logout:             () => Promise<void>;
  setProfile:         (profile: Profile) => void;
  // Watchlist — stores full Movie objects so My List page works without DB
  myList:             Movie[];
  myListIds:          number[];
  addToMyList:        (movie: Movie) => void;
  removeFromMyList:   (movieId: number) => void;
  isInMyList:         (movieId: number) => boolean;
  // Likes
  likedMovies:        number[];
  toggleLike:         (movieId: number) => void;
  isLiked:            (movieId: number) => boolean;
  // Dislikes
  dislikedMovies:     number[];
  toggleDislike:      (movieId: number) => void;
  isDisliked:         (movieId: number) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [myList, setMyList]       = useState<Movie[]>([]);
  const [likedMovies, setLiked]       = useState<number[]>([]);
  const [dislikedMovies, setDisliked] = useState<number[]>([]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const u = await mockLogin({ email, password });
      setUser(u);
    } finally { setIsLoading(false); }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const u = await mockSignup({ name, email, password });
      setUser(u);
    } finally { setIsLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await mockLogout();
      setUser(null);
      setMyList([]);
      setLiked([]);
      setDisliked([]);
    } finally { setIsLoading(false); }
  }, []);

  const setProfile = useCallback((profile: Profile) => {
    if (!user) return;
    setUser({ ...user, active_profile: profile });
  }, [user]);

  // Watchlist — stores the full Movie object so the My List page can render
  // without a database lookup. When the backend is ready, replace with:
  // await api.post('/api/users/{id}/watchlist', { movie_id })
  const addToMyList    = useCallback((movie: Movie) =>
    setMyList(l => l.some(m => m.id === movie.id) ? l : [...l, movie]), []);
  const removeFromMyList = useCallback((movieId: number) =>
    setMyList(l => l.filter(m => m.id !== movieId)), []);
  const isInMyList     = useCallback((movieId: number) =>
    myList.some(m => m.id === movieId), [myList]);

  const toggleLike = useCallback((movieId: number) => {
    setLiked(l => l.includes(movieId) ? l.filter(x => x !== movieId) : [...l, movieId]);
    // Remove dislike if present (mutually exclusive)
    setDisliked(d => d.filter(x => x !== movieId));
  }, []);
  const isLiked = useCallback((movieId: number) =>
    likedMovies.includes(movieId), [likedMovies]);

  const toggleDislike = useCallback((movieId: number) => {
    setDisliked(d => d.includes(movieId) ? d.filter(x => x !== movieId) : [...d, movieId]);
    // Remove like if present (mutually exclusive)
    setLiked(l => l.filter(x => x !== movieId));
  }, []);
  const isDisliked = useCallback((movieId: number) =>
    dislikedMovies.includes(movieId), [dislikedMovies]);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading,
      login, signup, logout, setProfile,
      myList, myListIds: myList.map(m => m.id),
      addToMyList, removeFromMyList, isInMyList,
      likedMovies, toggleLike, isLiked,
      dislikedMovies, toggleDislike, isDisliked,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
