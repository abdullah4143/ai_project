'use client';

import Link from 'next/link';
import BlogList from '../components/BlogList';
import { useUserStore } from '../stores/useUserStore';

export default function BlogsPage() {
  const { user } = useUserStore();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Blogs</h1>
            <p className="text-gray-600">Explore and share stories from our community</p>
          </div>
          {user && (
            <Link
              href="/blogs/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Create New Blog
            </Link>
          )}
        </div>
        <BlogList />
      </div>
    </div>
  );
} 