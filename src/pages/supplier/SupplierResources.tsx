import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Thermometer,
  Activity,
  HardDrive,
  PowerOff,
  RefreshCw,
  Plus,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import {
  BCPageHeader,
  BCCard,
  BCButton,
  BCBadge,
  BCStatus,
  BCModal
} from '@/components/ui';
import { MOCK_SUPPLIER_NODES, SupplierGpuNode } from '@/data/workbenchData';

export function SupplierResources() {
  const [nodes, setNodes] = useState<SupplierGpuNode[]>(MOCK_SUPPLIER_NODES);
  const [selectedNode, setSelectedNode] = useState<SupplierGpuNode | null>(null);
  const [isDrainModalOpen, setIsDrainModalOpen] = useState(false);

  const handleDrainNode = (node: SupplierGpuNode) => {
    setSelectedNode(node);
    setIsDrainModalOpen(true);
  };

  const confirmDrain = () => {
    if (!selectedNode) return;
    setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, status: 'Draining', utilization: 0 } : n));
    setIsDrainModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BCPageHeader
        title="GPU Clusters & Resources"
        subtitle="Manage hardware inventory, VRAM allocations, thermal telemetry, and graceful draining."
        conclusion={{
          text: "3 Clusters online. 24 Enterprise SXM GPUs + 4 Edge RTX GPUs delivering 180 TFLOPS FP8 capacity.",
          type: 'healthy'
        }}
      />

      {/* Nodes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {nodes.map((node) => (
          <BCCard key={node.id} className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-950 font-sans">{node.name}</h3>
                  <BCBadge variant={node.status === 'Online' ? 'success' : node.status === 'Degraded' ? 'warning' : 'neutral'} size="sm">
                    {node.status}
                  </BCBadge>
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{node.region} • {node.cluster}</p>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-gray-400 block uppercase">TODAY REVENUE</span>
                <span className="text-sm font-bold text-emerald-700">${node.earningsToday.toFixed(2)}</span>
              </div>
            </div>

            {/* Hardware Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 block">GPU CHIPS</span>
                <span className="font-semibold text-gray-900 font-sans">{node.gpuCount}x {node.gpuType}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">TOTAL VRAM</span>
                <span className="font-semibold text-gray-900">{node.vramTotalGb} GB High-Bandwidth</span>
              </div>
              <div className="pt-2 border-t border-gray-200/60">
                <span className="text-[10px] text-gray-400 block">INTERCONNECT</span>
                <span className="font-semibold text-gray-900">{node.pcieBandwidth}</span>
              </div>
              <div className="pt-2 border-t border-gray-200/60">
                <span className="text-[10px] text-gray-400 block">TEMPERATURE</span>
                <span className={node.temperatureC > 70 ? 'text-amber-600 font-bold' : 'text-gray-900 font-semibold'}>
                  {node.temperatureC} °C
                </span>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 font-medium font-sans">Active Compute Load</span>
                <span className="font-mono font-bold text-gray-900">{node.utilization}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gray-900 h-full rounded-full transition-all"
                  style={{ width: `${node.utilization}%` }}
                />
              </div>
            </div>

            {/* Assigned Workload */}
            <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-700" />
                <span className="text-blue-950 font-medium">Model: {node.assignedModel}</span>
              </div>
              <span className="text-[10px] font-mono text-blue-700">Autopilot Assigned</span>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-400">Uptime: {node.uptimeHours} hrs</span>
              {node.status === 'Online' && (
                <BCButton
                  variant="secondary"
                  size="xs"
                  onClick={() => handleDrainNode(node)}
                >
                  <PowerOff className="w-3 h-3 text-gray-600" />
                  <span>Request Graceful Drain</span>
                </BCButton>
              )}
            </div>
          </BCCard>
        ))}
      </div>

      {/* Modal: Graceful Drain Request */}
      {selectedNode && (
        <BCModal
          isOpen={isDrainModalOpen}
          onClose={() => setIsDrainModalOpen(false)}
          title={`Graceful Drain: ${selectedNode.name}`}
          subtitle="Safely migrate active inference workloads before taking hardware offline."
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Zero-Downtime Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                BurnCloud Autopilot will immediately stop routing new user prompts to this node and gracefully finish all in-flight KV cache generations (~15-30 seconds).
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <BCButton
                variant="secondary"
                size="sm"
                onClick={() => setIsDrainModalOpen(false)}
              >
                Cancel
              </BCButton>
              <BCButton
                variant="danger"
                size="sm"
                onClick={confirmDrain}
              >
                Confirm Node Drain
              </BCButton>
            </div>
          </div>
        </BCModal>
      )}
    </div>
  );
}
