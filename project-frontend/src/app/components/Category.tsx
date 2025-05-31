'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useArticleStore, { Article } from '@/app/stores/articleStore';
import { API_CONFIG } from '@/config/api';

interface ArticleStore {
  setSelectedArticle: (article: Article) => void;
}

interface CategorySectionProps {
  category: {
    name: string;
    slug: string;
  };
  limit?: number;
}

export default function Category({ category, limit = 3 }: CategorySectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSelectedArticle = useArticleStore((state: ArticleStore) => state.setSelectedArticle);
  const router = useRouter();

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_CONFIG.NEWS_API_URL}/${category.slug}/${limit}`);
        setArticles(response.data.articles || []);
      } catch (err) {
        setError('Failed to fetch articles');
        console.error(`Error fetching articles for ${category.slug}:`, err);
      }
      setLoading(false);
    }

    fetchArticles();
  }, [category.slug, limit]);

  return (
    <section className="mb-12 space-y-12">
      {/* <h2 className="text-2xl font-bold border-b pb-2 mb-4">Categories</h2> */}
    
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold capitalize">{category.name}</h2>
        <Link href={`/category/${category.slug}`} className="text-pink-400 hover:underline text-sm">
          View All
        </Link>
      </div>

      {loading && <p>Loading articles...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-6">
        {!loading &&
          !error &&
          articles.map((article, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedArticle(article);
                router.push('/article');
              }}
              className="cursor-pointer flex-1 min-w-[280px] max-w-[32%] border shadow-sm p-4 rounded transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-md"
            >
              <div className="w-full h-[200px] overflow-hidden rounded mb-3">
                <Image
                  src={article.urlToImage?.trim() || 'https://placehold.co/600x400?text=No+Image'}
                  alt={article.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{article.title}</h3>
              {/* <p className="text-xs text-gray-500 mt-1">{article.date || new Date(article.publishedAt).toLocaleDateString('en-US')}</p> */}
              <p className="text-sm text-gray-700 mt-2">{article.description}</p>
              <p className="text-sm text-gray-500 mt-2">Source: {article.source.name}</p>
              <p className="text-sm text-gray-500">
                Published: {new Date(article.publishedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}
