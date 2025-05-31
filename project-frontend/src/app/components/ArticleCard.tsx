import React from 'react';
import useBlogStore from '../stores/blogStore';
import { useUserStore } from '../stores/useUserStore';

interface Article {
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
}

interface ArticleCardProps {
  article: Article;
}

interface Bookmark {
  id: string;
  user: string;
  blog: string;
  userEmail: string;
  createdAt: string;
  article?: Article;
  articleUrl: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { addBookmark, removeBookmark, bookmarks } = useBlogStore();
  const { user } = useUserStore();

  const isBookmarked = bookmarks.some(bookmark => 
    bookmark.articleUrl === article.url && 
    bookmark.userEmail === user?.email
  );

  const handleBookmark = async () => {
    if (!user) return;

    try {
      if (isBookmarked) {
        const bookmark = bookmarks.find(b => 
          b.articleUrl === article.url && 
          b.userEmail === user.email
        );
        if (bookmark) {
          await removeBookmark(bookmark.id);
        }
      } else {
        await addBookmark(article.url, undefined, article);
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
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-2xl font-bold text-gray-900 hover:text-blue-600 mb-2 block"
        >
          {article.title}
        </a>
        <p className="text-gray-600 mb-4">
          {article.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-600">
              Source: {article.source.name}
            </p>
            <p className="text-sm text-gray-600">
              {article.author && `By: ${article.author} | `}{formatDate(article.publishedAt)}
            </p>
          </div>
          <button
            onClick={() => void handleBookmark()}
            disabled={!user}
            className={`p-2 rounded-full transition-colors ${
              !user 
                ? 'text-gray-400 cursor-not-allowed' 
                : isBookmarked 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600'
            }`}
            title={user ? (isBookmarked ? "Remove bookmark" : "Add bookmark") : "Login to bookmark"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill={isBookmarked ? "currentColor" : "none"}
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard; 