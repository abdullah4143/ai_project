import React, { useEffect } from 'react';
import useArticleStore from '../stores/articleStore';
import ArticleCard from './ArticleCard';
import CategorySelector from './CategorySelector';

const ArticleList: React.FC = () => {
  const { articles, loading, error, fetchHeadlines } = useArticleStore();

  useEffect(() => {
    fetchHeadlines();
  }, [fetchHeadlines]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Latest News</h1>
      <CategorySelector />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleList; 