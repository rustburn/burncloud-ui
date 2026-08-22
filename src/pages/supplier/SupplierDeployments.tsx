import React from 'react';
import {
  Layers,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  Server,
  Info
} from 'lucide-react';
import {
  BCPageHeader,
  BCCard,
  BCBadge,
  BCStatus
} from '@/components/ui';

export function SupplierDeployments() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <BCPageHeader
        title="Active Model Deployments"
        subtitle="Read-only view of models autonomously provisioned on your GPU nodes by BurnCloud Autopilot."
        conclusion={{
          text: "Autopilot manages model weights, tensor parallelism (TP), and dynamic batching automatically to maximize your revenue share.",
          type: 'healthy'
        }}
      />

      {/* Deployments Table */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Deployed Model Instances</h3>
            <p className="text-xs text-gray-500">Autonomous scheduling based on live global buyer demand.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Autopilot Managed</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Model Name</th>
                <th className="pb-3 font-semibold">Allocated Nodes</th>
                <th className="pb-3 font-semibold">Parallelism (TP)</th>
                <th className="pb-3 font-semibold">Active Replicas</th>
                <th className="pb-3 font-semibold">Throughput</th>
                <th className="pb-3 font-semibold">Contribution Score</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {[
                {
                  model: 'DeepSeek V3 (671B MoE)',
                  nodes: 'SJC-Pod-01-Rack4 (8x H100)',
                  tp: 'TP=8 / FP8 FlashInfer',
                  replicas: '1 Primary Instance',
                  throughput: '85.2 tokens/s',
                  score: '99.8 / 100',
                  status: 'Healthy'
                },
                {
                  model: 'DeepSeek R1 Reasoning',
                  nodes: 'SJC-Pod-01-Rack5 (8x H100)',
                  tp: 'TP=8 / DeepSeek-VLLM',
                  replicas: '1 Primary Instance',
                  throughput: '56.4 tokens/s',
                  score: '99.4 / 100',
                  status: 'Healthy'
                },
                {
                  model: 'Qwen 2.5 72B Instruct',
                  nodes: 'FRA-DC2-Compute-08 (8x A100)',
                  tp: 'TP=8 / vLLM v0.6.2',
                  replicas: '1 Primary Instance',
                  throughput: '72.0 tokens/s',
                  score: '98.9 / 100',
                  status: 'Healthy'
                },
                {
                  model: 'Llama 3.3 70B Quantized',
                  nodes: 'HKG-Edge-RTX-Pool (4x 4090)',
                  tp: 'TP=4 / AWQ INT4',
                  replicas: '1 Standby Instance',
                  throughput: '42.1 tokens/s',
                  score: '92.1 / 100',
                  status: 'Degraded'
                }
              ].map((dep, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70">
                  <td className="py-3.5 font-sans font-bold text-gray-900">{dep.model}</td>
                  <td className="py-3.5 text-gray-700 font-sans">{dep.nodes}</td>
                  <td className="py-3.5 text-gray-600">{dep.tp}</td>
                  <td className="py-3.5 text-gray-700 font-semibold">{dep.replicas}</td>
                  <td className="py-3.5 text-gray-900 font-bold">{dep.throughput}</td>
                  <td className="py-3.5 text-emerald-700 font-bold">{dep.score}</td>
                  <td className="py-3.5 text-right font-sans">
                    <BCStatus status={dep.status} />
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
