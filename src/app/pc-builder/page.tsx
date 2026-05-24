'use client';

import { useState } from 'react';

interface Part {
  name: string;
  price: number;
  [key: string]: any;
}

interface PCBuild {
  budget: number;
  total: number;
  cpu: Part;
  gpu: Part;
  motherboard: Part;
  ram: Part;
  ssd: Part;
  psu: Part;
  case: Part;
  cooler: Part;
}

const PRESET_BUDGETS = [4000, 6000, 8000, 10000, 15000, 20000];

function specLabel(key: string): string {
  const map: Record<string, string> = {
    cores: '核心', frequency: '频率', tdp: '功耗', tier: '定位',
    vram: '显存', socket: '插槽', ram: '内存类型', size: '容量',
    watt: '功率',
  };
  return map[key] || key;
}

function partValue(part: Part, key: string): string {
  if (key === 'price') return `¥${part.price.toLocaleString()}`;
  return String(part[key] || '—');
}

export default function PCBuilderPage() {
  const [budget, setBudget] = useState('');
  const [build, setBuild] = useState<PCBuild | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runBuild = async (b: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pc-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: b }),
      });
      if (!res.ok) throw new Error('请求失败');
      const data = await res.json();
      setBuild(data);
    } catch (e: any) {
      setError(e.message || '出错了');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseInt(budget);
    if (isNaN(b) || b < 3000) {
      setError('预算至少 3000 元');
      return;
    }
    if (b > 100000) {
      setError('预算不能超过 100000 元');
      return;
    }
    runBuild(b);
  };

  // Build comparison stats
  const buildStats = build
    ? [
        { label: 'CPU占比', value: `${Math.round((build.cpu.price / build.total) * 100)}%` },
        { label: 'GPU占比', value: `${Math.round((build.gpu.price / build.total) * 100)}%` },
        { label: '超预算', value: build.total > build.budget ? `+¥${(build.total - build.budget).toLocaleString()}` : `-¥${(build.budget - build.total).toLocaleString()}` },
        { label: '总价', value: `¥${build.total.toLocaleString()}` },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="mb-3 text-4xl font-extrabold gradient-text">装机配置推荐</h1>
        <p className="text-lg text-gray-400">
          输入预算，智能推荐最优台式机装机方案
        </p>
      </div>

      {/* Budget Input */}
      <div className="glass mb-10 rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-400">你的预算（元）</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="例如 8000"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-lg text-white placeholder-gray-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.07]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
          >
            {loading ? '计算中...' : '生成配置'}
          </button>
        </form>

        {/* Preset Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center text-xs text-gray-600 mr-2">快速选择：</span>
          {PRESET_BUDGETS.map((b) => (
            <button
              key={b}
              onClick={() => { setBudget(String(b)); runBuild(b); }}
              className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-400 transition-all hover:border-indigo-500/30 hover:text-white"
            >
              ¥{b.toLocaleString()}
            </button>
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {/* Build Result */}
      {build && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Summary */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">配置方案</h2>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-sm text-indigo-300">
                预算 ¥{build.budget.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {buildStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                  <div className="text-xs text-gray-500">{stat.label}</div>
                  <div className="mt-1 font-semibold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Parts Table */}
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-6 py-3 text-left font-semibold text-gray-300">配件</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-300">型号</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-300">规格</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-300">价格</th>
                </tr>
              </thead>
              <tbody>
                {([
                  { label: 'CPU', part: build.cpu, keys: ['cores', 'frequency', 'tdp'] },
                  { label: '显卡', part: build.gpu, keys: ['vram'] },
                  { label: '主板', part: build.motherboard, keys: ['socket', 'ram'] },
                  { label: '内存', part: build.ram, keys: ['size'] },
                  { label: '固态硬盘', part: build.ssd, keys: ['size'] },
                  { label: '电源', part: build.psu, keys: ['watt'] },
                  { label: '机箱', part: build.case, keys: [] },
                  { label: '散热器', part: build.cooler, keys: [] },
                ] as const).map(({ label, part, keys }) => (
                  <tr key={label} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-indigo-300">{label}</td>
                    <td className="px-6 py-4 text-white">{part.name}</td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      {keys.map((k) => (
                        <span key={k} className="mx-1.5">
                          <span className="text-gray-600">{specLabel(k)}:</span> {partValue(part, k)}
                        </span>
                      ))}
                      {keys.length === 0 && '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-amber-400">¥{part.price.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-white/[0.02]">
                  <td colSpan={3} className="px-6 py-4 text-right font-semibold text-white">合计</td>
                  <td className="px-6 py-4 text-right font-mono text-lg font-bold text-amber-400">
                    ¥{build.total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!build && !loading && (
        <div className="glass flex flex-col items-center justify-center py-20">
          <svg className="mb-4 h-20 w-20 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <p className="text-lg text-gray-500">输入预算，获取智能装机推荐</p>
          <p className="mt-1 text-sm text-gray-600">从 ¥3,000 到 ¥100,000 预算均可</p>
        </div>
      )}
    </div>
  );
}