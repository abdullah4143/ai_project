'use client';

import { useState } from 'react';
import Category from './Category';

const allCategories = [
  { name: 'Sports', slug: 'sports' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Health', slug: 'health' },
  { name: 'Science', slug: 'science' },
  { name: 'Business', slug: 'business' },
  { name: 'General', slug: 'general' },
];

export default function CategoryListWithLoadMore() {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="border-t border-gray-300 pt-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">Top News Categories</h2>
        <p className="text-center text-gray-600">Stay informed with the latest news in your favorite categories</p>
      </div>

      {allCategories.slice(0, visibleCount).map((category) => (
        <Category key={category.slug} category={category} limit={3} />
      ))}

      {visibleCount < allCategories.length && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600 hover:scale-101 transition-all duration-500 ease-in-out"
          >
            Load More Categories
          </button>
        </div>
      )}
    </div>
  );
}
