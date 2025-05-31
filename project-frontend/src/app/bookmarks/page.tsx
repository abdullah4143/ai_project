'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useBlogStore from '../stores/blogStore';
import { useUserStore } from '../stores/useUserStore';
import { TrashIcon } from '@heroicons/react/24/outline';

type Blog = {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

type Article = {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
};

type Bookmark = {
  id: string;
  user: string;
  blog?: string;
  articleUrl?: string;
  article?: Article;
  userEmail: string;
  createdAt: string;
};

export default function BookmarksPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { bookmarks, blogs, fetchBookmarks, fetchUserBlogs, setSelectedBlog, removeBookmark } = useBlogStore();

  useEffect(() => {
    // If not logged in, redirect to login page
    if (!user) {
      router.push('/login');
      return;
    }

    // Only fetch if user is logged in
    fetchBookmarks();
    fetchUserBlogs();
  }, [user, fetchBookmarks, fetchUserBlogs, router]);

  const handleBlogClick = async (blogId: string) => {
    if (!blogId) return;
    const blog = blogs.find(b => b.id === blogId);
    if (blog) {
      setSelectedBlog(blog);
      await router.push('/blogs/view-blog');
    }
  };

  const handleArticleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (bookmarkId: string) => {
    try {
      await removeBookmark(bookmarkId);
      // Refresh bookmarks after deletion
      fetchBookmarks();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  // Show loading state while checking authentication
  if (!user) {
    return null;
  }

  if (!bookmarks.length) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>
        <p className="text-gray-600">You haven't bookmarked any blogs yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>
      <div className="space-y-6">
        {bookmarks.map((bookmark) => {
          // Handle blog bookmarks
          if (bookmark.blog) {
            const blog = blogs.find(b => b.id === bookmark.blog);
            // Skip rendering if the blog no longer exists
            if (!blog) return null;
            
            return (
              <div
                key={`blog-bookmark-${bookmark.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-grow cursor-pointer"
                      onClick={() => void handleBlogClick(bookmark.blog as string)}
                    >
                      <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                      <p className="text-gray-600 mb-4">{blog.content.substring(0, 200)}...</p>
                      <div className="text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">Blog</span>
                        Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {user.email === bookmark.userEmail && (
                      <button
                        onClick={() => void handleDelete(bookmark.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete bookmark"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Handle article bookmarks
          if (bookmark.articleUrl && bookmark.article) {
            return (
              <div
                key={`article-bookmark-${bookmark.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-grow cursor-pointer"
                      onClick={() => handleArticleClick(bookmark.articleUrl!)}
                    >
                      <h2 className="text-xl font-semibold mb-2">{bookmark.article.title}</h2>
                      <p className="text-gray-600 mb-4">{bookmark.article.description}</p>
                      <div className="text-sm text-gray-500">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">Article</span>
                        From {bookmark.article.source.name} • Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {user.email === bookmark.userEmail && (
                      <button
                        onClick={() => void handleDelete(bookmark.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete bookmark"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        }).filter(Boolean)}
      </div>
    </div>
  );
} 