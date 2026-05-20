import { Genre } from '@/types/movie';

// ── Genre definitions ─────────────────────────────────────────────────────────
export const GENRES: Genre[] = [
  { id: 28,    name: 'Action'      },
  { id: 12,    name: 'Adventure'   },
  { id: 16,    name: 'Animation'   },
  { id: 35,    name: 'Comedy'      },
  { id: 80,    name: 'Crime'       },
  { id: 18,    name: 'Drama'       },
  { id: 14,    name: 'Fantasy'     },
  { id: 27,    name: 'Horror'      },
  { id: 9648,  name: 'Mystery'     },
  { id: 10749, name: 'Romance'     },
  { id: 878,   name: 'Sci-Fi'      },
  { id: 53,    name: 'Thriller'    },
];

// ── TMDB image base URLs ──────────────────────────────────────────────────────
export const TMDB_IMAGE_BASE    = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_SM     = `${TMDB_IMAGE_BASE}/w342`;
export const TMDB_POSTER_MD     = `${TMDB_IMAGE_BASE}/w500`;
export const TMDB_POSTER_LG     = `${TMDB_IMAGE_BASE}/original`;
export const TMDB_BACKDROP_MD   = `${TMDB_IMAGE_BASE}/w1280`;
export const TMDB_BACKDROP_LG   = `${TMDB_IMAGE_BASE}/original`;

// ── App constants ─────────────────────────────────────────────────────────────
export const APP_NAME           = 'NFLIX';
export const ROWS_PER_PAGE      = 8;
export const SEARCH_DEBOUNCE_MS = 400;

// ── Profile avatars ───────────────────────────────────────────────────────────
export const PROFILE_AVATARS = [
  { id: 'avatar1', src: '/images/profiles/avatar1.png', label: 'Blue'   },
  { id: 'avatar2', src: '/images/profiles/avatar2.png', label: 'Purple' },
  { id: 'avatar3', src: '/images/profiles/avatar3.png', label: 'Teal'   },
  { id: 'avatar4', src: '/images/profiles/avatar4.png', label: 'Pink'   },
  { id: 'avatar5', src: '/images/profiles/avatar5.png', label: 'Green'  },
  { id: 'avatar6', src: '/images/profiles/avatar6.png', label: 'Orange' },
];

// ── Mock profiles ─────────────────────────────────────────────────────────────
export const MOCK_PROFILES = [
  { id: 'p1', name: 'Aryan',    avatar: '/images/profiles/avatar1.png' },
  { id: 'p2', name: 'Guest',    avatar: '/images/profiles/avatar3.png' },
  { id: 'p3', name: 'Kids',     avatar: '/images/profiles/avatar4.png' },
];

// ── Future backend API base ───────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// ── Recommendation endpoints (to be wired when backend is ready) ──────────────
export const REC_ENDPOINTS = {
  forYou:    '/api/recommendations/for-you',
  similar:   (id: number) => `/api/recommendations/similar/${id}`,
  trending:  '/api/recommendations/trending',
  topRated:  '/api/recommendations/top-rated',
  rows:      '/api/recommendations/rows',
};
