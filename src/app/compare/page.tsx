'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  products,
  getProductsByCategory,
  getCategories,
  type ProductSpec,
} from '@/lib/products';
import Link from 'next/link';

// 扩展搜索结果的接口
interface SearchProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating?: number;
  category: string;
  specs?: Record<string, string>;
  pros?: string[];
  cons?: string[];
  source: string;
}

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(getCategories()[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const categories = getCategories();
  const grouped = getProductsByCategory();

  // 合并本地产品和搜索结果
  const allVisibleProducts = useMemo(() => {
    if (searchQuery.trim()) {
      // 搜索模式：显示本地匹配 + 搜索结果
      const localMatches = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const localIds = new Set(localMatches.map(p => p.id));
      const searchExtras = searchResults
        .filter(r => !localIds.has(r.id))
        .map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          brand: r.brand,
          price: r.price,
          rating: r.rating || 0,
          specs: r.specs || {},
          pros: r.pros || [],
          cons: r.cons || [],
          verdict: '',
          reviewSlug: '',
        }));
      return [...localMatches, ...searchExtras];
    }
    return grouped[activeCategory] || [];
  }, [searchQuery, searchResults, activeCategory, grouped]);

  const selectedProducts = useMemo(
    () => {
      // 先从所有来源找
      const allProducts = [...products, ...searchResults.map(r => ({
        id: r.id, name: r.name, category: r.category, brand: r.brand,
        price: r.price, rating: r.rating || 0, specs: r.specs || {},
        pros: r.pros || [], cons: r.cons || [], verdict: '', reviewSlug: '',
      }))] as ProductSpec[];
      return allProducts.filter((p) => selectedIds.includes(p.id));
    },
    [selectedIds, searchResults]
  );

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  // 搜索防抖
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/product-search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) { setShowSearch(true); doSearch(val); }
    else { setShowSearch(false); setSearchResults([]); }
  };

  // 收集所有选中产品的规格 key
  const allSpecKeys = useMemo(() => {
    const keys = new Set<string>();
    selectedProducts.forEach((p) => Object.keys(p.specs).forEach((k) => keys.add(k)));
    return [...keys];
  }, [selectedProducts]);

  // 判断某行有无差异（用于高亮）
  const hasDiff = (key: string): boolean => {
    if (selectedProducts.length < 2) return false;
    const vals = selectedProducts.map((p) => p.specs[key] || '—');
    return new Set(vals).size > 1;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-3 text-4xl font-extrabold gradient-text">产品对比</h1>
        <p className="text-lg text-gray-400">
          选择 2-5 款产品，直观对比核心参数与优缺点
        </p>
      </div>

      {/* Selection Area */}
      <div className="mb-10">
        {/* Search + Category Tabs */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜索产品名称或品牌（如 iPhone、RTX4090、耳机）..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-gray-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.07]"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              </div>
            )}
          </div>

          {/* Category Tabs (hide when searching) */}
          {!searchQuery.trim() && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allVisibleProducts.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            return (
              <button
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                disabled={!isSelected && selectedIds.length >= 5}
                className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                    : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                } disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {/* Checkbox */}
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {isSelected && (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white truncate">{product.name}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span>{product.brand}</span>
                    <span className="text-amber-400">{product.rating.toFixed(1)}</span>
                    <span>¥{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-gray-600">已选 {selectedIds.length}/5 款产品</p>
      </div>

      {/* Comparison Table */}
      {selectedProducts.length >= 2 ? (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Header row */}
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="sticky left-0 z-10 bg-white/[0.03] px-6 py-4 text-left font-semibold text-white w-32">
                    规格参数
                  </th>
                  {selectedProducts.map((p) => (
                    <th key={p.id} className="px-6 py-4 text-center min-w-[180px]">
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <span className="text-amber-400">{p.rating.toFixed(1)}</span>
                        <span>¥{p.price.toLocaleString()}</span>
                      </div>
                      {p.reviewSlug && (
                        <Link
                          href={`/${p.reviewSlug}`}
                          className="mt-1 inline-block text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          查看评测 →
                        </Link>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Specs rows */}
              <tbody>
                {allSpecKeys.map((key) => (
                  <tr key={key} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="sticky left-0 z-10 bg-gray-950 px-6 py-3 font-medium text-gray-400">
                      {key}
                    </td>
                    {selectedProducts.map((p) => (
                      <td
                        key={p.id}
                        className={`px-6 py-3 text-center ${
                          hasDiff(key)
                            ? 'font-medium text-indigo-300 bg-indigo-500/5'
                            : 'text-gray-300'
                        }`}
                      >
                        {p.specs[key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Pros row */}
                <tr className="border-b border-white/5">
                  <td className="sticky left-0 z-10 bg-gray-950 px-6 py-4 font-medium text-emerald-400">
                    优点
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="px-6 py-4">
                      <ul className="space-y-1 text-xs">
                        {p.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-gray-300">
                            <span className="mt-0.5 text-emerald-400">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Cons row */}
                <tr className="border-b border-white/5">
                  <td className="sticky left-0 z-10 bg-gray-950 px-6 py-4 font-medium text-red-400">
                    缺点
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="px-6 py-4">
                      <ul className="space-y-1 text-xs">
                        {p.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-gray-400">
                            <span className="mt-0.5 text-red-400">✗</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Verdict row */}
                <tr>
                  <td className="sticky left-0 z-10 bg-gray-950 px-6 py-4 font-medium text-indigo-400">
                    结论
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="px-6 py-4 text-center">
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        p.verdict === '强烈推荐'
                          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                          : 'border-blue-400/30 bg-blue-400/10 text-blue-300'
                      }`}>
                        {p.verdict}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedProducts.length === 1 ? (
        <div className="glass flex flex-col items-center justify-center py-20">
          <svg className="mb-4 h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <p className="text-gray-500">再选一款产品即可开始对比</p>
        </div>
      ) : (
        <div className="glass flex flex-col items-center justify-center py-20">
          <svg className="mb-4 h-20 w-20 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-lg text-gray-500">在上方选择产品开始对比</p>
          <p className="mt-1 text-sm text-gray-600">支持同时对比 2-5 款产品</p>
        </div>
      )}
    </div>
  );
}