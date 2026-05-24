import { getAllPosts } from '@/lib/posts';
import type { PostItem } from '@/lib/posts';
import Link from 'next/link';

function RankingCard({ post, index }: { post: PostItem; index: number }) {
  const { frontmatter, slug } = post;

  return (
    <Link
      href={`/${slug}`}
      className="group block rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm transition-all hover:border-white/15 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-indigo-500/5"
    >
      <div className="flex items-stretch">
        {/* Rank number */}
        <div className="flex w-16 shrink-0 items-center justify-center rounded-l-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02]">
          <span className={`text-2xl font-black ${
            index === 0
              ? 'gradient-text'
              : index < 3
              ? 'text-gray-300'
              : 'text-gray-600'
          }`}>
            {index + 1}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-300">
              {frontmatter.category || '综合'}
            </span>
            <span className="text-xs text-gray-500">{frontmatter.date}</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {frontmatter.title}
          </h3>
          <p className="mb-3 text-sm text-gray-400 line-clamp-2">
            {frontmatter.summary}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {frontmatter.rankCount && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Top {frontmatter.rankCount}
              </span>
            )}
            {frontmatter.updateFrequency && (
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {frontmatter.updateFrequency}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex w-10 items-center justify-center text-gray-600 group-hover:text-indigo-400 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function RankingsPage() {
  const rankings = getAllPosts('rankings');

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-3 text-4xl font-extrabold gradient-text">排行榜</h1>
        <p className="text-lg text-gray-400">
          多维数据对比，帮你找到最适合的产品与工具
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{rankings.length}</div>
          <div className="mt-1 text-xs text-gray-400">排行榜单</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {rankings.reduce((sum, r) => sum + (r.frontmatter.rankCount || 0), 0)}
          </div>
          <div className="mt-1 text-xs text-gray-400">上榜产品</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {new Set(rankings.map(r => r.frontmatter.category)).size}
          </div>
          <div className="mt-1 text-xs text-gray-400">覆盖品类</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">季</div>
          <div className="mt-1 text-xs text-gray-400">更新频率</div>
        </div>
      </div>

      {/* Rankings List */}
      {rankings.length > 0 ? (
        <div className="space-y-4">
          {rankings.map((ranking, index) => (
            <RankingCard key={ranking.slug} post={ranking} index={index} />
          ))}
        </div>
      ) : (
        <div className="glass flex flex-col items-center justify-center py-20">
          <svg className="mb-4 h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500">排行榜正在制作中，敬请期待</p>
        </div>
      )}
    </div>
  );
}