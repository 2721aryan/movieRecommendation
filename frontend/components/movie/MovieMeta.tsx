'use client';

import { Star, Clock, Calendar } from 'lucide-react';
import { Movie } from '@/types/movie';
import { formatRuntime, formatYear } from '@/lib/utils';
import GenrePill from './GenrePill';

export default function MovieMeta({ movie }: { movie: Movie }) {
  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
        <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
          <Star size={16} fill="currentColor" /> {movie.vote_average.toFixed(1)}
          <span className="text-gray-500 font-normal">({movie.vote_count.toLocaleString()} ratings)</span>
        </span>
        {movie.runtime && (
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {formatRuntime(movie.runtime)}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Calendar size={14} /> {formatYear(movie.release_date)}
        </span>
        {movie.maturity_rating && (
          <span className="border border-gray-500 px-2 py-0.5 rounded text-xs">
            {movie.maturity_rating}
          </span>
        )}
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-2">
        {movie.genres.map(g => <GenrePill key={g.id} genre={g} />)}
      </div>

      {/* Director */}
      {movie.director && (
        <p className="text-sm text-gray-400">
          <span className="text-gray-500">Director: </span>
          <span className="text-gray-200">{movie.director}</span>
        </p>
      )}

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <p className="text-sm text-gray-400">
          <span className="text-gray-500">Cast: </span>
          <span className="text-gray-200">{movie.cast.map(c => c.name).join(', ')}</span>
        </p>
      )}
    </div>
  );
}
