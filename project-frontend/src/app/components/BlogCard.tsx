import React from 'react';
import useBlogStore from '../stores/blogStore';
import { useUserStore } from '../stores/useUserStore';

interface Blog {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogCardProps {
  blog: Blog;
  onEdit: () => void;
}

interface Bookmark {
  id: string;
  user: string;
  blog: string;
  userEmail: string;
  createdAt: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onEdit }) => {
  const { deleteBlog, isUserBlog, addBookmark, removeBookmark, bookmarks } = useBlogStore();
  const { user } = useUserStore();

  const isBookmarked = bookmarks.some(bookmark => 
    bookmark.blog === blog.id && 
    bookmark.userEmail === user?.email
  );

  const handleDelete = async () => {
    try {
      await deleteBlog(blog.id);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user) return;

    try {
      if (isBookmarked) {
        const bookmark = bookmarks.find(b => 
          b.blog === blog.id && 
          b.userEmail === user.email
        );
        if (bookmark) {
          await removeBookmark(bookmark.id);
        }
      } else {
        await addBookmark(undefined, blog.id);
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
        <p className="text-gray-700 mb-4">{blog.content}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            By: {blog.authorEmail} | {formatDate(blog.createdAt)}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => void handleBookmark()}
              disabled={!user}
              className={`p-2 rounded-full hover:bg-gray-100 ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
              title={user ? (isBookmarked ? "Remove bookmark" : "Add bookmark") : "Login to bookmark"}
            >
              {isBookmarked ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
            {isUserBlog(blog) && (
              <>
                <button
                  onClick={onEdit}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => void handleDelete()}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard; 