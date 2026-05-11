'use client';

import { Genre } from '@/types/movie';
import { useRouter, useSearchParams } from 'next/navigation';

const GENRE_COLORS: Record<number, string> = {
  28:    'bg-red-900/50 text-red-300 hover:bg-red-800/60',
  12:    'bg-green-900/50 text-green-300 hover:bg-green-800/60',
  16:    'bg-blue-900/50 text-blue-300 hover:bg-blue-800/60',
  35:    'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-800/60',
  80:    'bg-gray-700/60 text-gray-200 hover:bg-gray-600/70',
  18:    'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60',
  14:    'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/60',
  27:    'bg-rose-900/50 text-rose-300 hover:bg-rose-800/60',
  9648:  'bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/60',
  10749: 'bg-pink-900/50 text-pink-300 hover:bg-pink-800/60',
  878:   'bg-sky-900/50 text-sky-300 hover:bg-sky-800/60',
  53:    'bg-orange-900/50 text-orange-300 hover:bg-orange-800/60',
};

export default function GenrePill({ genre, clickable = true }: { genre: Genre; clickable?: boolean }) {
  const router = useRouter();
  const color  = GENRE_COLORS[genre.id] ?? 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/70';

  const handleClick = () => {
    if (!clickable) return;
    router.push(`/search?genre=${genre.id}`);
  };

  return (
    <span
      onClick={handleClick}
      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${color} ${
        clickable ? 'cursor-pointer' : ''
      }`}
    >
      {genre.name}
    </span>
  );
}
