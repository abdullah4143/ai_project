'use client'

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNewArticle() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'technology' // default category
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const originalContent = useRef('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParaphrase = async () => {
    if (!formData.content.trim()) {
      setError('Please enter some content first');
      return;
    }

    originalContent.current = formData.content;
    
    try {
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formData.content }),
      });

      if (!response.ok) throw new Error('Paraphrasing failed');

      const { paraphrased } = await response.json();
      setFormData(prev => ({ ...prev, content: paraphrased }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Paraphrasing failed');
    }
  };

  const handleRevert = () => {
    if (originalContent.current) {
      setFormData(prev => ({ ...prev, content: originalContent.current }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!session?.user?.id) {
      setError('You must be logged in to create a blog');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          userId: session.user.id 
        }),
      });

      if (!response.ok) throw new Error('Failed to save blog');

      router.push('/my-blogs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="entertainment">Entertainment</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="flex space-x-2">
              {originalContent.current && (
                <button
                  type="button"
                  onClick={handleRevert}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  Revert
                </button>
              )}
              <button
                type="button"
                onClick={handleParaphrase}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm"
              >
                AI Paraphrase
              </button>
            </div>
          </div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}