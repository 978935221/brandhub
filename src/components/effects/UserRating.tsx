'use client';

import { useState, useEffect } from 'react';

const RATING_TAGS = [
  { id: 'useful', label: '有帮助', icon: '👍' },
  { id: 'detailed', label: '内容详细', icon: '📝' },
  { id: 'objective', label: '客观公正', icon: '⚖️' },
  { id: 'practical', label: '实用建议', icon: '💡' },
  { id: 'readable', label: '通俗易懂', icon: '📖' },
];

interface UserRating {
  score: number;
  tags: string[];
  votedAt: string;
}

interface AggregatedRating {
  average: number;
  count: number;
  distribution: number[]; // 1-5 star count
  tags: Record<string, number>;
}

function loadRating(slug: string): UserRating | null {
  try {
    const raw = localStorage.getItem(`rating_${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveRating(slug: string, rating: UserRating) {
  localStorage.setItem(`rating_${slug}`, JSON.stringify(rating));
}

function loadAggregated(slug: string): AggregatedRating {
  try {
    const raw = localStorage.getItem(`aggregated_${slug}`);
    return raw
      ? JSON.parse(raw)
      : { average: 0, count: 0, distribution: [0, 0, 0, 0, 0], tags: {} };
  } catch {
    return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0], tags: {} };
  }
}

function saveAggregated(slug: string, agg: AggregatedRating) {
  localStorage.setItem(`aggregated_${slug}`, JSON.stringify(agg));
}

export default function UserRating({ slug }: { slug: string }) {
  const [myRating, setMyRating] = useState<UserRating | null>(null);
  const [agg, setAgg] = useState<AggregatedRating>(() => loadAggregated(slug));
  const [hoverStar, setHoverStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const r = loadRating(slug);
    if (r) {
      setMyRating(r);
      setSubmitted(true);
    }
    setAgg(loadAggregated(slug));
  }, [slug]);

  const submitRating = (score: number, tags: string[]) => {
    if (submitted) return;

    const newRating: UserRating = {
      score,
      tags,
      votedAt: new Date().toISOString(),
    };
    saveRating(slug, newRating);
    setMyRating(newRating);
    setSubmitted(true);

    // Update aggregated
    const newAgg = loadAggregated(slug);
    newAgg.count += 1;
    newAgg.distribution[score - 1] += 1;
    const totalScore = newAgg.distribution.reduce((sum, c, i) => sum + c * (i + 1), 0);
    newAgg.average = Math.round((totalScore / newAgg.count) * 10) / 10;
    tags.forEach((t) => {
      newAgg.tags[t] = (newAgg.tags[t] || 0) + 1;
    });
    saveAggregated(slug, newAgg);
    setAgg(newAgg);
  };

  const handleStarClick = (star: number) => {
    if (submitted) return;

    // 如果已经选过评分，则收集标签后提交
    const tags = collectTags();
    submitRating(star, tags);
  };

  const collectTags = (): string[] => {
    return RATING_TAGS.filter((t) => {
      const el = document.getElementById(`tag_${t.id}`);
      return (el as HTMLInputElement)?.checked;
    }).map((t) => t.id);
  };

  return (
    <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-semibold text-white">读者评分</h3>

      {!submitted ? (
        <div className="space-y-4">
          {/* Star selection */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                className="transition-transform hover:scale-110"
              >
                <svg
                  className={`h-8 w-8 ${
                    star <= (hoverStar || 0) ? 'text-amber-400' : 'text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {hoverStar > 0 ? `${hoverStar} 星` : '点击评分'}
            </span>
          </div>

          {/* Tags */}
          <div>
            <p className="mb-2 text-sm text-gray-500">这篇文章怎么样？（可多选）</p>
            <div className="flex flex-wrap gap-2">
              {RATING_TAGS.map((tag) => (
                <label
                  key={tag.id}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-400 transition-all hover:border-white/20 hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    id={`tag_${tag.id}`}
                    className="rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="select-none">
                    {tag.icon} {tag.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-6 w-6 ${star <= myRating!.score ? 'text-amber-400' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-indigo-400">感谢你的评价！</span>
          </div>
          {myRating!.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {myRating!.tags.map((tid) => {
                const tag = RATING_TAGS.find((t) => t.id === tid);
                return tag ? (
                  <span key={tid} className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-300">
                    {tag.icon} {tag.label}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}

      {/* Aggregate display */}
      {agg.count > 0 && (
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              <strong className="text-white">{agg.average}</strong> / 5
            </span>
            <span>{agg.count} 人评价</span>
          </div>
          {/* Distribution bars */}
          <div className="mt-2 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-right text-gray-500">{star}</span>
                <div className="flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-2 rounded-full bg-amber-400 transition-all"
                    style={{
                      width: agg.count > 0
                        ? `${(agg.distribution[star - 1] / agg.count) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
                <span className="w-6 text-gray-600">{agg.distribution[star - 1]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}