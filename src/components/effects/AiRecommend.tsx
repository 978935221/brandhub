'use client';

import { useState } from 'react';
import { products, type ProductSpec } from '@/lib/products';

interface QuizStep {
  question: string;
  options: { label: string; tags: string[] }[];
}

const quiz: QuizStep[] = [
  {
    question: '你对哪类产品最感兴趣？',
    options: [
      { label: '手机', tags: ['手机'] },
      { label: '笔记本电脑', tags: ['笔记本电脑'] },
      { label: '耳机 / 音频', tags: ['耳机'] },
      { label: 'AI 工具', tags: ['AI工具'] },
    ],
  },
  {
    question: '你的预算范围是？',
    options: [
      { label: '性价比优先', tags: ['budget'] },
      { label: '中高端', tags: ['mid'] },
      { label: '旗舰级', tags: ['premium'] },
    ],
  },
  {
    question: '你最看重什么？',
    options: [
      { label: '极致性能', tags: ['performance'] },
      { label: '拍照 / 影像', tags: ['camera'] },
      { label: '续航 / 便携', tags: ['portable'] },
      { label: '生态体验', tags: ['ecosystem'] },
      { label: '降噪 / 音质', tags: ['audio'] },
    ],
  },
];

// 评分规则：根据用户选择的标签为产品打分
function scoreProduct(product: ProductSpec, tags: string[]): number {
  let score = 0;

  // 品类匹配
  if (tags.includes(product.category)) score += 30;

  // 预算匹配
  if (tags.includes('budget') && product.price <= 6000) score += 20;
  if (tags.includes('mid') && product.price > 3000 && product.price <= 10000) score += 20;
  if (tags.includes('premium') && product.price > 6000) score += 20;

  // 场景评分
  const prosText = product.pros.join(' ').toLowerCase();
  const consText = product.cons.join(' ').toLowerCase();

  if (tags.includes('performance') && (prosText.includes('性能') || prosText.includes('性能天花板') || prosText.includes('强劲'))) score += 15;
  if (tags.includes('camera') && (prosText.includes('拍') || prosText.includes('摄影') || prosText.includes('摄影') || consText.includes('夜景'))) score += 15;
  if (tags.includes('portable') && (prosText.includes('续航') || prosText.includes('轻') || prosText.includes('便携') || prosText.includes('快充'))) score += 15;
  if (tags.includes('ecosystem') && (prosText.includes('生态') || prosText.includes('无缝') || product.brand === 'Apple')) score += 15;
  if (tags.includes('audio') && (prosText.includes('降噪') || prosText.includes('音质') || prosText.includes('音频'))) score += 15;

  // 评分加成（高评分产品更容易被推荐）
  score += product.rating * 2;

  return score;
}

export default function AiRecommend() {
  const [step, setStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [results, setResults] = useState<ProductSpec[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleOptionClick = (tags: string[]) => {
    const updated = [...selectedTags, ...tags];
    setSelectedTags(updated);

    if (step < quiz.length - 1) {
      setStep(step + 1);
    } else {
      // Compute final results
      const scored = products.map((p) => ({
        product: p,
        score: scoreProduct(p, updated),
      }));
      scored.sort((a, b) => b.score - a.score);
      setResults(scored.slice(0, 3).map((s) => s.product));
      setIsComplete(true);
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedTags([]);
    setResults([]);
    setIsComplete(false);
  };

  return (
    <div className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text">AI 智能推荐</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isComplete ? '根据你的偏好，为你精选以下产品' : '回答几个问题，帮你找到最合适的产品'}
          </p>
        </div>

        {!isComplete ? (
          <div>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>第 {step + 1} / {quiz.length} 问</span>
                <span>{Math.round(((step + 1) / quiz.length) * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${((step + 1) / quiz.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="mb-4 text-lg text-white">{quiz[step].question}</h3>

            <div className="space-y-2">
              {quiz[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt.tags)}
                  className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-5 py-3.5 text-left text-gray-300 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-white"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-3">
              {results.map((product, index) => (
                <a
                  key={product.id}
                  href={product.reviewSlug ? `/${product.reviewSlug}` : `/compare?id=${product.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-all hover:border-indigo-500/30 hover:bg-white/[0.04]"
                >
                  {/* Rank badge */}
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-black'
                        : index === 1
                        ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-black'
                        : 'bg-gradient-to-br from-orange-300 to-amber-600 text-black'
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                        {product.name}
                      </span>
                      <span className="shrink-0 text-xs font-bold text-amber-400">{product.rating.toFixed(1)}分</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                      <span>{product.category} · {product.brand}</span>
                      <span>¥{product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={reset}
                className="rounded-full border border-white/10 px-6 py-2 text-sm text-gray-400 transition-all hover:border-white/20 hover:text-white"
              >
                重新评测
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}