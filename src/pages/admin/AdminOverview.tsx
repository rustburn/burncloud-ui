import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Server,
  Activity,
  Zap,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Users,
  Gauge,
  Workflow
} from 'lucide-react';
import {
  BCPageHeader,
  BCMetric,
  BCCard,
  BCButton,
  BCBadge,
  BCStatus
} from '@/components/ui';
import { useRole } from '@/context/RoleContext';
import { MOCK_AUTOPILOT_LOGS } from '@/data/workbenchData';

export function AdminOverview() {
  const navigate = useNavigate();
  const { adminRevenueToday } = useRole();

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <BCPageHeader
        title="Admin Platform Command"
        subtitle="Global AI infrastructure orchestration, capacity headroom, and real-time financial economics."
        conclusion={{
          text: "Platform operations healthy. Autopilot automatically resolved 2 capacity surges in US-West today.",
          type: 'healthy'
        }}
        actions={
          <div className="flex items-center gap-2">
            <BCButton
              variant="secondary"
              size="sm"
              onClick={() => navigate('/admin/operations')}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Autopilot Center</span>
            </BCButton>
            <BCButton
              variant="primary"
              size="sm"
              onClick={() => navigate('/admin/capacity')}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Manage Capacity Headroom</span>
            </BCButton>
          </div>
        }
      />

      {/* 2. Four Primary Metrics (Fixed Order per Admin Contract) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1: Today Revenue */}
        <BCMetric
          label="Today Platform GMV"
          value={`$${adminRevenueToday.toLocaleString()}`}
          trend="+22.8% vs last week"
          trendPositive={true}
          subtitle="Gross token volume"
        />

        {/* 2: Gross Margin */}
        <BCMetric
          label="Platform Margin"
          value="32.4%"
          trend="+1.8% vs target"
          trendPositive={true}
          subtitle="Net after supplier COGS"
        />

        {/* 3: Online GPU Capacity */}
        <BCMetric
          label="Online Compute Fleet"
          value="420"
          unit="GPUs"
          status={<BCStatus status="Online" label="1,840 TFLOPS" />}
          subtitle="312x H100 • 76x A100 • 32x Edge"
        />

        {/* 4: API Availability */}
        <BCMetric
          label="Global API SLA"
          value="99.99%"
          status={<BCStatus status="Healthy" />}
          subtitle="0 customer SLA breaches (30D)"
        />
      </div>

      {/* 3. Needs Attention / Capacity Risk Banner */}
      <div id="attention" className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-950">Capacity Headroom Warning: DeepSeek V3 in US-West</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Current peak concurrency reached 89.2% of provisioned tokens. Autopilot has reserved 2 standby supplier nodes.
            </p>
          </div>
        </div>
        <BCButton
          variant="primary"
          size="sm"
          onClick={() => navigate('/admin/capacity')}
          className="flex-shrink-0 bg-amber-900 hover:bg-amber-800 border-amber-900"
        >
          <span>Adjust Autoscaling Policy</span>
        </BCButton>
      </div>

      {/* 4. Real-time Autopilot Autonomous Actions Feed */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Autopilot Autonomous Actions</h3>
            <p className="text-xs text-gray-500">Autonomous capacity provisioning, thermal routing, and circuit breaking.</p>
          </div>
          <BCButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/operations')}
            className="text-xs"
          >
            <span>Full Incident Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </BCButton>
        </div>

        <div className="space-y-3">
          {MOCK_AUTOPILOT_LOGS.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BCBadge
                    variant={item.level === 'Action' ? 'brand' : item.level === 'Optimization' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {item.category}
                  </BCBadge>
                  <span className="font-bold text-gray-900">{item.title}</span>
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
                  <span className="text-emerald-700 font-semibold">Impact: {item.impact}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{item.actionTaken}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
        </div>
      </BCCard>

      {/* 5. Two Column: Supply Status & Demand Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Supply Summary */}
        <BCCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
              <Server className="w-4 h-4 text-gray-700" />
              <span>Compute Supply Sources</span>
            </h3>
            <button
              onClick={() => navigate('/admin/supply')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Supply Fleets →
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono pt-1">
            <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-sans">Verified Supplier Fleets (L2-L4)</span>
              <span className="font-bold text-gray-900">280 GPUs (66.7%)</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-sans">BurnCloud Owned Bare-Metal IDC</span>
              <span className="font-bold text-gray-900">96 GPUs (22.8%)</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-sans">External Cloud Elastic Fallbacks</span>
              <span className="font-bold text-gray-900">44 GPUs (10.5%)</span>
            </div>
          </div>
        </BCCard>

        {/* Demand Pressure Summary */}
        <BCCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-700" />
              <span>Real-Time Demand Pressure</span>
            </h3>
            <button
              onClick={() => navigate('/admin/demand')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Traffic Velocity →
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono pt-1">
            <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-sans">Current Velocity</span>
              <span className="font-bold text-gray-900">42,800 tokens / sec</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-sans">Peak Concurrency (US-West)</span>
              <span className="font-bold text-amber-700">89.2% (High)</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-sans">Active Buyer Tenants</span>
              <span className="font-bold text-gray-900">1,420 Active Teams</span>
            </div>
          </div>
        </BCCard>
      </div>
    </div>
  );
}
