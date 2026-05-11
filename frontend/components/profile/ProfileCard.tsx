'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Profile } from '@/types/auth';

interface ProfileCardProps {
  profile:   Profile;
  selected?: boolean;
  onClick:   () => void;
}

export default function ProfileCard({ profile, selected, onClick }: ProfileCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={  { scale: 0.95 }}
      className="flex flex-col items-center gap-3 group cursor-pointer"
    >
      <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
        selected ? 'border-white' : 'border-transparent group-hover:border-white/60'
      }`}>
        <Image
          src={profile.avatar}
          alt={profile.name}
          fill
          className="object-cover"
        />
        {selected && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Check className="text-white" size={32} />
          </div>
        )}
      </div>
      <span className={`text-sm font-medium transition-colors ${
        selected ? 'text-white' : 'text-gray-400 group-hover:text-white'
      }`}>
        {profile.name}
      </span>
    </motion.button>
  );
}
