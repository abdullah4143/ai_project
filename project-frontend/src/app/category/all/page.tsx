'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Category from '@/app/components/Category';
import Link from 'next/link';

const allCategories = [
  { name: 'Sports', slug: 'sports' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Health', slug: 'health' },
  { name: 'Science', slug: 'science' },
  { name: 'Business', slug: 'business' },
  { name: 'General', slug: 'general' },
];

export default function ViewAllCategoriesPage() {
  const [visibleCount, setVisibleCount] = useState(3);
  const router = useRouter();

  const handleLoadMore = () => {
    setVisibleCount(allCategories.length);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Navbar */}
      <header className="w-full bg-pink-100 mb-10 rounded-md p-6 flex flex-col shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-200 transition-colors duration-200 shadow-sm"
              aria-label="Go Back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h1 className="text-2xl md:text-3xl font-extrabold border-b-4 border-gray-900 inline-block capitalize tracking-wide">
              Browse All
            </h1>
          </div>
        </div>
      </header>

      {/* Main layout with sidebar and categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block md:col-span-1 bg-gray-50 p-6 rounded-md border border-gray-200 sticky top-20 self-start h-fit">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Categories</h2>
          <ul className="space-y-3">
            {allCategories.map(({ name, slug }) => (
              <li key={slug}>
                <Link
                  href={`/category/${slug}`}
                  className="block px-3 py-2 rounded hover:bg-pink-100 transition-colors duration-200"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <section className="md:col-span-3 space-y-6">
          {allCategories.slice(0, visibleCount).map((category) => (
            <Category key={category.slug} category={category} limit={3} />
          ))}

          {visibleCount < allCategories.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
