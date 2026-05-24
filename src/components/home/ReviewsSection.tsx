import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default function ReviewsSection() {
  const allPosts = getAllPosts();
  const latestReviews = allPosts.slice(0, 4);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text-blue">
          最新测评推荐
        </h2>
        <Link
          href="/reviews"
          className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          查看全部 &rarr;
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {latestReviews.length > 0 ? (
          latestReviews.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              className="group block rounded-xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <time className="text-sm text-gray-500">
                {post.frontmatter.date}
              </time>
              <h3 className="mt-1 font-semibold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {post.frontmatter.title}
              </h3>
              <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                {post.frontmatter.summary}
              </p>
            </Link>
          ))
        ) : (
          <p className="col-span-2 py-8 text-center text-gray-500">
            暂无测评文章，敬请期待
          </p>
        )}
      </div>
    </section>
  );
}