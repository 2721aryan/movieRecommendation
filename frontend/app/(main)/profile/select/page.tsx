'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ProfileCard from '@/components/profile/ProfileCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';
import { PROFILE_AVATARS } from '@/lib/constants';
import { Profile } from '@/types/auth';
import { APP_NAME } from '@/lib/constants';

export default function ProfileSelectPage() {
  const router              = useRouter();
  const { user, isAuthenticated, setProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [selected, setSelected]       = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Please sign in to select a profile.</p>
        <Button onClick={() => router.push('/login')}>Sign In</Button>
      </div>
    );
  }

  const handleSelect = (profile: Profile) => {
    if (editMode) return;
    setProfile(profile);
    router.push('/browse');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-600 font-black text-3xl mb-12"
      >
        {APP_NAME}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-white mb-10"
      >
        {editMode ? 'Manage Profiles' : "Who's watching?"}
      </motion.h1>

      {/* Profile grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-6 mb-12"
      >
        {user.profiles.map(profile => (
          <div key={profile.id} className="relative">
            <ProfileCard
              profile={profile}
              selected={user.active_profile?.id === profile.id}
              onClick={() => handleSelect(profile)}
            />
            {editMode && (
              <div className="absolute inset-0 flex items-start justify-end p-1 pointer-events-none">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border border-white/20">
                  <Pencil size={10} className="text-gray-300" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add profile */}
        {editMode && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={  { scale: 0.95 }}
            onClick={() => setAvatarModal(true)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg border-2 border-dashed border-gray-600 hover:border-white flex items-center justify-center transition-colors bg-gray-900/40">
              <Plus className="text-gray-500 group-hover:text-white transition-colors" size={36} />
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
              Add Profile
            </span>
          </motion.button>
        )}
      </motion.div>

      {/* Manage / Done button */}
      <button
        onClick={() => setEditMode(v => !v)}
        className="text-sm font-semibold text-gray-300 hover:text-white border border-gray-500 hover:border-white px-8 py-2.5 rounded transition-all"
      >
        {editMode ? 'Done' : 'Manage Profiles'}
      </button>

      {/* Avatar picker modal */}
      <Modal open={avatarModal} onClose={() => setAvatarModal(false)} title="Choose an Avatar">
        <div className="grid grid-cols-3 gap-4 mt-2">
          {PROFILE_AVATARS.map(av => (
            <button
              key={av.id}
              onClick={() => { setSelected(av.id); }}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selected === av.id ? 'border-red-500 scale-105' : 'border-transparent hover:border-white/40'
              }`}
            >
              <Image src={av.src} alt={av.label} fill className="object-cover" />
            </button>
          ))}
        </div>
        <Button className="w-full mt-4" onClick={() => setAvatarModal(false)}>
          Confirm
        </Button>
      </Modal>
    </div>
  );
}
