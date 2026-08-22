import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Terminal,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Globe2,
  Info
} from 'lucide-react';
import {
  BCPageHeader,
  BCCard,
  BCButton,
  BCBadge,
  BCStatus,
  BCDrawer,
  BCSearch
} from '@/components/ui';
import { WORKBENCH_MODELS, ModelItem } from '@/data/workbenchData';

export function BuyerMarketplace() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = ['All', 'General LLM', 'Reasoning & Math', 'Coding', 'Low Latency'];

  const filteredModels = WORKBENCH_MODELS.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.family.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenDetail = (model: ModelItem) => {
    setSelectedModel(model);
    setShowAdvanced(false);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <BCPageHeader
        title="Model Marketplace"
        subtitle="Discover, benchmark, and deploy enterprise-grade frontier LLM capacities with pass-through pricing."
        conclusion={{
          text: "All models backed by multi-region hardware attestation and sub-150ms automatic failovers.",
          type: 'healthy'
        }}
      />

      {/* 2. Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white font-bold shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <BCSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models (DeepSeek, Claude...)"
          />
        </div>
      </div>

      {/* 3. Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((model) => (
          <BCCard
            key={model.id}
            hoverable
            className="p-5 flex flex-col justify-between space-y-4 border border-gray-200/80"
          >
            <div className="space-y-3">
              {/* Header: Family & Availability */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-500">
                  {model.family}
                </span>
                <BCStatus status={model.status} label={`${model.availability}% SLA`} />
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-base font-bold text-gray-950 tracking-tight">{model.name}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                  {model.tagline}
                </p>
              </div>

              {/* Price & Context Strip */}
              <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">TOKEN RATE</span>
                  <span className="font-bold text-gray-900">
                    ${model.inputPrice1M} <span className="text-gray-400 font-normal">/</span> ${model.outputPrice1M}
                  </span>
                  <span className="text-[9px] text-gray-400 block">per 1M in / out</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase">CONTEXT</span>
                  <span className="font-bold text-gray-900">{model.contextWindow}</span>
                  <span className="text-[9px] text-emerald-600 block">Sub-{model.p95LatencyMs}ms TTFT</span>
                </div>
              </div>

              {/* Tier Pills */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase">TIERS:</span>
                {model.supportedTiers.map((t) => (
                  <BCBadge
                    key={t}
                    variant={t === 'Performance' ? 'accent' : t === 'Standard' ? 'neutral' : 'brand'}
                    size="sm"
                  >
                    {t}
                  </BCBadge>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenDetail(model)}
                className="text-xs text-gray-600 hover:text-gray-950 font-medium hover:underline flex items-center gap-1"
              >
                <span>Inspect Specs</span>
              </button>

              <BCButton
                variant="primary"
                size="sm"
                onClick={() => {
                  navigate('/buyer/playground');
                }}
              >
                <span>Use Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </BCButton>
            </div>
          </BCCard>
        ))}
      </div>

      {/* 4. Model Detail Drawer (Apple/Stripe Restrained) */}
      {selectedModel && (
        <BCDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedModel.name}
          subtitle={`${selectedModel.family} • ${selectedModel.category}`}
        >
          <div className="space-y-6">
            {/* Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                Model Overview
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">{selectedModel.description}</p>
            </div>

            {/* Pricing Breakdown */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 font-mono">
                  BurnCloud Pass-Through Rate
                </span>
                <BCBadge variant="success" size="sm">ZERO MARKUP</BCBadge>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div>
                  <span className="text-gray-500 text-[11px] block">Input Prompt Rate</span>
                  <span className="text-base font-bold text-gray-950">
                    ${selectedModel.inputPrice1M.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-400 block">per 1,000,000 tokens</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px] block">Completion Rate</span>
                  <span className="text-base font-bold text-gray-950">
                    ${selectedModel.outputPrice1M.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-400 block">per 1,000,000 tokens</span>
                </div>
              </div>
            </div>

            {/* Benchmark Scores */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                Standard Benchmarks
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {selectedModel.benchmarks.map((b) => (
                  <div key={b.name} className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                    <span className="text-[10px] text-gray-500 block font-mono">{b.name}</span>
                    <span className="text-sm font-bold text-gray-900 font-mono mt-1 block">
                      {b.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Applications */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wider">
                Recommended For
              </h4>
              <p className="text-xs text-gray-600 bg-blue-50/60 p-3 rounded-xl border border-blue-100 leading-relaxed">
                {selectedModel.recommendedFor}
              </p>
            </div>

            {/* Collapsible Advanced Section (Per contract) */}
            <div className="pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-800 hover:text-gray-950 py-2"
              >
                <div className="flex items-center gap-1.5 font-mono">
                  <Activity className="w-3.5 h-3.5 text-gray-500" />
                  <span>Advanced Performance & SLO Data</span>
                </div>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-3 text-xs font-mono">
                  <div className="flex justify-between pb-2 border-b border-gray-200/60">
                    <span className="text-gray-500">p95 TTFT Latency:</span>
                    <span className="font-bold text-gray-900">{selectedModel.p95LatencyMs} ms</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-200/60">
                    <span className="text-gray-500">Peak Throughput:</span>
                    <span className="font-bold text-gray-900">{selectedModel.throughputTokensPerSec} tokens/sec</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-200/60">
                    <span className="text-gray-500">Historical 30-Day SLA:</span>
                    <span className="font-bold text-emerald-700">{selectedModel.availability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Supported Regions:</span>
                    <span className="font-bold text-gray-900">US-West, EU-Central, AP-East</span>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button in Drawer */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <BCButton
                variant="primary"
                size="md"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/buyer/playground');
                }}
                className="w-full"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch in Playground</span>
              </BCButton>
            </div>
          </div>
        </BCDrawer>
      )}
    </div>
  );
}
