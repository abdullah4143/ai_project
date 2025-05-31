'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import useBlogStore from '../stores/blogStore';
import { useUserStore } from '../stores/useUserStore';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

interface Bookmark {
  id: string;
  blog: {
    id: string;
    title: string;
    content: string;
  };
  user: {
    id: string;
    email: string;
  };
  createdAt: string;
}

export default function BlogList() {
  const { blogs, bookmarks, fetchUserBlogs, fetchBookmarks, addBookmark, removeBookmark, deleteBlog, isBookmarked, setSelectedBlog } = useBlogStore();
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchUserBlogs();
    fetchBookmarks();
  }, []);

  const handleBlogClick = (blog: any) => {
    setSelectedBlog(blog);
    router.push('/blogs/view-blog');
  };

  const handleBookmarkToggle = async (blogId: string) => {
    if (!user) return;

    try {
      const bookmark = bookmarks.find(b => b.blog === blogId);
      if (bookmark) {
        await removeBookmark(bookmark.id);
      } else {
        await addBookmark(undefined, blogId);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleDelete = async (blogId: string) => {
    try {
      await deleteBlog(blogId);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  if (!blogs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No blogs available at the moment.</p>
        {user && (
          <Link
            href="/blogs/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Your First Blog
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {blogs.map((blog,key) => (
        <div key={blog.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow cursor-pointer" onClick={() => handleBlogClick(blog)}>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                  {blog.title}
                </h2>
                <p className="mt-3 text-gray-600 line-clamp-3">{blog.content}</p>
              </div>
              <button
                onClick={() => handleBookmarkToggle(blog.id)}
                disabled={!user}
                className={`ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={user ? 'Toggle bookmark' : 'Login to bookmark'}
              >
                {isBookmarked(blog.id) ? (
                  <BookmarkSolid className="h-6 w-6 text-indigo-600" />
                ) : (
                  <BookmarkOutline className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Posted on {new Date(blog.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 