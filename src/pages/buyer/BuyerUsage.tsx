import React, { useState } from 'react';
import {
  LineChart as LineChartIcon,
  Calendar,
  Download,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu,
  Clock
} from 'lucide-react';
import {
  BCPageHeader,
  BCCard,
  BCButton,
  BCBadge,
  BCMetric
} from '@/components/ui';

export function BuyerUsage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <BCPageHeader
        title="Token Usage & Analytics"
        subtitle="Detailed consumption metrics, request velocity, and model-level cost distribution."
        conclusion={{
          text: "Total 14.82M tokens processed in the last 7 days. Average TTFT latency: 142ms.",
          type: 'healthy'
        }}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 text-xs font-medium">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-lg uppercase font-mono ${
                    timeRange === r ? 'bg-gray-900 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <BCButton variant="secondary" size="sm">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </BCButton>
          </div>
        }
      />

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BCMetric
          label="Total Tokens (7D)"
          value="14.82M"
          unit="tokens"
          trend="+18.2% vs prior week"
          trendPositive={true}
        />
        <BCMetric
          label="Total Cost (7D)"
          value="$114.60"
          subtitle="Pass-through rate"
        />
        <BCMetric
          label="Total Requests"
          value="182,490"
          subtitle="99.99% success rate"
        />
        <BCMetric
          label="p95 TTFT"
          value="142 ms"
          trend="-24 ms reduction"
          trendPositive={true}
        />
      </div>

      {/* Model Breakdown Chart & Table */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Consumption by Model</h3>
            <p className="text-xs text-gray-500">Breakdown of prompt vs completion tokens and total cost.</p>
          </div>
        </div>

        {/* Visual Bar representation */}
        <div className="space-y-3 pt-2">
          {[
            { name: 'DeepSeek V3', tokens: '8.4M', pct: 57, cost: '$2.35', color: 'bg-gray-900' },
            { name: 'DeepSeek R1', tokens: '3.8M', pct: 26, cost: '$8.32', color: 'bg-indigo-600' },
            { name: 'Qwen 2.5 72B', tokens: '1.9M', pct: 13, cost: '$1.33', color: 'bg-emerald-600' },
            { name: 'Claude 3.5 Sonnet', tokens: '0.72M', pct: 4, cost: '$10.80', color: 'bg-amber-600' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-900">{item.name}</span>
                <span className="font-mono text-gray-500">
                  {item.tokens} tokens ({item.pct}%) • <strong className="text-gray-950">{item.cost}</strong>
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Breakdown Table */}
        <div className="pt-4 border-t border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Model</th>
                <th className="pb-3 font-semibold">Prompt Tokens</th>
                <th className="pb-3 font-semibold">Completion Tokens</th>
                <th className="pb-3 font-semibold">Total Requests</th>
                <th className="pb-3 font-semibold">Avg Latency</th>
                <th className="pb-3 font-semibold text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              <tr className="hover:bg-gray-50/70">
                <td className="py-3 font-sans font-semibold text-gray-900">DeepSeek V3 (Standard)</td>
                <td className="py-3 text-gray-600">2,800,000</td>
                <td className="py-3 text-gray-600">5,600,000</td>
                <td className="py-3 text-gray-600">114,200</td>
                <td className="py-3 text-gray-600">148 ms</td>
                <td className="py-3 font-bold text-gray-950 text-right">$2.35</td>
              </tr>
              <tr className="hover:bg-gray-50/70">
                <td className="py-3 font-sans font-semibold text-gray-900">DeepSeek R1 (Performance)</td>
                <td className="py-3 text-gray-600">1,200,000</td>
                <td className="py-3 text-gray-600">2,600,000</td>
                <td className="py-3 text-gray-600">38,100</td>
                <td className="py-3 text-gray-600">380 ms</td>
                <td className="py-3 font-bold text-gray-950 text-right">$8.32</td>
              </tr>
              <tr className="hover:bg-gray-50/70">
                <td className="py-3 font-sans font-semibold text-gray-900">Qwen 2.5 72B (Standard)</td>
                <td className="py-3 text-gray-600">650,000</td>
                <td className="py-3 text-gray-600">1,250,000</td>
                <td className="py-3 text-gray-600">22,090</td>
                <td className="py-3 text-gray-600">190 ms</td>
                <td className="py-3 font-bold text-gray-950 text-right">$1.33</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BCCard>
    </div>
  );
}
