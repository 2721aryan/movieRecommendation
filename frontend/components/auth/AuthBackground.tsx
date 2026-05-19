'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

// ── Fallback backdrop paths from mock data (bare TMDB paths, not full URLs) ──
// These are always available instantly — no fetch needed.
// ── Verified live backdrop paths from TMDB trending/week (fetched 2026-05-19) ──
// All paths confirmed to exist on image.tmdb.org CDN.
const FALLBACK_BACKDROPS = [
  '/qO55CD8tgVL1T4WKn6zYFFiD6lL.jpg', // The Punisher: One Last Kill
  '/2I1OFQJ0L9T0dpU6FobKFWV2PxX.jpg', // Project Hail Mary
  '/wMrV8SLne1jHLeYS0lLrA1Tf86P.jpg', // Lee Cronin's The Mummy
  '/4EAAwpylq313qrDqpCxulUrXBNF.jpg', // Mortal Kombat II
  '/rZfmzpixLKLR3Hg2u0WgC7XLFl8.jpg', // Obsession
  '/xBT0oNq6rsTFv4SxG5uGRIEOrq6.jpg', // Michael
  '/y3fQa7pytlysovXzovpXc1OQlTW.jpg', // The Devil Wears Prada 2
  '/9Z2uDYXqJrlmePznQQJhL6d92Rq.jpg', // The Super Mario Galaxy Movie
  '/bVGHSe47W6oCQL1Q88pvRAet51A.jpg', // Remarkably Bright Creatures
  '/a8uQvrplTkhGJQog6GZ6CqF8An6.jpg', // The Sheep Detectives
  '/7OedxK0BvSKJ0ZWCPRYADViTBx6.jpg', // Star Wars: The Mandalorian and Grogu
  '/zMwhWailP1WY7sb6AoE6b8ugoy.jpg',  // Swapped
];

const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const ROTATE_MS = 2 * 60 * 1000; // 2 minutes

function toUrl(path: string) {
  return `${TMDB_BACKDROP_BASE}${path}`;
}

// Shuffle an array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AuthBackground() {
  // Shuffled list of backdrop paths (bare /xxx.jpg)
  const [backdrops, setBackdrops] = useState<string[]>(() => shuffle(FALLBACK_BACKDROPS));
  const indexRef = useRef(0);

  // Two image slots for crossfade — slot A starts visible, slot B hidden
  const [slotA, setSlotA] = useState(() => toUrl(shuffle(FALLBACK_BACKDROPS)[0]));
  const [slotB, setSlotB] = useState('');
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');

  // Fetch real TMDB trending backdrops once on mount
  useEffect(() => {
    if (!TMDB_API_KEY) return;

    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    )
      .then(r => r.json())
      .then((data: { results?: Array<{ backdrop_path: string | null }> }) => {
        const paths = (data.results ?? [])
          .map(m => m.backdrop_path)
          .filter((p): p is string => Boolean(p));

        if (paths.length > 0) {
          const shuffled = shuffle(paths);
          setBackdrops(shuffled);
          // Start showing the first real backdrop immediately
          setSlotA(toUrl(shuffled[0]));
          indexRef.current = 0;
        }
      })
      .catch(() => {
        // TMDB unavailable — keep showing fallbacks silently
      });
  }, []);

  // Rotate backgrounds on a timer
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % backdrops.length;
      indexRef.current = nextIndex;
      const nextUrl = toUrl(backdrops[nextIndex]);

      // Load the incoming image into the hidden slot, then flip activeSlot
      if (activeSlot === 'A') {
        setSlotB(nextUrl);
        setActiveSlot('B');
      } else {
        setSlotA(nextUrl);
        setActiveSlot('A');
      }
    }, ROTATE_MS);

    return () => clearInterval(timer);
  }, [backdrops, activeSlot]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Slot A */}
      <Image
        key={slotA}
        src={slotA}
        alt="Background"
        fill
        priority
        unoptimized={false}
        className="object-cover"
        style={{
          opacity: activeSlot === 'A' ? 0.55 : 0,
          transition: 'opacity 2s ease-in-out',
          willChange: 'opacity',
        }}
      />

      {/* Slot B — only mount once we have a URL */}
      {slotB && (
        <Image
          key={slotB}
          src={slotB}
          alt="Background"
          fill
          unoptimized={false}
          className="object-cover"
          style={{
            opacity: activeSlot === 'B' ? 0.55 : 0,
            transition: 'opacity 2s ease-in-out',
            willChange: 'opacity',
          }}
        />
      )}

      {/* Solid dark overlay so the form stays legible */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
    </div>
  );
}
