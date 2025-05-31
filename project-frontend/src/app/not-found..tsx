import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col bg-white text-gray-900 font-sans p-10 text-center">
      <h1 className="text-5xl font-bold mb-4 tracking-wide">404</h1>
      <p className="text-xl italic mb-6">The story you&apos;re chasing slipped through the reels.</p>
      <Link
        href="/"
        className="text-sm uppercase tracking-wider font-bold text-pink-700 hover:underline"
      >
        Back to the newsroom
      </Link>
    </main>
  );
}
