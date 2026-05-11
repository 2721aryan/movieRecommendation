'use client';

import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-gray-400 text-sm mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
