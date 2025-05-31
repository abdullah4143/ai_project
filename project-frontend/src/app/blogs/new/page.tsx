'use client';

import { useRouter } from 'next/navigation';
import BlogForm from '../../components/BlogForm';

export default function NewBlogPage() {
  const router = useRouter();

  const handleSubmit = () => {
    router.push('/blogs');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Blog</h1>
      <BlogForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
} 