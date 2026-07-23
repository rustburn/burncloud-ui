import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Zap, 
  Lock, 
  CheckCircle2, 
  Server, 
  Activity, 
  DollarSign, 
  Sparkles,
  Layers,
  ChevronRight,
  Globe,
  Code2,
  Check,
  Building2,
  Users
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { Logo } from '@/components/Logo';

export function Home() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'request' | 'certificate'>('request');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [activeModel, setActiveModel] = useState('claude-fable-5');
  const [simulatedLatency, setSimulatedLatency] = useState(142);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateRoute = (modelName: string) => {
    setActiveModel(modelName);
    setIsSimulating(true);
    setSimulatedLatency(Math.floor(120 + Math.random() * 80));
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-gray-900 selection:text-white flex flex-col">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2.5 group">
              <Logo className="w-7 h-7 group-hover:scale-105 transition-transform" />
              <span className="font-display font-bold text-lg tracking-tight text-gray-900">BurnCloud</span>
              <Badge variant="brand" className="hidden sm:inline-flex text-[10px] px-2 py-0">GATEWAY v2.4</Badge>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-gray-600">
              <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
              <a href="#architecture" className="hover:text-gray-900 transition-colors">Silicon Attestation</a>
              <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
              <Link to="/playground" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                Playground <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono font-bold">LIVE</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-[13px]">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" className="text-[13px] gap-1.5">
                <span>Start Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link to="/" className="hidden lg:inline-flex">
              <Button variant="secondary" className="text-[13px] gap-1.5">
                <span>Go to Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#F9FAFB] to-[#F9FAFB]">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Trust Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200/80 text-[12px] font-medium text-gray-700 mb-6 shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-mono font-semibold">100% Cryptographically Traceable</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">Zero Proxy Tampering</span>
          </motion.div>

          {/* Hero Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-950 max-w-4xl mx-auto leading-[1.1]"
          >
            The Silicon-Attested <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
              AI Routing Infrastructure
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Route LLM calls across AWS Bedrock, Anthropic, Vertex AI, and Groq with sub-150ms zero-latency fallbacks and verifiable hardware attestation receipts.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="gap-2 text-[15px] px-7 py-3 shadow-lg shadow-gray-900/10"
            >
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Deploy Gateway Free</span>
            </Button>
            
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/')}
              className="gap-2 text-[15px] px-6"
            >
              <Terminal className="w-4 h-4 text-gray-600" />
              <span>Open Console Dashboard</span>
            </Button>
          </motion.div>

          {/* Stat Pill Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-14 pt-8 border-t border-gray-200/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left"
          >
            <div>
              <div className="text-2xl font-bold text-gray-950 font-sans tracking-tight">12.8M+</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">Requests Routed Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950 font-sans tracking-tight">142ms</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">Global P95 Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950 font-sans tracking-tight">99.999%</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">Hardware Enclave Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950 font-sans tracking-tight">$4,766</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">Avg. Monthly Cost Saved</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Gateway Demo Card */}
      <section className="py-12 bg-white border-y border-gray-200/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <Badge variant="brand" className="mb-2">LIVE ROUTE INTERACTIVE DEMO</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950">
              Test Real-Time Hardware Route Verification
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl mx-auto">
              Click any target model to trigger an instant TPM enclave signature audit and benchmark routing latency.
            </p>
          </div>

          <Card className="p-6 md:p-8 bg-gray-950 text-white shadow-2xl rounded-2xl overflow-hidden border-gray-800 relative">
            {/* Model Selector Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Select Model:</span>
                {['claude-fable-5', 'gpt-4o-nitro', 'deepseek-r1-enclave', 'llama-3.3-70b'].map((model) => (
                  <button
                    key={model}
                    onClick={() => simulateRoute(model)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeModel === model 
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20' 
                        : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono text-green-400 bg-green-950/60 border border-green-800/60 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span>LATENCY: {simulatedLatency}ms</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TPM SIGNED</span>
                </div>
              </div>
            </div>

            {/* Code / JSON Display */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Request */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    cURL Gateway Proxy Endpoint
                  </span>
                  <span className="text-green-400">HTTP 200 OK</span>
                </div>
                <pre className="bg-gray-900 p-4 rounded-xl text-xs font-mono text-gray-300 overflow-x-auto border border-gray-800 leading-relaxed">
{`curl -X POST https://gateway.burncloud.io/v1/chat \n  -H "Authorization: Bearer bc_live_key_918f" \n  -H "X-BurnCloud-Attest: TPM_ENCLAVE_STRICT" \n  -d '{
    "model": "${activeModel}",
    "messages": [{"role": "user", "content": "Ping"}]
  }'`}
                </pre>
              </div>

              {/* Right Column: Hardware Receipt */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    Returned Attestation Receipt
                  </span>
                  <span className="text-blue-400">VERIFIED SILICON</span>
                </div>
                <pre className="bg-gray-900 p-4 rounded-xl text-xs font-mono text-gray-300 overflow-x-auto border border-gray-800 leading-relaxed">
{`{
  "burncloud_trace_id": "tr_8f3c11_${activeModel.replace(/-/g, '_')}",
  "hardware_signature": "0x${Math.random().toString(16).substring(2, 10)}...enclave",
  "routed_provider": "AWS Bedrock (us-east-1)",
  "latency_ms": ${simulatedLatency},
  "dilution_check": "PASSED (0% middleman variance)"
}`}
                </pre>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Zero model proxy dilution guaranteed by BurnCloud Nitro Enclaves.</span>
              </div>
              <Link to="/playground" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                Open Full Interactive Playground →
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section id="features" className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono mb-2">
              WHY BURNCLOUD
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
              Engineered for Enterprise Trust & Silicon Integrity
            </p>
            <p className="text-gray-600 mt-3 text-base">
              Traditional gateways add latency and expose API keys to middleman proxies. BurnCloud executes direct, hardware-verified attestation directly at the silicon edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-7 space-y-4 hover:border-gray-300 transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950">100% Cryptographic Attestation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every routed response contains an immutable cryptographic signature generated inside secure AWS Nitro / GCP Confidential enclaves, proving model authenticity.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-500 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> HMAC-SHA256 Token Chains</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Zero Middleman Proxy Tampering</li>
              </ul>
            </Card>

            <Card className="p-7 space-y-4 hover:border-gray-300 transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950">Sub-150ms Smart Fallback</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                If an upstream provider like Anthropic or OpenAI experiences rate limits or outages, BurnCloud instantly reroutes to AWS Bedrock or Vertex AI within milliseconds.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-500 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Automatic Failover Health Checks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Dynamic Load Balancing</li>
              </ul>
            </Card>

            <Card className="p-7 space-y-4 hover:border-gray-300 transition-all duration-200 hover:-translate-y-1">
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-950">Automated Cost Optimization</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Intelligent routing algorithms analyze prompt complexity and redirect simpler queries to lower-cost providers without compromising output quality.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-500 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Up to 40% LLM Spend Reduction</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Unified Usage & Billing Dashboard</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture & Provider Matrix */}
      <section id="architecture" className="py-20 bg-white border-t border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="brand">MULTI-CLOUD ENCLAVE MATRIX</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight leading-tight">
                One Clean API to Connect Every Major Silicon Provider
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Never worry about provider lock-in, differing SDK formats, or missing SLA guarantees. BurnCloud standardizes all API schemas into OpenAI-compatible endpoints with real-time auditability.
              </p>

              <div className="space-y-4">
                {[
                  { title: "AWS Bedrock & Nitro Enclaves", desc: "Native hardware-bound security tokens directly from Bedrock us-east-1 and eu-central-1.", icon: Server },
                  { title: "Anthropic & Direct API Clusters", desc: "Ultra-fast direct handshakes with Claude models with zero key retention.", icon: Cpu },
                  { title: "Google Cloud Vertex AI & Azure OpenAI", desc: "Enterprise enterprise compliance with SOC2 Type II and HIPAA ready routing.", icon: Building2 }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-gray-50 border border-gray-200/60">
                    <div className="p-2 bg-white rounded-lg border border-gray-200/80 text-gray-900 shrink-0 mt-0.5">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-950">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-6 bg-[#F9FAFB] border-gray-200/80 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-sm text-gray-900">Active Routing Nodes</span>
                </div>
                <Badge variant="success">ALL SYSTEMS NOMINAL</Badge>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {[
                  { name: "aws-bedrock-us-east-1", status: "ONLINE", ms: "124ms", load: "48%" },
                  { name: "anthropic-direct-cluster", status: "ONLINE", ms: "148ms", load: "32%" },
                  { name: "gcp-vertex-us-central1", status: "ONLINE", ms: "135ms", load: "16%" },
                  { name: "groq-accelerator-node", status: "ONLINE", ms: "89ms", load: "4%" }
                ].map((node, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-gray-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="font-semibold text-gray-900">{node.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <span>{node.ms}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">{node.load}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 text-center">
                <Link to="/routes" className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                  Manage Route Configurations in Console <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section - Pure Token Pay-As-You-Go */}
      <section id="pricing" className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="brand" className="mb-2 uppercase tracking-widest font-mono">TOKEN PAY-AS-YOU-GO</Badge>
            <p className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">Pay Only For The Tokens You Route</p>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Zero monthly subscriptions or hidden platform markups. Pay strictly for actual LLM token consumption with hardware attestation guarantees.
            </p>

            {/* Token Transparency Banner */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/80 rounded-full shadow-sm text-xs font-mono text-gray-700">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-semibold text-gray-900">Direct Pass-Through Rates</span>
              <span className="text-gray-300">•</span>
              <span className="text-green-700 font-bold">$0 Gateway Token Markup</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Developer Sandbox */}
            <Card className="p-8 space-y-6 flex flex-col justify-between hover:border-gray-300 transition-all">
              <div className="space-y-4">
                <Badge variant="neutral">DEVELOPER SANDBOX</Badge>
                <div>
                  <span className="text-4xl font-bold text-gray-950">$0</span>
                  <span className="text-gray-500 text-xs font-medium"> / $5 Free Credits</span>
                </div>
                <p className="text-xs text-gray-600">Free starter credits to build and benchmark route configurations with zero commitment.</p>
                <div className="pt-4 border-t border-gray-100 space-y-3 text-xs text-gray-700">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Includes $5 initial credit (~2M tokens)</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Access to all silicon model routes</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Hardware receipts on every call</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> 7-day Log Retention</div>
                </div>
              </div>
              <Button onClick={() => navigate('/register')} variant="secondary" className="w-full">
                Get $5 Free Credits
              </Button>
            </Card>

            {/* Pay-As-You-Go Standard (Featured) */}
            <Card className="p-8 space-y-6 flex flex-col justify-between border-2 border-gray-900 shadow-xl relative bg-white">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider font-mono">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <Badge variant="brand">PAY-AS-YOU-GO</Badge>
                <div>
                  <span className="text-3xl font-bold text-gray-950">Pay Per Token</span>
                  <span className="text-gray-500 text-xs font-medium block mt-1">Zero monthly fixed fee</span>
                </div>
                <p className="text-xs text-gray-600">Top up your balance or connect pay-as-you-go billing. Pay exact upstream model rates.</p>
                <div className="pt-4 border-t border-gray-100 space-y-3 text-xs text-gray-700">
                  <div className="flex items-center gap-2 font-semibold"><Check className="w-4 h-4 text-green-600" /> Upstream pass-through model pricing</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Sub-150ms Smart Fallbacks</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Unlimited API keys & routes</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Real-time token usage meter</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> 30-day Log Retention</div>
                </div>
              </div>
              <Button onClick={() => navigate('/register')} variant="primary" className="w-full gap-2">
                <span>Start Pay-As-You-Go</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>

            {/* Enterprise Volume */}
            <Card className="p-8 space-y-6 flex flex-col justify-between hover:border-gray-300 transition-all">
              <div className="space-y-4">
                <Badge variant="neutral">ENTERPRISE VOLUME</Badge>
                <div>
                  <span className="text-3xl font-bold text-gray-950">Volume Rates</span>
                  <span className="text-gray-500 text-xs font-medium block mt-1">Post-paid monthly invoicing</span>
                </div>
                <p className="text-xs text-gray-600">For high-throughput teams processing billions of tokens with custom SLA guarantees.</p>
                <div className="pt-4 border-t border-gray-100 space-y-3 text-xs text-gray-700">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Tiered token volume discounts</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Dedicated Nitro Enclave cluster</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Custom BAA / HIPAA Compliance</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> 24/7 Support & Dedicated Engineer</div>
                </div>
              </div>
              <Button onClick={() => navigate('/team')} variant="secondary" className="w-full">
                Contact Enterprise Sales
              </Button>
            </Card>
          </div>

          {/* Model Token Pass-Through Price Sample */}
          <div className="mt-12 max-w-4xl mx-auto p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-bold text-gray-950">Sample Model Token Rates (Pass-Through)</h4>
                <p className="text-xs text-gray-500">BurnCloud charges zero markup on raw provider token prices.</p>
              </div>
              <Badge variant="success" className="font-mono text-[10px]">VERIFIED ZERO MARKUP</Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-gray-500 text-[10px]">Claude Fable 5</div>
                <div className="font-bold text-gray-900 mt-1">$3.00 / 1M in</div>
                <div className="text-gray-600">$15.00 / 1M out</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-gray-500 text-[10px]">GPT-4o Nitro</div>
                <div className="font-bold text-gray-900 mt-1">$2.50 / 1M in</div>
                <div className="text-gray-600">$10.00 / 1M out</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-gray-500 text-[10px]">DeepSeek R1</div>
                <div className="font-bold text-gray-900 mt-1">$0.55 / 1M in</div>
                <div className="text-gray-600">$2.19 / 1M out</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-gray-500 text-[10px]">Llama 3.3 70B</div>
                <div className="font-bold text-gray-900 mt-1">$0.60 / 1M in</div>
                <div className="text-gray-600">$0.60 / 1M out</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200/80 py-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Logo className="w-6 h-6" />
            <span className="font-bold text-gray-900 text-sm">BurnCloud Gateway</span>
            <span className="text-gray-300">•</span>
            <span>© 2026 BurnCloud Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/home" className="hover:text-gray-900 transition-colors">Home</Link>
            <Link to="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-gray-900 transition-colors">Register</Link>
            <Link to="/" className="hover:text-gray-900 transition-colors">Console</Link>
            <Link to="/playground" className="hover:text-gray-900 transition-colors">Playground</Link>
            <Link to="/settings" className="hover:text-gray-900 transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
