import { Movie } from '@/types/movie';
import { TMDB_POSTER_MD, TMDB_BACKDROP_MD } from './constants';

// Build full TMDB image URL from a path
export const getPosterUrl  = (path: string) => `${TMDB_POSTER_MD}${path}`;
export const getBackdropUrl = (path: string) => `${TMDB_BACKDROP_MD}${path}`;

// Fallback image when poster is missing
export const getFallbackPoster   = () => '/images/poster-fallback.png';
export const getFallbackBackdrop = () => '/images/backdrop-fallback.png';
