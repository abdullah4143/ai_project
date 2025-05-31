'use client'

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import useArticleStore, { Article } from "../stores/articleStore";
import { useRouter } from "next/navigation";
import { API_CONFIG } from '@/config/api';

export default function HeroSection() {
  const selectedCategory = useArticleStore((state) => state.setSelectedCategory);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();  
  const setSelectedArticle = useArticleStore((state) => state.setSelectedArticle);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_CONFIG.NEWS_API_URL}/headlines`);
        setArticles(response.data.articles || []);
      } catch (err) {
        setError('Failed to fetch articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return (
    <>
      {loading ? (
         <div className="flex flex-col md:grid md:grid-cols-5 gap-6 px-4 py-6 animate-pulse">
          {/* Center Skeleton */}
          <div className="order-1 md:order-2 md:col-span-3 space-y-3">
            <div className="w-full h-64 bg-gray-200 rounded" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Left Skeleton */}
          <div className="order-2 md:order-1 md:col-span-1 space-y-6">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>

          {/* Right Skeleton */}
          <div className="order-3 md:order-3 md:col-span-1 space-y-6">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col gap-4 justify-center items-center text-center h-100 bg-gray-100">
          <h1 className="font-extrabold text-3xl">Failed to fetch latest headlines</h1>
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
            <div className="flex flex-col md:grid md:grid-cols-5 gap-6 px-4 py-6">
          
          {/* Center Block */}
          <div className="order-1 md:order-2 md:col-span-3 space-y-3">
            {articles[2] && (
              <div
                onClick={() => {
                  setSelectedArticle(articles[2]);
                  selectedCategory('Headline')
                  router.push('/article');
                }}
                className="cursor-pointer space-y-3"
              >
              {articles[2].urlToImage &&
                <Image
                src={articles[2].urlToImage}
                alt={articles[2].title}
                width={800}
                height={450}
                className="w-full object-cover rounded"
                />
              }
                <h2 className="font-bold text-xl">{articles[2].title}</h2>
                <p className="text-sm">
                  {articles[2].description || articles[2].content?.slice(0, 120) + '...'}
                </p>
                <p className="text-xs text-gray-500">
                  By {articles[2].author || 'Unknown'} – {new Date(articles[2].publishedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Left Sidebar */}
          <div className="order-2 md:order-1 md:col-span-1 space-y-6">
            {articles.slice(0, 2).map((article, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedArticle(article);
                  selectedCategory('Headline')

                  router.push('/article');
                }}
                className="cursor-pointer space-y-2"
              >
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <p className="text-sm">
                  {article.description || article.content?.slice(0, 120) + '...'}
                </p>
                <p className="text-sm text-gray-500">Source: {article.source.name}</p>
                <span className="text-black font-semibold text-sm mt-2 inline-block">
                  READ MORE →
                </span>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="order-3 md:order-3 md:col-span-1 space-y-6">
            {articles.slice(3, 5).map((article, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedArticle(article);
                  selectedCategory('Headline')

                  router.push('/article');
                }}
                className="cursor-pointer space-y-2"
              >
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <p className="text-sm">
                  {article.description || article.content?.slice(0, 120) + '...'}
                </p>
                <p className="text-sm text-gray-500">Source: {article.source.name}</p>
                <span className="text-black font-semibold text-sm mt-2 inline-block">
                  READ MORE →
                </span>
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
