import Link from 'next/link';
import NebulaBackground from '@/components/effects/NebulaBackground';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950">
      <NebulaBackground />

      <div className="relative z-10 text-center">
        <div className="mb-6">
          <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-8xl font-black text-transparent">
            404
          </h1>
        </div>

        <h2 className="mb-3 text-2xl font-semibold text-white">页面未找到</h2>
        <p className="mb-8 text-gray-400">你访问的页面不存在或已被移除。</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30"
          >
            返回首页
          </Link>
          <Link
            href="/news"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-gray-300 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            浏览新闻
          </Link>
        </div>
      </div>
    </div>
  );
}