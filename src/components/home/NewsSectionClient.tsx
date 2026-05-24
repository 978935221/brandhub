'use client';

import { useState, useMemo } from 'react';
import NewsTabs from '@/components/news/NewsTabs';
import NewsCard from '@/components/news/NewsCard';
import { NewsCategory, CATEGORY_MAP, type NewsItem } from '@/lib/news-types';
import Link from 'next/link';

interface NewsSectionClientProps {
  allNews: NewsItem[];
}

export default function NewsSectionClient({ allNews }: NewsSectionClientProps) {
  const [activeTab, setActiveTab] = useState<NewsCategory>(NewsCategory.ALL);

  const filteredNews = useMemo(() => {
    if (activeTab === NewsCategory.ALL) return allNews.slice(0, 6);
    return allNews
      .filter((n) => n.frontmatter.category === activeTab)
      .slice(0, 6);
  }, [activeTab, allNews]);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text-blue">
          今日新闻速览
        </h2>
        <Link
          href="/news"
          className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          查看全部 &rarr;
        </Link>
      </div>
      <NewsTabs active={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filteredNews.length > 0 ? (
          filteredNews.map((news) => (
            <NewsCard key={news.slug} news={news} />
          ))
        ) : (
          <p className="col-span-2 py-8 text-center text-gray-500">
            暂无{activeTab === NewsCategory.ALL ? '' : CATEGORY_MAP[activeTab]}新闻
          </p>
        )}
      </div>
    </section>
  );
}