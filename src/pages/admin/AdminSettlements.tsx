import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  Download,
  Building2,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import {
  BCPageHeader,
  BCMetric,
  BCCard,
  BCButton,
  BCBadge
} from '@/components/ui';

export function AdminSettlements() {
  const [batches, setBatches] = useState([
    {
      id: 'BATCH-2026-08B',
      period: 'Aug 15 - Aug 31, 2026',
      totalSuppliers: 24,
      totalGpus: 420,
      totalTokens: '1,840.5',
      totalPayout: '$124,500.00',
      status: 'Pending Review'
    },
    {
      id: 'BATCH-2026-08A',
      period: 'Aug 01 - Aug 15, 2026',
      totalSuppliers: 24,
      totalGpus: 412,
      totalTokens: '1,790.0',
      totalPayout: '$121,200.00',
      status: 'Settled & Paid'
    }
  ]);

  const handleApproveBatch = (id: string) => {
    setBatches(batches.map(b => b.id === id ? { ...b, status: 'Settled & Paid' } : b));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BCPageHeader
        title="Global Supplier Settlements"
        subtitle="Review, audit, and approve bi-weekly token inference payout batches."
        conclusion={{
          text: "Batch BATCH-2026-08B pending review ($124,500.00). Zero supplier disputes reported.",
          type: 'healthy'
        }}
      />

      {/* Batches */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Settlement Batches</h3>
            <p className="text-xs text-gray-500">Automated payout calculations against verified inference tokens.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Batch ID</th>
                <th className="pb-3 font-semibold">Billing Cycle</th>
                <th className="pb-3 font-semibold">Active Suppliers</th>
                <th className="pb-3 font-semibold">Inference Tokens</th>
                <th className="pb-3 font-semibold">Total Payout</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/70">
                  <td className="py-3.5 font-bold text-gray-900">{b.id}</td>
                  <td className="py-3.5 text-gray-600 font-sans">{b.period}</td>
                  <td className="py-3.5 text-gray-700">{b.totalSuppliers} Providers ({b.totalGpus} GPUs)</td>
                  <td className="py-3.5 text-gray-700">{b.totalTokens}M</td>
                  <td className="py-3.5 font-bold text-gray-950">{b.totalPayout}</td>
                  <td className="py-3.5 font-sans">
                    <BCBadge variant={b.status === 'Settled & Paid' ? 'success' : 'warning'} size="sm">
                      {b.status}
                    </BCBadge>
                  </td>
                  <td className="py-3.5 text-right font-sans">
                    {b.status === 'Pending Review' ? (
                      <BCButton
                        variant="primary"
                        size="xs"
                        onClick={() => handleApproveBatch(b.id)}
                      >
                        Approve & Execute
                      </BCButton>
                    ) : (
                      <span className="text-xs text-gray-400 font-mono">Completed</span>
                    )}
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
