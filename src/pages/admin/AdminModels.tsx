import React from 'react';
import {
  Cpu,
  Plus,
  Sliders,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  BCPageHeader,
  BCMetric,
  BCCard,
  BCButton,
  BCBadge,
  BCStatus
} from '@/components/ui';
import { WORKBENCH_MODELS } from '@/data/workbenchData';

export function AdminModels() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <BCPageHeader
        title="Master Model Catalog"
        subtitle="Configure pass-through pricing, routing priority, and operational health overrides."
        conclusion={{
          text: "6 Master models configured. Zero markup policy enforced on open-weights frontier LLMs.",
          type: 'healthy'
        }}
      />

      {/* Models Table */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Active Catalog Endpoints</h3>
            <p className="text-xs text-gray-500">Global routing policies and token unit economics.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Model Name</th>
                <th className="pb-3 font-semibold">Pass-Through In / Out Rate</th>
                <th className="pb-3 font-semibold">Context</th>
                <th className="pb-3 font-semibold">Routing Tiers</th>
                <th className="pb-3 font-semibold">Target p95 SLA</th>
                <th className="pb-3 font-semibold">30D Availability</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {WORKBENCH_MODELS.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/70">
                  <td className="py-3.5 font-sans font-bold text-gray-900">{m.name}</td>
                  <td className="py-3.5 text-gray-900 font-bold">
                    ${m.inputPrice1M} / ${m.outputPrice1M}
                  </td>
                  <td className="py-3.5 text-gray-600">{m.contextWindow}</td>
                  <td className="py-3.5">
                    <div className="flex gap-1">
                      {m.supportedTiers.map(t => (
                        <BCBadge key={t} variant={t === 'Performance' ? 'accent' : 'neutral'} size="sm">
                          {t}
                        </BCBadge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 text-gray-700">{m.p95LatencyMs} ms</td>
                  <td className="py-3.5 text-emerald-700 font-bold">{m.availability}%</td>
                  <td className="py-3.5 text-right font-sans">
                    <BCStatus status={m.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BCCard>
    </div>
  );
}
