import { notFound } from 'next/navigation';
import {
  NewsCategory,
  CATEGORY_MAP,
  CATEGORY_DIR_MAP,
  getNewsByCategory,
} from '@/lib/news';
import NewsCard from '@/components/news/NewsCard';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = [
    'ai',
    'stock',
    'entertainment',
    'digital',
    'gaming',
    'lifestyle',
  ];
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const newsCategory = CATEGORY_DIR_MAP[category];
  if (!newsCategory) return { title: '分类不存在' };

  return {
    title: `${CATEGORY_MAP[newsCategory]} - BrandHub`,
  };
}

export default async function CategoryNewsPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const newsCategory = CATEGORY_DIR_MAP[category];

  if (!newsCategory) {
    notFound();
  }

  const newsList = getNewsByCategory(newsCategory);
  const label = CATEGORY_MAP[newsCategory];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link
          href="/news"
          className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          &larr; 返回新闻总览
        </Link>
      </div>

      <h1 className="mb-10 text-4xl font-extrabold gradient-text">{label}</h1>

      {newsList.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newsList.map((news) => (
            <NewsCard key={news.slug} news={news} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-gray-500">
          暂无{label}新闻
        </p>
      )}
    </div>
  );
}