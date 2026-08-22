import React from 'react';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import {
  BCPageHeader,
  BCMetric,
  BCCard,
  BCButton
} from '@/components/ui';

export function AdminRevenue() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <BCPageHeader
        title="Financial Economics & Margins"
        subtitle="Platform GMV, Supplier COGS, Net Margin, and model profitability breakdown."
        conclusion={{
          text: "Gross GMV this month: $384,200. Net Platform Margin: 32.4% ($124,480 net profit).",
          type: 'healthy'
        }}
        actions={
          <BCButton variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Ledger</span>
          </BCButton>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BCMetric
          label="August Platform GMV"
          value="$384,200"
          trend="+28.4% MoM"
          trendPositive={true}
        />
        <BCMetric
          label="Supplier COGS"
          value="$259,720"
          subtitle="67.6% of GMV payouts"
        />
        <BCMetric
          label="Net Platform Margin"
          value="$124,480"
          trend="32.4% Net Margin"
          trendPositive={true}
        />
        <BCMetric
          label="Prepaid Float Held"
          value="$842,100"
          subtitle="Prepaid customer credits"
        />
      </div>

      {/* Profitability by Model */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Profitability by Model Endpoint</h3>
            <p className="text-xs text-gray-500">Gross revenue vs supplier compute cost.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Model Endpoint</th>
                <th className="pb-3 font-semibold">Volume (Tokens)</th>
                <th className="pb-3 font-semibold">Gross GMV</th>
                <th className="pb-3 font-semibold">Supplier COGS</th>
                <th className="pb-3 font-semibold">Net Profit</th>
                <th className="pb-3 font-semibold text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  model: 'DeepSeek V3 (671B)',
                  volume: '1,420.0M',
                  gmv: '$148,200',
                  cogs: '$98,400',
                  profit: '$49,800',
                  margin: '33.6%'
                },
                {
                  model: 'DeepSeek R1 Reasoning',
                  volume: '680.0M',
                  gmv: '$112,400',
                  cogs: '$74,200',
                  profit: '$38,200',
                  margin: '34.0%'
                },
                {
                  model: 'Qwen 2.5 72B',
                  volume: '420.0M',
                  gmv: '$64,100',
                  cogs: '$44,800',
                  profit: '$19,300',
                  margin: '30.1%'
                },
                {
                  model: 'Claude 3.5 Sonnet Pass-Through',
                  volume: '140.0M',
                  gmv: '$59,500',
                  cogs: '$42,320',
                  profit: '$17,180',
                  margin: '28.9%'
                }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70">
                  <td className="py-3.5 font-bold font-sans text-gray-900">{item.model}</td>
                  <td className="py-3.5 text-gray-700">{item.volume}</td>
                  <td className="py-3.5 font-bold text-gray-950">{item.gmv}</td>
                  <td className="py-3.5 text-gray-600">{item.cogs}</td>
                  <td className="py-3.5 font-bold text-emerald-700">{item.profit}</td>
                  <td className="py-3.5 font-bold text-emerald-700 text-right">{item.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BCCard>
    </div>
  );
}
