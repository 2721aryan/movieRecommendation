import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold text-red-600 mb-2 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-3">
          Lost your way?
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home screen.
        </p>
        <Link
          href="/browse"
          className="inline-block bg-white text-black font-semibold text-sm px-8 py-3 rounded hover:bg-gray-200 transition-colors duration-200"
        >
          NFLIX Home
        </Link>
      </div>
    </div>
  );
}
