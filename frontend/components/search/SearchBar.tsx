'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  onQuery:  (q: string) => void;
  query:    string;
  autoFocus?: boolean;
}

export default function SearchBar({ onQuery, query, autoFocus }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQuery(e.target.value);
  };

  return (
    <div className="relative w-full max-w-xl">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search movies, genres, directors…"
        className="w-full bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500
                   rounded-lg pl-12 pr-10 py-3.5 text-sm outline-none transition-all
                   focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
      />
      {query && (
        <button
          onClick={() => onQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
