'use client';

import { NewsCategory, CATEGORY_MAP } from '@/lib/news-types';

const TABS = [
  NewsCategory.ALL,
  NewsCategory.AI,
  NewsCategory.STOCK,
  NewsCategory.ENTERTAINMENT,
  NewsCategory.DIGITAL,
  NewsCategory.GAMING,
  NewsCategory.LIFESTYLE,
];

interface NewsTabsProps {
  active: NewsCategory;
  onTabChange: (category: NewsCategory) => void;
}

export default function NewsTabs({ active, onTabChange }: NewsTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            active === tab
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
          }`}
        >
          {CATEGORY_MAP[tab]}
        </button>
      ))}
    </div>
  );
}