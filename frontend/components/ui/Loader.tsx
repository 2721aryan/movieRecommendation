'use client';

import { motion } from 'framer-motion';

export default function Loader({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <motion.div
        style={{ width: size, height: size }}
        className="border-4 border-gray-700 border-t-red-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-14 h-14 border-4 border-gray-700 border-t-red-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-gray-400 text-sm tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
