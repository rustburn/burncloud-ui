import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  CreditCard,
  CheckCircle2,
  Activity,
  Zap,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Key,
  Terminal,
  Store,
  AlertTriangle
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
import { WORKBENCH_MODELS } from '@/data/workbenchData';

export function BuyerOverview() {
  const navigate = useNavigate();
  const { balance, todaySpend } = useRole();

  const isLowBalance = balance < 20;

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Intelligent Conclusion */}
      <BCPageHeader
        title="Buyer Overview"
        subtitle="Real-time model API consumption, prepaid balance, and service availability."
        conclusion={{
          text: isLowBalance
            ? "Your prepaid balance is running low. Please top up to prevent API request throttling."
            : "Your API usage is healthy. All upstream model endpoints are operating within normal latency SLAs.",
          type: isLowBalance ? 'warning' : 'healthy'
        }}
        actions={
          <div className="flex items-center gap-2">
            <BCButton
              variant="secondary"
              size="sm"
              onClick={() => navigate('/buyer/playground')}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Open Playground</span>
            </BCButton>
            <BCButton
              variant="primary"
              size="sm"
              onClick={() => navigate('/buyer/marketplace')}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Browse Marketplace</span>
            </BCButton>
          </div>
        }
      />

      {/* 2. Four Primary Metrics (Fixed Order per Contract) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1: Today Spend */}
        <BCMetric
          label="Today Spend"
          value={`$${todaySpend.toFixed(2)}`}
          trend="+8.4% vs yesterday"
          trendPositive={false}
          subtitle="Pass-through model pricing"
        />

        {/* 2: Balance */}
        <BCMetric
          label="Balance"
          value={`$${balance.toFixed(2)}`}
          status={
            isLowBalance ? (
              <BCBadge variant="warning" size="sm">LOW</BCBadge>
            ) : (
              <BCBadge variant="success" size="sm">HEALTHY</BCBadge>
            )
          }
          subtitle="Prepaid account credits"
        />

        {/* 3: API Availability */}
        <BCMetric
          label="API Availability"
          value="99.99%"
          status={<BCStatus status="Healthy" />}
          subtitle="Multi-region auto failover active"
        />

        {/* 4: Tokens Today */}
        <BCMetric
          label="Tokens Today"
          value="1.84M"
          unit="tokens"
          trend="85.4 req/min peak"
          trendPositive={true}
          subtitle="620K prompt • 1.22M completion"
        />
      </div>

      {/* 3. Needs Attention (Only shown when action is required) */}
      {isLowBalance && (
        <div id="attention" className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-950">Prepaid balance below $20.00</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                At your current burn rate (~$14.28/day), your API requests may experience rate limits within 24 hours.
              </p>
            </div>
          </div>
          <BCButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/buyer/billing')}
            className="flex-shrink-0 bg-amber-900 hover:bg-amber-800 border-amber-900"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Top Up Balance</span>
          </BCButton>
        </div>
      )}

      {/* 4. Main Section: Models in Use */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Models in Use</h3>
            <p className="text-xs text-gray-500">Active model API routes serving your application requests.</p>
          </div>
          <BCButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/buyer/marketplace')}
            className="text-xs"
          >
            <span>Explore all models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </BCButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Model</th>
                <th className="pb-3 font-semibold">Selected Tier</th>
                <th className="pb-3 font-semibold">Today Tokens</th>
                <th className="pb-3 font-semibold">p95 Latency</th>
                <th className="pb-3 font-semibold">Today Cost</th>
                <th className="pb-3 font-semibold">Service Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  model: WORKBENCH_MODELS[0], // DeepSeek V3
                  tier: 'Standard',
                  tokens: '1,120,400',
                  cost: '$0.28',
                  p95: '380 ms',
                  status: 'Healthy'
                },
                {
                  model: WORKBENCH_MODELS[1], // DeepSeek R1
                  tier: 'Performance',
                  tokens: '410,200',
                  cost: '$0.89',
                  p95: '620 ms',
                  status: 'Healthy'
                },
                {
                  model: WORKBENCH_MODELS[2], // Qwen 2.5 72B
                  tier: 'Standard',
                  tokens: '310,000',
                  cost: '$0.18',
                  p95: '410 ms',
                  status: 'Healthy'
                }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 font-medium text-gray-950">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center font-mono font-bold text-[10px] text-gray-700">
                        {item.model.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.model.name}</div>
                        <div className="text-[10px] font-mono text-gray-500">{item.model.family}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <BCBadge variant={item.tier === 'Performance' ? 'accent' : 'neutral'} size="sm">
                      {item.tier}
                    </BCBadge>
                  </td>
                  <td className="py-3.5 font-mono text-gray-700 font-medium">{item.tokens}</td>
                  <td className="py-3.5 font-mono text-gray-700">{item.p95}</td>
                  <td className="py-3.5 font-mono font-semibold text-gray-950">{item.cost}</td>
                  <td className="py-3.5">
                    <BCStatus status={item.status} />
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => navigate('/buyer/playground')}
                      className="text-blue-600 hover:text-blue-800 font-semibold font-mono text-xs hover:underline"
                    >
                      Test in Playground →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BCCard>

      {/* 5. Recent Activity Stream */}
      <BCCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-950">Recent Activity</h3>
            <p className="text-xs text-gray-500">Key account events, recharge confirmations, and routing notices.</p>
          </div>
          <BCButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/buyer/logs')}
            className="text-xs"
          >
            <span>View Full Request Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </BCButton>
        </div>

        <div className="space-y-3">
          {[
            {
              time: '12 mins ago',
              type: 'Recharge',
              title: 'Prepaid balance top-up completed ($100.00)',
              desc: 'Receipt #REC-8921 generated. Payment method: Visa ending in 4242.'
            },
            {
              time: '1 hour ago',
              type: 'Autopilot',
              title: 'Sub-150ms smart fallback verified for DeepSeek V3',
              desc: 'BurnCloud automatically provisioned additional capacity in US-West cluster.'
            },
            {
              time: '1 day ago',
              type: 'Key',
              title: 'New API Key "Production Kubernetes Cluster" generated',
              desc: 'Associated with Standard & Performance tiers.'
            }
          ].map((event, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0 mt-0.5 shadow-xs">
                  {event.type === 'Recharge' ? <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> : event.type === 'Autopilot' ? <Zap className="w-3.5 h-3.5 text-blue-600" /> : <Key className="w-3.5 h-3.5 text-gray-600" />}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs">{event.title}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{event.desc}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">{event.time}</span>
            </div>
          ))}
        </div>
      </BCCard>
    </div>
  );
}
