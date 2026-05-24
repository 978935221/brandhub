import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import UserRating from '@/components/effects/UserRating';

interface ReviewDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts('reviews');
  return posts.map((p) => ({
    slug: p.slug.replace('reviews/', ''),
  }));
}

export async function generateMetadata({ params }: ReviewDetailProps) {
  const { slug } = await params;
  const post = getPostBySlug('reviews', slug);
  if (!post) return { title: '文章未找到' };

  return {
    title: `${post.frontmatter.title} - BrandHub 测评`,
    description: post.frontmatter.summary,
  };
}

export default async function ReviewDetailPage({ params }: ReviewDetailProps) {
  const { slug } = await params;
  const post = getPostBySlug('reviews', slug);

  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  const verdictColors: Record<string, string> = {
    '强烈推荐': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    '推荐': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    '谨慎考虑': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    '不推荐': 'text-red-400 bg-red-400/10 border-red-400/30',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/reviews" className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回测评列表
      </Link>

      <article>
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
              {post.frontmatter.category || '综合'}
            </span>
            {post.frontmatter.verdict && (
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${verdictColors[post.frontmatter.verdict] || verdictColors['推荐']}`}>
                {post.frontmatter.verdict}
              </span>
            )}
            {post.frontmatter.rating && (
              <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {post.frontmatter.rating.toFixed(1)}
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
                {post.frontmatter.tags.map((tag) => (
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
          [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:rounded-lg [&_table]:border [&_table]:border-white/5
          prose-code:text-indigo-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-blockquote:border-indigo-500 prose-blockquote:text-gray-400 prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
          prose-hr:border-white/10
        ">
          {content}
        </div>

        <UserRating slug={slug} />
      </article>
    </div>
  );
}