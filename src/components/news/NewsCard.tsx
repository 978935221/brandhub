import Link from 'next/link';
import { CATEGORY_MAP, NewsCategory, type NewsItem } from '@/lib/news-types';

const CATEGORY_COLORS: Record<string, string> = {
  [NewsCategory.AI]: 'bg-purple-400/15 text-purple-300',
  [NewsCategory.STOCK]: 'bg-red-400/15 text-red-300',
  [NewsCategory.ENTERTAINMENT]: 'bg-pink-400/15 text-pink-300',
  [NewsCategory.DIGITAL]: 'bg-blue-400/15 text-blue-300',
  [NewsCategory.GAMING]: 'bg-green-400/15 text-green-300',
  [NewsCategory.LIFESTYLE]: 'bg-orange-400/15 text-orange-300',
};

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const { frontmatter, slug } = news;
  const categoryLabel = CATEGORY_MAP[frontmatter.category as NewsCategory] || frontmatter.category;
  const colorClass = CATEGORY_COLORS[frontmatter.category] || 'bg-gray-400/15 text-gray-300';

  return (
    <Link
      href={`/news/${frontmatter.category}/${slug}`}
      className="group block rounded-xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-indigo-500/5"
    >
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
        <time>{frontmatter.date}</time>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
          {categoryLabel}
        </span>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
        {frontmatter.title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-400 line-clamp-2">
        {frontmatter.summary}
      </p>
    </Link>
  );
}