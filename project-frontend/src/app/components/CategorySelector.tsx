import React from 'react';
import useArticleStore from '../stores/articleStore';

const categories = [
  'general',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology'
];

const CategorySelector: React.FC = () => {
  const { selectedCategory, setSelectedCategory, fetchArticlesByCategory } = useArticleStore();

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    await fetchArticlesByCategory(category);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-full capitalize transition-colors ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector; 