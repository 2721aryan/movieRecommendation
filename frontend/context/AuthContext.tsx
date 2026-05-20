'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Profile, AuthState } from '@/types/auth';
import { Movie } from '@/types/movie';
import { api } from '@/lib/api';
import { mockLogin, mockSignup, mockLogout } from '@/lib/auth';
import { userService } from '@/services/user.service';
import { movieService } from '@/services/movie.service';

interface AuthContextValue extends AuthState {
  login:              (email: string, password: string) => Promise<void>;
  signup:             (name: string, email: string, password: string) => Promise<void>;
  logout:             () => Promise<void>;
  setProfile:         (profile: Profile) => void;
  // Watchlist
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

// ── Helpers to persist state in localStorage ──────────────────────────────────
function loadPersistedState(profileId: string) {
  try {
    const raw = localStorage.getItem(`nflix_state_${profileId}`);
    if (!raw) return { myListIds: [], likedMovies: [], dislikedMovies: [] };
    return JSON.parse(raw);
  } catch { return { myListIds: [], likedMovies: [], dislikedMovies: [] }; }
}

function savePersistedState(profileId: string, data: object) {
  try { localStorage.setItem(`nflix_state_${profileId}`, JSON.stringify(data)); } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                 = useState<User | null>(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [myList, setMyList]             = useState<Movie[]>([]);
  const [likedMovies, setLiked]         = useState<number[]>([]);
  const [dislikedMovies, setDisliked]   = useState<number[]>([]);

  const activeProfileId = user?.active_profile?.id ?? user?.profiles?.[0]?.id;

  // ── Restore persisted state when profile changes ──────────────────────────
  useEffect(() => {
    if (!activeProfileId) return;

    const saved = loadPersistedState(activeProfileId);
    setLiked(saved.likedMovies ?? []);
    setDisliked(saved.dislikedMovies ?? []);

    // Restore watchlist from backend (or fall back to localStorage)
    userService.getWatchlist(activeProfileId).then(async (items) => {
      if (items.length > 0) {
        // Fetch full movie objects for each watchlist item
        const movies = await Promise.all(
          items.map(item => movieService.getById(item.movie_id))
        );
        setMyList(movies.filter(Boolean) as Movie[]);
      } else if (saved.myListIds?.length > 0) {
        // fallback: localStorage IDs → full movies
        const movies = await Promise.all(
          saved.myListIds.map((id: number) => movieService.getById(id))
        );
        setMyList(movies.filter(Boolean) as Movie[]);
      }
    }).catch(() => {
      // Backend offline — use localStorage
      if (saved.myListIds?.length > 0) {
        Promise.all(saved.myListIds.map((id: number) => movieService.getById(id)))
          .then(movies => setMyList(movies.filter(Boolean) as Movie[]));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileId]);

  // ── Persist likes/dislikes/watchlist to localStorage on every change ──────
  useEffect(() => {
    if (!activeProfileId) return;
    savePersistedState(activeProfileId, {
      likedMovies,
      dislikedMovies,
      myListIds: myList.map(m => m.id),
    });
  }, [activeProfileId, likedMovies, dislikedMovies, myList]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Try real backend first, fall back to mock
      try {
        const { access_token } = await api.post<{ access_token: string }>('/api/auth/login', { email, password });
        localStorage.setItem('nflix_token', access_token);
      } catch {}
      const u = await mockLogin({ email, password });
      setUser(u);
    } finally { setIsLoading(false); }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      try {
        await api.post('/api/auth/signup', { name, email, password });
      } catch {}
      const u = await mockSignup({ name, email, password });
      setUser(u);
    } finally { setIsLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await mockLogout();
      localStorage.removeItem('nflix_token');
      setUser(null);
      // Don't clear myList/likedMovies/dislikedMovies here —
      // they are re-loaded from localStorage when user logs back in
      setMyList([]);
      setLiked([]);
      setDisliked([]);
    } finally { setIsLoading(false); }
  }, []);

  const setProfile = useCallback((profile: Profile) => {
    if (!user) return;
    setUser({ ...user, active_profile: profile });
  }, [user]);

  // ── Watchlist ─────────────────────────────────────────────────────────────
  const addToMyList = useCallback((movie: Movie) => {
    setMyList(l => l.some(m => m.id === movie.id) ? l : [...l, movie]);
    if (activeProfileId) {
      userService.addToWatchlist(activeProfileId, movie.id).catch(() => {});
      movieService.logInteraction(movie.id, 'watchlist_add', activeProfileId).catch(() => {});
    }
  }, [activeProfileId]);

  const removeFromMyList = useCallback((movieId: number) => {
    setMyList(l => l.filter(m => m.id !== movieId));
    if (activeProfileId) {
      userService.removeFromWatchlist(activeProfileId, movieId).catch(() => {});
      movieService.logInteraction(movieId, 'watchlist_remove', activeProfileId).catch(() => {});
    }
  }, [activeProfileId]);

  const isInMyList = useCallback((movieId: number) =>
    myList.some(m => m.id === movieId), [myList]);

  // ── Likes / Dislikes ──────────────────────────────────────────────────────
  const toggleLike = useCallback((movieId: number) => {
    setLiked(l => {
      const isNowLiked = !l.includes(movieId);
      if (activeProfileId) {
        movieService.logInteraction(movieId, isNowLiked ? 'like' : 'watchlist_remove', activeProfileId).catch(() => {});
      }
      return isNowLiked ? [...l, movieId] : l.filter(x => x !== movieId);
    });
    setDisliked(d => d.filter(x => x !== movieId));
  }, [activeProfileId]);

  const isLiked = useCallback((movieId: number) =>
    likedMovies.includes(movieId), [likedMovies]);

  const toggleDislike = useCallback((movieId: number) => {
    setDisliked(d => {
      const isNowDisliked = !d.includes(movieId);
      if (activeProfileId && isNowDisliked) {
        // Only log when actively disliking — no backend action needed for un-dislike
        movieService.logInteraction(movieId, 'dislike', activeProfileId).catch(() => {});
      }
      return isNowDisliked ? [...d, movieId] : d.filter(x => x !== movieId);
    });
    setLiked(l => l.filter(x => x !== movieId));
  }, [activeProfileId]);

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
