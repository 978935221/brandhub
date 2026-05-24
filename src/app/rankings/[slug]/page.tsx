import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import UserRating from '@/components/effects/UserRating';

interface RankingDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts('rankings');
  return posts.map((p) => ({
    slug: p.slug.replace('rankings/', ''),
  }));
}

export async function generateMetadata({ params }: RankingDetailProps) {
  const { slug } = await params;
  const post = getPostBySlug('rankings', slug);
  if (!post) return { title: '文章未找到' };

  return {
    title: `${post.frontmatter.title} - BrandHub 排行榜`,
    description: post.frontmatter.summary,
  };
}

export default async function RankingDetailPage({ params }: RankingDetailProps) {
  const { slug } = await params;
  const post = getPostBySlug('rankings', slug);

  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/rankings" className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回排行榜
      </Link>

      <article>
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              {post.frontmatter.category || '综合'}
            </span>
            {post.frontmatter.rankCount && (
              <span className="flex items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-300">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Top {post.frontmatter.rankCount}
              </span>
            )}
            {post.frontmatter.updateFrequency && (
              <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {post.frontmatter.updateFrequency}
              </span>
            )}
          </div>
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            {post.frontmatter.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <time>{post.frontmatter.date}</time>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="flex gap-1.5">
                {post.frontmatter.tags.map((tag: string) => (
                  <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-gray-500">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300
          prose-strong:text-gray-100 prose-strong:font-semibold
          prose-li:text-gray-300 prose-li:marker:text-gray-500
          prose-thead:border-white/10 prose-th:whitespace-nowrap prose-th:text-gray-200 prose-th:bg-white/5 prose-th:px-4 prose-th:py-3 prose-th:text-sm
          prose-td:whitespace-nowrap prose-td:text-gray-300 prose-td:px-4 prose-td:py-3 prose-td:border-white/5 prose-td:text-sm
          prose-tr:border-white/5
          prose-code:text-indigo-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-blockquote:border-indigo-500 prose-blockquote:text-gray-400 prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
          prose-hr:border-white/10
          [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:rounded-lg [&_table]:border [&_table]:border-white/5
        ">
          {content}
        </div>

        <UserRating slug={slug} />
      </article>
    </div>
  );
}