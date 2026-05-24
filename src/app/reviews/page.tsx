import { getAllPosts } from '@/lib/posts';
import type { PostItem } from '@/lib/posts';
import Link from 'next/link';

const VERDICT_STYLES: Record<string, string> = {
  '强烈推荐': 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  '推荐': 'bg-blue-400/15 text-blue-300 border-blue-400/30',
  '谨慎考虑': 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  '不推荐': 'bg-red-400/15 text-red-300 border-red-400/30',
};

function RatingBar({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating / 2);
  const hasHalf = rating % 2 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 text-sm font-bold text-amber-400">{rating.toFixed(1)}</span>
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg key={`f-${i}`} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg key={`e-${i}`} className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ post }: { post: PostItem }) {
  const { frontmatter, slug } = post;
  const verdictStyle = frontmatter.verdict
    ? VERDICT_STYLES[frontmatter.verdict] || VERDICT_STYLES['推荐']
    : '';

  return (
    <Link
      href={`/${slug}`}
      className="group block rounded-xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-indigo-500/5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
          {frontmatter.category || '综合'}
        </span>
        {frontmatter.verdict && (
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${verdictStyle}`}>
            {frontmatter.verdict}
          </span>
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
        {frontmatter.title}
      </h3>
      <p className="mb-4 text-sm text-gray-400 line-clamp-2">
        {frontmatter.summary}
      </p>
      <div className="flex items-center justify-between">
        <time className="text-xs text-gray-500">{frontmatter.date}</time>
        {frontmatter.rating && <RatingBar rating={frontmatter.rating} />}
      </div>
      {frontmatter.tags && frontmatter.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {frontmatter.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-gray-500">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function ReviewsPage() {
  const reviews = getAllPosts('reviews');
  const featuredReview = reviews.find((r) => r.frontmatter.featured);
  const otherReviews = reviews.filter((r) => !r.frontmatter.featured);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-3 text-4xl font-extrabold gradient-text">专业测评</h1>
        <p className="text-lg text-gray-400">
          深度体验、数据说话，为你的消费决策提供专业参考
        </p>
      </div>

      {/* Featured Review Hero */}
      {featuredReview && (
        <div className="mb-14">
          <span className="mb-3 inline-block rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 px-3 py-1 text-xs font-medium text-amber-300">
            编辑精选
          </span>
          <Link
            href={`/${featuredReview.slug}`}
            className="group block rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-indigo-900/20 p-8 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                    {featuredReview.frontmatter.category}
                  </span>
                  <span className="text-sm text-gray-500">{featuredReview.frontmatter.date}</span>
                </div>
                <h2 className="mb-3 text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors sm:text-3xl">
                  {featuredReview.frontmatter.title}
                </h2>
                <p className="mb-4 text-gray-400 leading-relaxed line-clamp-3">
                  {featuredReview.frontmatter.summary}
                </p>
                <div className="flex items-center gap-4">
                  {featuredReview.frontmatter.rating && (
                    <RatingBar rating={featuredReview.frontmatter.rating} />
                  )}
                  {featuredReview.frontmatter.verdict && (
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${VERDICT_STYLES[featuredReview.frontmatter.verdict] || VERDICT_STYLES['推荐']}`}>
                      {featuredReview.frontmatter.verdict}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 lg:flex">
                <span className="text-4xl font-bold gradient-text">
                  {featuredReview.frontmatter.rating?.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* All Reviews Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">全部测评</h2>
        <span className="text-sm text-gray-500">共 {reviews.length} 篇</span>
      </div>

      {otherReviews.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {otherReviews.map((review) => (
            <ReviewCard key={review.slug} post={review} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-gray-500">更多测评文章即将上线</p>
      )}
    </div>
  );
}