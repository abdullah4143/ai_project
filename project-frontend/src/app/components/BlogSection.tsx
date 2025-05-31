'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useBlogStore from '../stores/blogStore';
import { useUserStore } from '../stores/useUserStore';

type Blog = {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export default function BlogSection() {
  const router = useRouter();
  const { user } = useUserStore();
  const { blogs, loading, error, fetchUserBlogs, setSelectedBlog } = useBlogStore();

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  const handleBlogClick = async (blog: Blog) => {
    setSelectedBlog(blog);
    await router.push('/blogs/view-blog');
  };

  if (loading) {
    return <div>Loading blogs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blogs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No blogs available.</p>
        {user && (
          <button
            onClick={() => router.push('/blogs/new')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Your First Blog
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div
          key={`blog-${blog.id}`}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => {
            void handleBlogClick(blog);
          }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
            <p className="text-gray-600 mb-4">{blog.content.substring(0, 200)}...</p>
            <div className="text-sm text-gray-500">
              Posted by {blog.authorEmail} on {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 