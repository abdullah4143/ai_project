'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import useArticleStore, { Article as StoreArticle } from '@/app/stores/articleStore';

interface Article extends StoreArticle {
  date?: string;
  summary?: string;
  slug?: string;
}

const allCategories = [
  { name: 'Sports', slug: 'sports' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Health', slug: 'health' },
  { name: 'Science', slug: 'science' },
  { name: 'Business', slug: 'business' },
  { name: 'General', slug: 'general' },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const categorySlug = slug as string;

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const setSelectedArticle = useArticleStore((state) => state.setSelectedArticle);
  const setSelectedCategory = useArticleStore((state) => state.setSelectedCategory);
  const router = useRouter();

  useEffect(() => {
    if (!categorySlug) return;

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/articles/${categorySlug}`)
      .then((response) => {
        setArticles(response.data.articles);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError('Failed to fetch articles');
        setLoading(false);
      });
  }, [categorySlug]);

  return (
    <main className="font-sans text-gray-900 px-6 py-8 flex gap-10 max-w-screen-xl mx-auto">
      {/* Sidebar: Categories */}
      <aside className="hidden md:block w-64 bg-gray-50 p-6 rounded-md border border-gray-200 h-fit sticky top-24">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Categories</h2>
        <ul className="space-y-3">
          {allCategories.map(({ name, slug }) => (
            <li key={slug}>
              <Link
                href={`/category/${slug}`}
                className={`block px-3 py-2 rounded hover:bg-pink-100 transition-colors duration-200 ${
                  categorySlug === slug ? 'bg-pink-200 font-semibold' : 'text-gray-700'
                }`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <section className="flex-1">
        <header className="w-full bg-pink-100 mb-6 rounded-md p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Go Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-4xl font-extrabold border-b-4 border-gray-900 inline-block capitalize tracking-wide">
                {categorySlug || 'NA'}
              </h1>
            </div>
            <button
              onClick={() => setShowMobileCategories(!showMobileCategories)}
              className="md:hidden inline-flex items-center p-2 rounded-md hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              aria-label="Toggle Categories Menu"
            >
              <svg
                className="h-8 w-8 text-gray-800"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {showMobileCategories ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          <p className="text-gray-500 italic max-w-md">
            All stories filed under <span className="font-semibold">`{categorySlug || 'NA'}`</span>
          </p>

          {showMobileCategories && (
            <nav className="md:hidden mt-4 bg-pink-50 rounded-md p-4 shadow-inner border border-pink-200">
              <ul className="flex flex-col space-y-2">
                {allCategories.map(({ name, slug }) => (
                  <li key={slug}>
                    <Link
                      href={`/category/${slug}`}
                      onClick={() => setShowMobileCategories(false)}
                      className={`block px-3 py-2 rounded hover:bg-pink-100 transition-colors duration-200 ${
                        categorySlug === slug ? 'bg-pink-200 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>

        {loading && (
          <section className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full sm:w-[48%] lg:w-[45%] xl:w-[30%] border p-5 shadow-sm animate-pulse flex flex-col gap-4"
              >
                <div className="w-full aspect-[3/2] bg-gray-300 rounded" />
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </section>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && articles.length === 0 && <p>No articles found.</p>}

        <section className="flex flex-wrap justify-center gap-6">
          {articles.map((article, key) => (
            <div
              key={key}
              onClick={() => {
                setSelectedArticle(article);
                setSelectedCategory(categorySlug);
                router.push('/article');
              }}
              className="w-full sm:w-[48%] lg:w-[45%] xl:w-[30%] border p-5 shadow-sm hover:shadow-lg hover:scale-101 transition-transform duration-500 flex flex-col cursor-pointer"
            >
              <Link href={`/article/${article.slug}`} className="flex flex-col h-full">
                <div className="w-full aspect-[3/2] overflow-hidden rounded mb-3">
                  <Image
                    src={
                      article.urlToImage?.trim()
                        ? article.urlToImage
                        : 'https://placehold.co/600x400?text=No+Image'
                    }
                    alt={article.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{article.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{article.date}</p>
                <p className="text-sm mt-2 text-gray-700 flex-grow">{article.summary}</p>
                <p className="text-sm text-gray-700 mt-4">Author: {article.author}</p>
                <p className="text-sm text-gray-500">Source: {article.source.name}</p>
                <p className="text-sm text-gray-500">
                  Published:{' '}
                  {new Date(article.publishedAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </Link>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
