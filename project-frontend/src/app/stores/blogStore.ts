import { create } from 'zustand';
import { useUserStore } from './useUserStore';

interface Blog {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface Bookmark {
  id: string;
  user: string;
  blog?: string;
  articleUrl?: string;
  article?: any;
  userEmail: string;
  createdAt: string;
}

interface BlogStore {
  blogs: Blog[];
  bookmarks: Bookmark[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
  fetchUserBlogs: () => Promise<void>;
  createBlog: (title: string, content: string) => Promise<void>;
  updateBlog: (id: string, title: string, content: string) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  fetchBookmarks: () => Promise<void>;
  addBookmark: (articleUrl?: string, blogId?: string, article?: any) => Promise<void>;
  removeBookmark: (bookmarkId: string) => Promise<void>;
  isUserBlog: (blog: Blog) => boolean;
  isBookmarked: (id: string) => boolean;
  setSelectedBlog: (blog: Blog) => void;
  clearSelectedBlog: () => void;
  clearStore: () => void;
}

const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  bookmarks: [],
  selectedBlog: null,
  loading: false,
  error: null,

  fetchUserBlogs: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/blogs');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch blogs');
      }

      const data = await response.json();
      set({ blogs: data, loading: false });
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      set({ error: error.message || 'Failed to fetch blogs', loading: false });
    }
  },

  createBlog: async (title: string, content: string) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog');
      }

      const newBlog = await response.json();
      set(state => ({
        blogs: [...state.blogs, newBlog],
        loading: false
      }));
    } catch (error: any) {
      console.error('Error creating blog:', error);
      set({ error: error.message || 'Failed to create blog', loading: false });
      throw error;
    }
  },

  updateBlog: async (id: string, title: string, content: string) => {
    try {
      const blog = get().blogs.find(b => b.id === id);
      if (!blog) {
        throw new Error('Blog not found');
      }

      set({ loading: true, error: null });
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog');
      }

      const updatedBlog = await response.json();
      set(state => ({
        blogs: state.blogs.map(blog => blog.id === id ? updatedBlog : blog),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error updating blog:', error);
      set({ error: error.message || 'Failed to update blog', loading: false });
      throw error;
    }
  },

  deleteBlog: async (id: string) => {
    try {
      const blog = get().blogs.find(b => b.id === id);
      if (!blog) {
        throw new Error('Blog not found');
      }

      set({ loading: true, error: null });
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete blog');
      }

      set(state => ({
        blogs: state.blogs.filter(blog => blog.id !== id),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      set({ error: error.message || 'Failed to delete blog', loading: false });
      throw error;
    }
  },

  fetchBookmarks: async () => {
    try {
      set({ loading: true, error: null });
      const user = useUserStore.getState().user;
      if (!user) {
        set({ bookmarks: [], loading: false });
        return;
      }

      const response = await fetch(`/api/bookmarks/user/${encodeURIComponent(user.email)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bookmarks');
      }

      const data = await response.json();
      set({ bookmarks: data, loading: false });
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      set({ error: error.message || 'Failed to fetch bookmarks', loading: false });
    }
  },

  addBookmark: async (articleUrl?: string, blogId?: string, article?: any) => {
    try {
      const user = useUserStore.getState().user;
      if (!user) {
        throw new Error('Please log in to bookmark this item');
      }

      set({ loading: true, error: null });
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          articleUrl,
          article,
          userEmail: user.email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add bookmark');
      }

      const newBookmark = await response.json();
      set(state => ({
        bookmarks: [...state.bookmarks, newBookmark],
        loading: false
      }));
    } catch (error: any) {
      console.error('Error adding bookmark:', error);
      set({ error: error.message || 'Failed to add bookmark', loading: false });
      throw error;
    }
  },

  removeBookmark: async (bookmarkId: string) => {
    try {
      const user = useUserStore.getState().user;
      if (!user) {
        throw new Error('Please log in to remove this bookmark');
      }

      set({ loading: true, error: null });
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove bookmark');
      }

      set(state => ({
        bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== bookmarkId),
        loading: false
      }));
    } catch (error: any) {
      console.error('Error removing bookmark:', error);
      set({ error: error.message || 'Failed to remove bookmark', loading: false });
      throw error;
    }
  },

  isUserBlog: (blog: Blog) => {
    const user = useUserStore.getState().user;
    return user ? blog.authorEmail === user.email : false;
  },

  isBookmarked: (id: string) => {
    const user = useUserStore.getState().user;
    if (!user) return false;
    return get().bookmarks.some(bookmark => 
      (bookmark.blog === id || bookmark.articleUrl === id) && 
      bookmark.userEmail === user.email
    );
  },

  setSelectedBlog: (blog: Blog) => {
    set({ selectedBlog: blog });
  },

  clearSelectedBlog: () => {
    set({ selectedBlog: null });
  },

  clearStore: () => {
    set({
      blogs: [],
      bookmarks: [],
      selectedBlog: null,
      loading: false,
      error: null
    });
  },
}));

// Subscribe to user changes to clear store when user logs out
useUserStore.subscribe((state, prevState) => {
  if (prevState.user && !state.user) {
    useBlogStore.getState().clearStore();
  }
});

export default useBlogStore; 