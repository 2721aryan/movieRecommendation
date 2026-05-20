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
      // eslint-disable-next-line
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
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(0, 0, 0, 0.95)'
          : 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: '0 48px', height: '68px', gap: '16px' }}
      >

        {/* Logo — hidden when search is open on mobile */}
        <Link
          href={isAuthenticated ? '/browse' : '/'}
          className={`flex-shrink-0 transition-opacity ${searchOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}
        >
          <span className="text-red-600 font-black tracking-tight" style={{ fontSize: '28px' }}>{APP_NAME}</span>
        </Link>

        {/* Desktop nav links */}
        {isAuthenticated && !searchOpen && (
          <div className="hidden md:flex items-center" style={{ gap: '28px' }}>
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
              className="flex-1 flex items-center bg-gray-900/90 border border-gray-600 focus-within:border-white overflow-hidden"
              style={{ gap: '8px', padding: '6px 12px', borderRadius: '4px' }}
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
        <div className="flex items-center flex-shrink-0" style={{ gap: '12px' }}>
          {isAuthenticated ? (
            <>
              {/* Search toggle */}
              {!searchOpen && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ padding: '6px' }}
                  aria-label="Open search"
                >
                  <Search size={20} />
                </button>
              )}
              <button
                className="text-gray-300 hover:text-white transition-colors hidden md:block"
                style={{ padding: '6px' }}
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="flex items-center hover:opacity-80 transition-opacity"
                  style={{ gap: '6px' }}
                >
                  <div className="overflow-hidden bg-gray-700" style={{ width: '32px', height: '32px', borderRadius: '4px' }}>
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
                      className="absolute right-0 top-full bg-gray-900/95 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md"
                      style={{ marginTop: '8px', width: '210px', borderRadius: '8px' }}
                    >
                      <div className="border-b border-white/10" style={{ padding: '12px' }}>
                        <p className="text-white text-sm font-semibold">{user?.name}</p>
                        <p className="text-gray-400 text-xs">{user?.email}</p>
                      </div>
                      <div style={{ padding: '4px 0' }}>
                        <button
                          onClick={() => { setDropOpen(false); router.push('/profile/select'); }}
                          className="flex items-center w-full text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                          style={{ gap: '12px', padding: '10px 16px' }}
                        >
                          <User size={16} /> Switch Profile
                        </button>
                        <button
                          onClick={() => { setDropOpen(false); router.push('/my-list'); }}
                          className="flex items-center w-full text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                          style={{ gap: '12px', padding: '10px 16px' }}
                        >
                          <BookMarked size={16} /> My List
                        </button>
                        <button
                          onClick={() => { setDropOpen(false); handleLogout(); }}
                          className="flex items-center w-full text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                          style={{ gap: '12px', padding: '10px 16px' }}
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
                className="md:hidden text-gray-300 hover:text-white"
                style={{ padding: '4px' }}
                onClick={() => setMobileOpen(v => !v)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            <div className="flex items-center" style={{ gap: '12px' }}>
              {!searchOpen && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors"
                  style={{ padding: '6px' }}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              )}
              <Link
                href="/login"
                className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors whitespace-nowrap"
                style={{ padding: '8px 20px', borderRadius: '4px' }}
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
                className="block text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                style={{ padding: '12px 24px' }}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="block w-full text-left text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
              style={{ padding: '12px 24px' }}
            >
              Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
