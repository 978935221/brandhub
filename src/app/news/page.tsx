import { getAllNews, CATEGORY_MAP, NewsCategory } from '@/lib/news';
import NewsCard from '@/components/news/NewsCard';
import Link from 'next/link';

export default function NewsPage() {
  const allNews = getAllNews();

  const categories = [
    NewsCategory.AI,
    NewsCategory.STOCK,
    NewsCategory.ENTERTAINMENT,
    NewsCategory.DIGITAL,
    NewsCategory.GAMING,
    NewsCategory.LIFESTYLE,
  ];

  const grouped = categories.map((cat) => ({
    category: cat,
    label: CATEGORY_MAP[cat],
    items: allNews.filter((n) => n.frontmatter.category === cat).slice(0, 4),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-4xl font-extrabold gradient-text">新闻总览</h1>

      <div className="space-y-14">
        {grouped.map((group) => (
          <section key={group.category}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {group.label}
              </h2>
              <Link
                href={`/news/${group.category}`}
                className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
              >
                更多 &rarr;
              </Link>
            </div>
            {group.items.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((news) => (
                  <NewsCard key={news.slug} news={news} />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">
                暂无{group.label}新闻
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}