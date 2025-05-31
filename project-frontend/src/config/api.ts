export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  NEWS_API_URL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/articles`,
  AUTH_API_URL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth`,
  BLOGS_API_URL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/blogs`,
  BOOKMARKS_API_URL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookmarks`,
}; 