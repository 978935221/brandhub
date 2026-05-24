import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandHub - 品牌发现与消费指南",
  description:
    "每日精选 AI 前沿、股市财经、娱乐八卦等分类新闻，专业产品测评与选购指南",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gray-950 text-gray-100">
        {/* 顶部导航栏 - 玻璃效果 */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <Link 
              href="/" 
              className="text-xl font-bold gradient-text"
            >
              BrandHub
            </Link>
            <div className="flex items-center gap-8 text-sm font-medium text-gray-300">
              <Link href="/news" className="nav-link hover:text-white">
                新闻
              </Link>
              <Link href="/reviews" className="nav-link hover:text-white">
                测评
              </Link>
              <Link href="/rankings" className="nav-link hover:text-white">
                排行
              </Link>
              <Link
                href="/pc-builder"
                className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition-all hover:border-emerald-400/50 hover:bg-emerald-500/20"
              >
                装机助手
              </Link>
              <Link
                href="/compare"
                className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/20 hover:text-indigo-200 animate-pulse-glow"
              >
                产品对比
              </Link>
            </div>
          </nav>
        </header>

        {/* 主内容区域 */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-black/60 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="mb-3 text-lg font-semibold gradient-text">
                  BrandHub
                </h3>
                <p className="text-sm text-gray-400">
                  品牌发现与消费指南，每日精选优质内容。
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  联系方式
                </h3>
                <p className="text-sm text-gray-400">
                  邮箱：978935221@qq.com
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  关于我们
                </h3>
                <p className="text-sm text-gray-400">
                  BrandHub 致力于为用户提供专业的品牌资讯与消费决策参考。
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} BrandHub. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}