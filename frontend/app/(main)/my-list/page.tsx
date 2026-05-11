'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BookMarked, Trash2 } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { getPosterUrl } from '@/lib/tmdb-image';
import { formatYear } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function MyListPage() {
  const router = useRouter();
  const { isAuthenticated, myList, removeFromMyList } = useAuth();

  if (!isAuthenticated) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <BookMarked className="text-gray-600" size={56} />
          <h1 className="text-2xl font-bold text-white">Your list is waiting</h1>
          <p className="text-gray-400 text-sm text-center max-w-sm">
            Sign in to save movies to your list and track what you want to watch.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => router.push('/signup')}>Create Account</Button>
            <Button variant="secondary" onClick={() => router.push('/login')}>Sign In</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const movies = myList;

  return (
    <AppShell>
      <div className="min-h-screen pt-24 px-4 md:px-12 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <BookMarked className="text-red-500" size={28} />
          <h1 className="text-3xl font-bold text-white">My List</h1>
          <span className="text-gray-500 text-sm">({movies.length} movie{movies.length !== 1 ? 's' : ''})</span>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-lg font-medium text-gray-400 mb-2">Your list is empty</p>
            <p className="text-sm text-gray-500 mb-6">Browse movies and click + to add them here</p>
            <Link href="/browse">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie, i) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={  { opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04 }}
                className="group relative cursor-pointer"
                onClick={() => router.push(`/movie/${movie.id}`)}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 relative">
                  <Image
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Remove button */}
                  <button
                    onClick={e => { e.stopPropagation(); removeFromMyList(movie.id); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    aria-label="Remove from list"
                  >
                    <Trash2 size={13} />
                  </button>
                  {/* Rating */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
                    ★ {movie.vote_average.toFixed(1)}
                  </div>
                </div>
                <p className="text-gray-300 text-xs font-medium mt-1.5 truncate">{movie.title}</p>
                <p className="text-gray-600 text-xs">{formatYear(movie.release_date)}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
