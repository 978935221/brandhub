import { notFound } from 'next/navigation';
import { getNewsBySlug, CATEGORY_DIR_MAP } from '@/lib/news';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { CATEGORY_MAP } from '@/lib/news-types';

interface NewsDetailProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailProps) {
  const { category, slug } = await params;
  const article = getNewsBySlug(category, slug);
  if (!article) return { title: '文章未找到' };

  const label = CATEGORY_MAP[CATEGORY_DIR_MAP[category]] || '新闻';
  return {
    title: `${article.frontmatter.title} - ${label} - BrandHub`,
    description: article.frontmatter.summary,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { category, slug } = await params;
  const article = getNewsBySlug(category, slug);

  if (!article) notFound();

  const { content } = await compileMDX({
    source: article.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  const label = CATEGORY_MAP[CATEGORY_DIR_MAP[category]] || category;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href={`/news/${category}`}
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {label}
      </Link>

      <article>
        <div className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              {label}
            </span>
            {article.frontmatter.source && (
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-500">
                来源：{article.frontmatter.source}
              </span>
            )}
          </div>
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            {article.frontmatter.title}
          </h1>
          <time className="text-sm text-gray-500">{article.frontmatter.date}</time>
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300
            prose-strong:text-gray-100 prose-strong:font-semibold
            prose-li:text-gray-300 prose-li:marker:text-gray-500
            prose-blockquote:border-indigo-500 prose-blockquote:text-gray-400 prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
            prose-hr:border-white/10
            prose-img:rounded-xl
          "
        >
          {content}
        </div>
      </article>

      <div className="mt-16 border-t border-white/10 pt-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回新闻总览
        </Link>
      </div>
    </div>
  );
}