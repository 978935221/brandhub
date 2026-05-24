import NebulaBackground from '@/components/effects/NebulaBackground';
import ScrollReveal from '@/components/effects/ScrollReveal';
import NewsSection from '@/components/home/NewsSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import AiRecommend from '@/components/effects/AiRecommend';
import { StaggerReveal, ScaleReveal, GlowTrail } from '@/components/effects/ScrollFX';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <NebulaBackground />
      <GlowTrail />
      
      {/* Hero 区域 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-indigo-900/90 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOC41aC0xMnYyM2gxMnYtMjN6IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <ScrollReveal direction="up" delay={0}>
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="gradient-text">BrandHub</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={100}>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-200">
              品牌发现与消费指南 — 每日精选 AI 前沿、股市财经、娱乐八卦等分类新闻，专业产品测评与选购指南
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/news"
                className="group relative overflow-hidden rounded-full bg-white/10 px-8 py-4 font-semibold text-white transition-all hover:bg-white/20 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <span className="relative z-10">浏览新闻</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-20" />
              </Link>
              <Link
                href="/reviews"
                className="group relative overflow-hidden rounded-full border border-white/30 bg-transparent px-8 py-4 font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10"
              >
                <span className="relative z-10">测评 & 排行</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                href="/compare"
                className="group relative overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-8 py-4 font-semibold text-white transition-all hover:border-indigo-400/50 hover:from-indigo-500/30 hover:to-purple-500/30 animate-pulse-glow"
              >
                <span className="relative z-10">产品对比</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-15" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 主体：两栏布局 */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* 左侧主栏 */}
          <div className="flex-1 space-y-16">
            <ScaleReveal>
              <div className="glass p-8">
                <NewsSection />
              </div>
            </ScaleReveal>

            <StaggerReveal>
              <div className="glass p-8">
                <ReviewsSection />
              </div>
            </StaggerReveal>
          </div>

          {/* 侧边栏 */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-24 space-y-8">
              <ScrollReveal direction="left" delay={400}>
                <AiRecommend />
              </ScrollReveal>

              <ScrollReveal direction="left" delay={600}>
                <div className="glass flex h-64 items-center justify-center rounded-2xl p-6 text-center animate-pulse-glow">
                  <div className="space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">限时优惠</h3>
                    <p className="text-sm text-gray-300">品牌合作专属折扣</p>
                    <button className="mt-2 rounded-full border border-white/30 bg-transparent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10">
                      了解更多
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}