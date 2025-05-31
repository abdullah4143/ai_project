import { create } from 'zustand';

export interface Article {
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

interface ArticleStore {
  articles: Article[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  selectedArticle: Article | null;
  fetchHeadlines: () => Promise<void>;
  fetchArticlesByCategory: (category: string) => Promise<void>;
  fetchLimitedArticlesByCategory: (category: string, pageSize: number) => Promise<void>;
  setSelectedCategory: (category: string) => void;
  setSelectedArticle: (article: Article) => void;
}

const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  loading: false,
  error: null,
  selectedCategory: 'general',
  selectedArticle: null,

  fetchHeadlines: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/articles/headlines');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch headlines');
      }

      const data = await response.json();
      set({ articles: data.articles, loading: false });
    } catch (error: any) {
      console.error('Error fetching headlines:', error);
      set({ error: error.message || 'Failed to fetch headlines', loading: false });
    }
  },

  fetchArticlesByCategory: async (category: string) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`/api/articles/category/${category}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch articles');
      }

      const data = await response.json();
      set({ articles: data.articles, loading: false, selectedCategory: category });
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      set({ error: error.message || 'Failed to fetch articles', loading: false });
    }
  },

  fetchLimitedArticlesByCategory: async (category: string, pageSize: number) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`/api/articles/category/${category}/${pageSize}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch articles');
      }

      const data = await response.json();
      set({ articles: data.articles, loading: false, selectedCategory: category });
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      set({ error: error.message || 'Failed to fetch articles', loading: false });
    }
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
  },

  setSelectedArticle: (article: Article) => {
    set({ selectedArticle: article });
  },
}));

export default useArticleStore;
