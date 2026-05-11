import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format vote average to one decimal
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Format runtime minutes → "2h 15m"
export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// Format release year from date string
export function formatYear(dateStr: string): string {
  return dateStr ? new Date(dateStr).getFullYear().toString() : '';
}

// Truncate long text with ellipsis
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

// Get maturity rating color
export function getRatingColor(rating: string): string {
  switch (rating) {
    case 'G':    return 'text-green-400';
    case 'PG':   return 'text-blue-400';
    case 'PG-13': return 'text-yellow-400';
    case 'R':    return 'text-red-400';
    default:     return 'text-gray-400';
  }
}
