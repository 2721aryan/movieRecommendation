'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, LogOut, User, BookMarked, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router    = useRouter();
  const pathname  = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-focus search input when it opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  // Close search on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Nav links — "Movies" removed (duplicates search)
  const navLinks = [
    { href: '/browse',  label: 'Home'    },
    { href: '/my-list', label: 'My List' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-black/95 shadow-lg backdrop-blur-md' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 h-16 gap-4">

        {/* Logo — hidden when search is open on mobile */}
        <Link
          href={isAuthenticated ? '/browse' : '/'}
          className={`flex-shrink-0 transition-opacity ${searchOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}
        >
          <span className="text-red-600 font-black text-2xl tracking-tight">{APP_NAME}</span>
        </Link>

        {/* Desktop nav links */}
        {isAuthenticated && !searchOpen && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Inline Search bar — expands across the navbar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={  { opacity: 0, width: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center gap-2 bg-gray-900/90 border border-gray-600 focus-within:border-white rounded overflow-hidden px-3 py-1.5"
            >
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search titles, genres, directors…"
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none min-w-0"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-white flex-shrink-0 transition-colors"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Right section */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {isAuthenticated ? (
            <>
              {/* Search toggle */}
              {!searchOpen && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors p-1.5"
                  aria-label="Open search"
                >
                  <Search size={20} />
                </button>
              )}
              <button className="text-gray-300 hover:text-white transition-colors p-1.5 hidden md:block" aria-label="Notifications">
                <Bell size={20} />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded overflow-hidden bg-gray-700">
                    <Image
                      src={user?.active_profile?.avatar ?? user?.profiles[0]?.avatar ?? '/images/profiles/avatar1.png'}
                      alt="Profile"
                      width={32} height={32}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-300 transition-transform hidden md:block ${dropOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={  { opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-gray-900/95 border border-white/10 rounded-lg shadow-2xl overflow-hidden backdrop-blur-md"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className="text-white text-sm font-semibold">{user?.name}</p>
                        <p className="text-gray-400 text-xs">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setDropOpen(false); router.push('/profile/select'); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <User size={16} /> Switch Profile
                        </button>
                        <button
                          onClick={() => { setDropOpen(false); router.push('/my-list'); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <BookMarked size={16} /> My List
                        </button>
                        <button
                          onClick={() => { setDropOpen(false); handleLogout(); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden text-gray-300 hover:text-white p-1"
                onClick={() => setMobileOpen(v => !v)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              {!searchOpen && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors p-1.5"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              )}
              <Link
                href="/login"
                className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav menu */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={  { opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-t border-white/10 overflow-hidden"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="block w-full text-left px-6 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
              Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
