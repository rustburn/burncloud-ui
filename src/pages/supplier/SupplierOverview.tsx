import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  Server,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  TrendingUp,
  Cpu,
  Layers,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import {
  BCPageHeader,
  BCMetric,
  BCCard,
  BCButton,
  BCBadge,
  BCStatus,
  BCModal,
  BCInput
} from '@/components/ui';
import { useRole } from '@/context/RoleContext';
import { MOCK_SUPPLIER_NODES, SupplierGpuNode } from '@/data/workbenchData';

export function SupplierOverview() {
  const navigate = useNavigate();
  const { supplierEarningsToday } = useRole();
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  const totalGpus = MOCK_SUPPLIER_NODES.reduce((acc, n) => acc + n.gpuCount, 0);
  const onlineGpus = MOCK_SUPPLIER_NODES.filter(n => n.status === 'Online').reduce((acc, n) => acc + n.gpuCount, 0);
  const avgUtilization = (
    MOCK_SUPPLIER_NODES.reduce((acc, n) => acc + n.utilization, 0) / MOCK_SUPPLIER_NODES.length
  ).toFixed(1);

  const degradedNode = MOCK_SUPPLIER_NODES.find(n => n.status === 'Degraded');

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <BCPageHeader
        title="Supplier Overview"
        subtitle="Monetize GPU compute clusters with BurnCloud Autopilot scheduler."
        conclusion={{
          text: degradedNode
            ? `Node ${degradedNode.name} reported elevated temperature (72°C). Autopilot has throttled non-critical batch traffic.`
            : "All connected GPU clusters are healthy and earning continuous token inference revenue.",
          type: degradedNode ? 'warning' : 'healthy'
        }}
        actions={
          <div className="flex items-center gap-2">
            <BCButton
              variant="secondary"
              size="sm"
              onClick={() => navigate('/supplier/resources')}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Inspect Nodes</span>
            </BCButton>
            <BCButton
              variant="primary"
              size="sm"
              onClick={() => setIsOnboardModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect New GPU Node</span>
            </BCButton>
          </div>
        }
      />

      {/* 2. Four Primary Metrics (Fixed Order per Supplier Contract) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1: Today Earnings */}
        <BCMetric
          label="Today Earnings"
          value={`$${supplierEarningsToday.toFixed(2)}`}
          trend="+12.4% vs yesterday"
          trendPositive={true}
          subtitle="Net revenue share (80%)"
        />

        {/* 2: Online GPUs */}
        <BCMetric
          label="Online GPUs"
          value={`${onlineGpus} / ${totalGpus}`}
          unit="GPUs"
          status={<BCStatus status="Online" label="3 Clusters" />}
          subtitle="24x H100/A100 • 4x RTX 4090"
        />

        {/* 3: GPU Utilization */}
        <BCMetric
          label="GPU Utilization"
          value={`${avgUtilization}%`}
          trend="88.6% peak compute"
          trendPositive={true}
          subtitle="Autopilot dynamic batching"
        />

        {/* 4: Inference Today */}
        <BCMetric
          label="Inference Today"
          value="24.2M"
          unit="tokens"
          subtitle="DeepSeek V3 & R1 clusters"
        />
      </div>

      {/* 3. Needs Attention Banner */}
      {degradedNode && (
        <div id="attention" className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Node {degradedNode.name} ({degradedNode.gpuType}) requires maintenance
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                GPU Core Temperature is 72°C. Autopilot has drained priority live traffic to preserve SLA. Please verify chassis fan airflow.
              </p>
            </div>
          </div>
          <BCButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/supplier/resources')}
            className="flex-shrink-0 bg-amber-900 hover:bg-amber-800 border-amber-900"
          >
            <span>Inspect Node Diagnostics</span>
          </BCButton>
        </div>
      )}

      {/* 4. Active Hardware Nodes Table */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Connected Compute Nodes</h3>
            <p className="text-xs text-gray-500">Autonomous scheduler status and real-time revenue accrual.</p>
          </div>
          <BCButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/supplier/resources')}
            className="text-xs"
          >
            <span>View Cluster Topology</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </BCButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Node Identifier</th>
                <th className="pb-3 font-semibold">GPU Specs & VRAM</th>
                <th className="pb-3 font-semibold">Assigned Workload</th>
                <th className="pb-3 font-semibold">Utilization</th>
                <th className="pb-3 font-semibold">Temp</th>
                <th className="pb-3 font-semibold">Today Earnings</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {MOCK_SUPPLIER_NODES.map((node) => (
                <tr key={node.id} className="hover:bg-gray-50/70">
                  <td className="py-3.5 font-sans">
                    <div className="font-bold text-gray-900">{node.name}</div>
                    <div className="text-[10px] font-mono text-gray-400">{node.region} • {node.cluster}</div>
                  </td>
                  <td className="py-3.5">
                    <div className="font-semibold text-gray-900 font-sans">{node.gpuCount}x {node.gpuType}</div>
                    <div className="text-[10px] text-gray-500">{node.vramTotalGb}GB VRAM • {node.pcieBandwidth}</div>
                  </td>
                  <td className="py-3.5 text-gray-700 font-sans">{node.assignedModel}</td>
                  <td className="py-3.5">
                    <span className="font-bold text-gray-900">{node.utilization}%</span>
                  </td>
                  <td className="py-3.5">
                    <span className={node.temperatureC > 70 ? 'text-amber-600 font-bold' : 'text-gray-600'}>
                      {node.temperatureC}°C
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-emerald-700">${node.earningsToday.toFixed(2)}</td>
                  <td className="py-3.5 font-sans">
                    <BCStatus status={node.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BCCard>

      {/* 5. Node Onboarding Modal */}
      <BCModal
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        title="Connect New GPU Node"
        subtitle="Run the BurnCloud node daemon to join the decentralized compute fabric."
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-700 leading-relaxed font-sans">
            Install the lightweight node daemon on your Ubuntu / Debian GPU server (NVIDIA driver 535+ and CUDA 12.2+ required).
          </p>

          <div className="p-3 bg-gray-950 text-gray-100 rounded-xl font-mono text-[11px] space-y-2">
            <div className="text-gray-400 text-[10px]">// Run in terminal with sudo privileges:</div>
            <div className="text-emerald-400 select-all overflow-x-auto whitespace-pre">
              curl -sSL https://burncloud.io/install.sh | bash -s -- --token=bc_node_auth_98a72b1
            </div>
          </div>

          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80 space-y-1 font-sans text-blue-900">
            <div className="font-bold">Automated Verification Protocol:</div>
            <p className="text-[11px] leading-relaxed">
              Once started, BurnCloud will execute a 60-second hardware attestation benchmark (PCIe bandwidth, FP8/FP16 TFLOPS, memory integrity) and automatically begin routing inference traffic.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <BCButton
              variant="primary"
              size="sm"
              onClick={() => setIsOnboardModalOpen(false)}
            >
              Done
            </BCButton>
          </div>
        </div>
      </BCModal>
    </div>
  );
}
