'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '../../stores/useUserStore';
import useBlogStore from '../../stores/blogStore';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

export default function ViewBlogPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { selectedBlog, bookmarks, addBookmark, removeBookmark, isBookmarked, clearSelectedBlog } = useBlogStore();
  const hasAttemptedRedirect = useRef(false);

  useEffect(() => {
    // Only redirect if we haven't already tried and there's no selected blog
    if (!hasAttemptedRedirect.current && !selectedBlog) {
      hasAttemptedRedirect.current = true;
      router.push('/blogs');
      return;
    }

    return () => {
      // Only clear when actually navigating away, not during initial load
      if (hasAttemptedRedirect.current && selectedBlog) {
        clearSelectedBlog();
      }
    };
  }, [selectedBlog, router, clearSelectedBlog]);

  const handleBookmarkToggle = async () => {
    if (!user || !selectedBlog) return;

    try {
      const bookmark = bookmarks.find(b => b.blog === selectedBlog.id);
      if (bookmark) {
        await removeBookmark(bookmark.id);
      } else {
        await addBookmark(undefined, selectedBlog.id);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Show loading only on initial load before redirect attempt
  if (!selectedBlog && !hasAttemptedRedirect.current) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!selectedBlog && hasAttemptedRedirect.current) {
    return null;
  }

  // Type guard to ensure selectedBlog is not null from this point on
  if (!selectedBlog) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h1>
            <div className="text-sm text-gray-500">
              Posted by {selectedBlog.authorEmail} on {new Date(selectedBlog.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={handleBookmarkToggle}
            disabled={!user}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={user ? 'Toggle bookmark' : 'Login to bookmark'}
          >
            {isBookmarked(selectedBlog.id) ? (
              <BookmarkSolid className="h-6 w-6 text-indigo-600" />
            ) : (
              <BookmarkOutline className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </header>

        <div className="prose max-w-none">
          {selectedBlog.content.split('\n').map((paragraph: string, index: number) => (
            <p key={`paragraph-${index}`} className="text-gray-700 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <Link
              href="/blogs"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Blogs
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
} 