import React, { useState } from 'react';
import {
  Settings,
  Save,
  Check,
  Shield,
  Percent,
  Sliders
} from 'lucide-react';
import {
  BCPageHeader,
  BCCard,
  BCButton,
  BCInput
} from '@/components/ui';

export function AdminSettings() {
  const [baseRevShare, setBaseRevShare] = useState('75.0');
  const [l4RevShare, setL4RevShare] = useState('85.0');
  const [safetyMarginPct, setSafetyMarginPct] = useState('25.0');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BCPageHeader
        title="Platform Global Policies"
        subtitle="Configure system-wide revenue share splits, Autopilot safety limits, and billing tolerances."
        conclusion={{
          text: "Global policies synchronized across all edge routing nodes.",
          type: 'healthy'
        }}
      />

      <BCCard className="p-6 max-w-2xl space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Base Supplier Revenue Share (%)</label>
            <BCInput
              type="number"
              value={baseRevShare}
              onChange={(e) => setBaseRevShare(e.target.value)}
              step="0.5"
              min="50"
              max="95"
            />
            <span className="text-[10px] text-gray-400 font-mono block">
              Default share paid to L1/L2 verified GPU providers on metered token earnings.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Strategic L4 Supplier Revenue Share (%)</label>
            <BCInput
              type="number"
              value={l4RevShare}
              onChange={(e) => setL4RevShare(e.target.value)}
              step="0.5"
              min="70"
              max="95"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-gray-700">Autopilot Target Headroom Safety Margin (%)</label>
            <BCInput
              type="number"
              value={safetyMarginPct}
              onChange={(e) => setSafetyMarginPct(e.target.value)}
              step="1.0"
              min="10"
              max="60"
            />
            <span className="text-[10px] text-gray-400 font-mono block">
              Autopilot provisions additional standby compute when live peak demand exceeds this safety buffer.
            </span>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <BCButton type="submit" variant="primary" size="sm">
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saved ? 'Saved Policies' : 'Save Global Policies'}</span>
            </BCButton>
          </div>
        </form>
      </BCCard>
    </div>
  );
}
