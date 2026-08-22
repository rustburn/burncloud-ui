import React from 'react';
import {
  Building2,
  Server,
  ShieldCheck,
  Award,
  DollarSign,
  Activity
} from 'lucide-react';
import {
  BCPageHeader,
  BCMetric,
  BCCard,
  BCBadge,
  BCStatus
} from '@/components/ui';

export function AdminSuppliers() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <BCPageHeader
        title="Supplier Partner Directory"
        subtitle="Manage compute provider accounts, KYC verification, SLA reliability tiers, and revenue shares."
        conclusion={{
          text: "24 Active Supplier Partners. Average network reliability score: 99.1%.",
          type: 'healthy'
        }}
      />

      {/* Directory Table */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Verified GPU Suppliers</h3>
            <p className="text-xs text-gray-500">Tier levels determine default revenue share and scheduling priority.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Supplier Partner</th>
                <th className="pb-3 font-semibold">Verification Level</th>
                <th className="pb-3 font-semibold">Connected GPUs</th>
                <th className="pb-3 font-semibold">Uptime SLA</th>
                <th className="pb-3 font-semibold">Rev Share</th>
                <th className="pb-3 font-semibold">30D Earnings</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  name: 'Silicon Bay Data Centers LLC',
                  tier: 'L4 Strategic',
                  gpus: '128x H100 SXM5',
                  uptime: '99.98%',
                  share: '85%',
                  earnings: '$118,400',
                  status: 'Online'
                },
                {
                  name: 'Frankfurt EuroCompute GmbH',
                  tier: 'L3 Professional',
                  gpus: '64x A100 80GB',
                  uptime: '99.94%',
                  share: '80%',
                  earnings: '$52,100',
                  status: 'Online'
                },
                {
                  name: 'Tokyo Cloud Matrix Ltd',
                  tier: 'L3 Professional',
                  gpus: '48x H100 SXM5',
                  uptime: '99.91%',
                  share: '80%',
                  earnings: '$44,800',
                  status: 'Online'
                },
                {
                  name: 'Nordic AI Infra AS',
                  tier: 'L2 Verified',
                  gpus: '24x RTX 4090 Pool',
                  uptime: '99.72%',
                  share: '75%',
                  earnings: '$12,400',
                  status: 'Online'
                }
              ].map((s, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70">
                  <td className="py-3.5 font-sans font-bold text-gray-900">{s.name}</td>
                  <td className="py-3.5 font-sans">
                    <BCBadge variant={s.tier.includes('L4') ? 'accent' : 'brand'} size="sm">
                      {s.tier}
                    </BCBadge>
                  </td>
                  <td className="py-3.5 text-gray-700 font-sans">{s.gpus}</td>
                  <td className="py-3.5 text-emerald-700 font-bold">{s.uptime}</td>
                  <td className="py-3.5 font-bold text-gray-900">{s.share}</td>
                  <td className="py-3.5 font-bold text-emerald-700">{s.earnings}</td>
                  <td className="py-3.5 text-right font-sans">
                    <BCStatus status={s.status} />
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
