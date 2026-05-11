'use client';

import { Movie } from '@/types/movie';
import MovieRow from './MovieRow';

export default function SimilarMoviesRow({ movies }: { movies: Movie[] }) {
  if (!movies.length) return null;
  return <MovieRow title="More Like This" movies={movies} />;
}
