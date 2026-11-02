/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Plus,
  ChevronDown,
  Sparkles,
  Copy,
  Check,
  Bot,
  User,
  PanelLeftClose,
  PanelLeft,
  Settings2,
  Trash2,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/i18n/I18nContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useRole } from '@/context/RoleContext';
import { WORKBENCH_MODELS } from '@/data/workbenchData';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  thinkingOpen?: boolean;
  timestamp: string;
  metrics?: {
    tps: number;
    ttft: number;
    enclave: string;
    cost: string;
  };
}

interface ChatSession {
  id: string;
  title: string;
  modelId: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export function Home() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { role } = useRole();

  // Model selection
  const availableModels = WORKBENCH_MODELS.slice(0, 5);
  const [selectedModelId, setSelectedModelId] = useState<string>(availableModels[1]?.id || 'deepseek-r1');
  const activeModel = availableModels.find((m) => m.id === selectedModelId) || availableModels[0];

  // Sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Model dropdown open
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  // System settings popover
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [temperature, setTemperature] = useState(0.6);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful, cryptographically attested AI model running on BurnCloud decentralized hardware enclaves.');



  // Input & Streaming states
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initial chat sessions (Ollama style)
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session-1',
      title: language === 'zh' ? 'DeepSeek R1 推理与硬件证明' : 'DeepSeek R1 Hardware Attestation',
      modelId: 'deepseek-r1',
      updatedAt: '10m ago',
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: language === 'zh' 
            ? '请说明 BurnCloud 的硬件 Enclave 机密计算是如何证明零数据残留的？' 
            : 'How does BurnCloud hardware Enclave compute guarantee zero data retention?',
          timestamp: '10:42 AM'
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: language === 'zh'
            ? `BurnCloud 采用 **AMD SEV-SNP** 与 **AWS Nitro Enclaves** 硬件级根信任签名机制保障零数据残留：

1. **硬件级内存加密**：虚拟机内部内存均由处理器内置的安全处理器（ASP）使用独立密钥硬件级加密，宿主机操作系统和物理机所有者均无法窥探。
2. **密码学硬件认证（Remote Attestation）**：每次推理请求返回的响应头均包含来自 TPM 2.0 芯片的私钥签名哈希，可由客户端通过厂商根证书公钥直接验证。
3. **内存即时零化（Memory Zeroization）**：TLS 1.3 会话结束时，Enclave 内部微内核会自动执行内存零化覆写，确保上下文不持久化至磁盘。

\`\`\`json
{
  "burncloud_receipt": {
    "enclave_type": "AMD_SEV_SNP_GEN4",
    "pcr0_measurement": "a8f94e2b0c11d94f...",
    "zeroization_policy": "STRICT_EPHEMERAL",
    "verified_at": "2026-10-20T05:50:00Z"
  }
}
\`\`\``
            : `BurnCloud ensures zero data retention through **AMD SEV-SNP** and **AWS Nitro Enclaves** hardware root-of-trust signatures:

1. **Hardware Memory Encryption**: VM memory is encrypted in hardware by the AMD Secure Processor with isolated ephemeral keys.
2. **Cryptographic Attestation Receipt**: Every API response embeds a TPM 2.0 chip hardware signature verifiable against AMD/AWS public certificates.
3. **Ephemeral Zeroization**: Upon TLS 1.3 socket termination, the enclave microkernel zeroes all allocated inference buffers.

\`\`\`json
{
  "burncloud_receipt": {
    "enclave_type": "AMD_SEV_SNP_GEN4",
    "pcr0_measurement": "a8f94e2b0c11d94f...",
    "zeroization_policy": "STRICT_EPHEMERAL",
    "verified_at": "2026-10-20T05:50:00Z"
  }
}
\`\`\``,
          thinking: language === 'zh'
            ? '分析用户对去中心化算力隐私与零残留机密性的关注点：需从硬件根信任（AMD SEV-SNP）、PCR度量证明、以及传输断开时的内存覆写技术机制进行详细阐述。'
            : 'Analyze user query regarding zero data retention in decentralized AI compute: explain AMD SEV-SNP encryption, remote attestation, PCR measurement, and ephemeral memory zeroization.',
          thinkingOpen: false,
          timestamp: '10:42 AM',
          metrics: {
            tps: 128.4,
            ttft: 41,
            enclave: 'AMD SEV-SNP #H100-08',
            cost: '$0.00014'
          }
        }
      ]
    },
    {
      id: 'session-2',
      title: language === 'zh' ? 'Python 异步流式客户端' : 'Python Async Streaming Client',
      modelId: 'deepseek-v3',
      updatedAt: '2h ago',
      messages: []
    },
    {
      id: 'session-3',
      title: language === 'zh' ? 'Solana 质押与 SLA 罚没' : 'Solana Escrow SLA Slashing',
      modelId: 'llama-3.3-70b-instruct',
      updatedAt: 'Yesterday',
      messages: []
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isGenerating]);

  // Handle new chat
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: language === 'zh' ? '新会话' : 'New Chat',
      modelId: selectedModelId,
      updatedAt: 'Just now',
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Handle delete chat
  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // Clear messages instead of deleting last session
      setSessions([
        {
          id: `session-${Date.now()}`,
          title: language === 'zh' ? '新会话' : 'New Chat',
          modelId: selectedModelId,
          updatedAt: 'Just now',
          messages: []
        }
      ]);
      return;
    }
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Toggle thinking accordion
  const toggleThinking = (msgId: string) => {
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSessionId) return sess;
        return {
          ...sess,
          messages: sess.messages.map((m) =>
            m.id === msgId ? { ...m, thinkingOpen: !m.thinkingOpen } : m
          )
        };
      })
    );
  };

  // Copy code helper
  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Send message
  const handleSendMessage = (contentToSend?: string) => {
    const text = (contentToSend || inputMessage).trim();
    if (!text || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update session title if first message
    const isFirst = currentSession.messages.length === 0;
    const newTitle = isFirst ? (text.slice(0, 24) + (text.length > 24 ? '...' : '')) : currentSession.title;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: newTitle,
              messages: [...s.messages, userMessage]
            }
          : s
      )
    );

    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate model inference streaming & hardware attestation
    setIsGenerating(true);

    const isDeepSeek = activeModel.id.includes('deepseek') || activeModel.id.includes('r1');
    const thinkingText = isDeepSeek
      ? (language === 'zh'
          ? `正在验证硬件隔离环境... 建立 AMD SEV-SNP TLS 1.3 会话。\n已获取 TPM 芯片测量值与节点质押凭证。\n分析 Prompt 语义并生成零残留安全推理流。`
          : `Verifying enclave environment... Initializing AMD SEV-SNP TLS 1.3 session.\nRetrieved TPM 2.0 PCR measurements and node stake escrow status.\nSynthesizing cryptographically attested response stream.`)
      : undefined;

    setTimeout(() => {
      let responseBody = '';
      if (text.toLowerCase().includes('python') || text.toLowerCase().includes('client') || text.toLowerCase().includes('代码')) {
        responseBody = language === 'zh'
          ? `以下是连接到 BurnCloud 去中心化机密推理网关的官方 Python 客户端示例，完全兼容 OpenAI SDK：

\`\`\`python
import os
from openai import OpenAI

# BurnCloud 兼容端点：直通硬件机密隔离节点，零加价
client = OpenAI(
    base_url="https://gateway.burncloud.io/v1",
    api_key=os.environ.get("BURNCLOUD_API_KEY", "bc_live_demo_key"),
    default_headers={
        "X-BurnCloud-Attest": "STRICT_ENCLAVE_V2",
        "X-BurnCloud-Escrow": "SOLANA_VERIFIED"
    }
)

response = client.chat.completions.create(
    model="${activeModel.id}",
    messages=[
        {"role": "system", "content": "You are running on confidential hardware."},
        {"role": "user", "content": "${text.replace(/"/g, '\\"')}"}
    ],
    temperature=0.6,
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
\`\`\`

每个流式数据包在传输断开后，GPU显存即时清零，无任何日志或上下文保留。`
          : `Here is the production Python snippet connecting to the BurnCloud confidential gateway, 100% compatible with the official OpenAI SDK:

\`\`\`python
import os
from openai import OpenAI

# Direct pass-through to confidential hardware enclaves with zero markup
client = OpenAI(
    base_url="https://gateway.burncloud.io/v1",
    api_key=os.environ.get("BURNCLOUD_API_KEY", "bc_live_demo_key"),
    default_headers={
        "X-BurnCloud-Attest": "STRICT_ENCLAVE_V2",
        "X-BurnCloud-Escrow": "SOLANA_VERIFIED"
    }
)

response = client.chat.completions.create(
    model="${activeModel.id}",
    messages=[
        {"role": "system", "content": "You are running on confidential hardware."},
        {"role": "user", "content": "${text.replace(/"/g, '\\"')}"}
    ],
    temperature=0.6,
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
\`\`\`

All tokens stream directly from AMD SEV-SNP enclaves with cryptographic signature headers.`;
      } else if (text.toLowerCase().includes('curl') || text.toLowerCase().includes('api')) {
        responseBody = `\`\`\`bash
curl -X POST https://gateway.burncloud.io/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer bc_live_key_demo" \\
  -H "X-BurnCloud-Attest: TPM_ENCLAVE_STRICT" \\
  -d '{
    "model": "${activeModel.id}",
    "messages": [
      {"role": "user", "content": "${text.replace(/"/g, '\\"')}"}
    ],
    "temperature": ${temperature}
  }'
\`\`\``;
      } else {
        responseBody = language === 'zh'
          ? `基于 **${activeModel.name}**（通过 BurnCloud 机密硬件网络运行）的分析如下：

1. **计算性能与吞吐**：当前节点分配至 **8x NVIDIA H100 SXM5** 集群，测得吞吐速度约为 **${activeModel.throughputTokensPerSec} tokens/s**，p95 延迟为 **${activeModel.p95LatencyMs}ms**。
2. **机密计算保护**：本轮对话完全驻留在硬件 Enclave 隔离区，AMD SEV-SNP 内存密钥独立生成，服务提供商与宿主操作系统无法提取任何上下文。
3. **成本效益**：当前模型输入仅需 **$${activeModel.inputPrice1M}/M tokens**，输出仅需 **$${activeModel.outputPrice1M}/M tokens**，相较中心化云服务节约超过 68% 的开销。

如需在生产环境大规模调用或配置自动化路由策略，可在顶部点击 **「进入控制台」** 查看实时节点集群分布与 API 密钥管理。`
          : `Execution summary from **${activeModel.name}** running on BurnCloud decentralized confidential enclaves:

1. **Inference Throughput**: Routed to an authenticated **8x NVIDIA H100 SXM5** node, achieving **${activeModel.throughputTokensPerSec} tokens/s** with p95 latency of **${activeModel.p95LatencyMs}ms**.
2. **Confidential Isolation**: Strictly processed inside an AMD SEV-SNP confidential virtual machine with ephemeral memory encryption.
3. **Direct Wholesale Cost**: Input at **$${activeModel.inputPrice1M}/M tokens**, output at **$${activeModel.outputPrice1M}/M tokens**, saving up to 70% compared to legacy aggregators.

To provision production keys or deploy your own node, click **"Open Console"** in the top navigation bar.`;
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: responseBody,
        thinking: thinkingText,
        thinkingOpen: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metrics: {
          tps: Math.floor(activeModel.throughputTokensPerSec + (Math.random() * 10 - 5)),
          ttft: Math.floor(activeModel.p95LatencyMs / 8),
          enclave: `AMD SEV-SNP #${activeModel.family.toUpperCase()}-0${Math.floor(Math.random() * 8 + 1)}`,
          cost: `$${(0.0001 + Math.random() * 0.0002).toFixed(5)}`
        }
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: [...s.messages, assistantMessage]
              }
            : s
        )
      );

      setIsGenerating(false);
    }, 900);
  };

  // Suggestion chips (Ollama style)
  const suggestionCards = [
    {
      title: language === 'zh' ? 'OpenAI 兼容 Python 客户端' : 'OpenAI-Compatible Python Client',
      desc: language === 'zh' ? '生成带硬件 Enclave 认证头的流式推理代码' : 'Generate streaming code with TPM enclave headers',
      prompt: language === 'zh' ? '请生成一段使用 OpenAI Python SDK 调用 BurnCloud 机密推理网关的代码。' : 'Show me how to use the OpenAI Python SDK to call BurnCloud confidential gateway.'
    },
    {
      title: language === 'zh' ? '对比 DeepSeek-R1 与 Llama 3.3' : 'DeepSeek-R1 vs Llama 3.3 Benchmark',
      desc: language === 'zh' ? '对比 70B 级别开源模型的吞吐、延迟与费率' : 'Compare 70B open weights throughput, latency & cost',
      prompt: language === 'zh' ? '请对比 DeepSeek-R1 和 Llama 3.3 70B 在 H100 上的推理吞吐、延迟与性价比。' : 'Compare DeepSeek-R1 and Llama 3.3 70B on H100 SXM5 throughput, latency, and token pricing.'
    },
    {
      title: language === 'zh' ? '零数据残留硬件加密原理解析' : 'Zero Data Retention Cryptography',
      desc: language === 'zh' ? '了解 AMD SEV-SNP 内存零化与 TPM 根证书' : 'Learn AMD SEV-SNP memory encryption & TPM verification',
      prompt: language === 'zh' ? 'BurnCloud 是如何通过硬件 TPM 和远程认证保证客户 Prompt 零数据残留的？' : 'How does BurnCloud guarantee zero prompt retention through hardware TPM remote attestation?'
    },
    {
      title: language === 'zh' ? 'cURL 直通推理与网络延迟测试' : 'cURL Route & Latency Benchmark',
      desc: language === 'zh' ? '查看秒级故障转移与全球 p95 响应时间' : 'Direct API request test with sub-150ms failover',
      prompt: language === 'zh' ? '提供一个直接调用 BurnCloud 网关的 cURL 示例，并展示返回的硬件收据字段。' : 'Provide a cURL command to call BurnCloud gateway and explain the cryptographic hardware receipt.'
    }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-white text-gray-900 font-sans flex flex-row">
      {/* =========================================================================
          LEFT SIDEBAR: Ollama-style Minimalist Sidebar
          ========================================================================= */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="h-full bg-[#FAFAFA] border-r border-gray-200/90 flex flex-col flex-shrink-0 z-30 select-none overflow-hidden"
          >
            {/* Sidebar Top: Logo + New Chat button (h-14 aligned with main header) */}
            <div className="h-14 px-3 border-b border-gray-200/80 flex items-center justify-between flex-shrink-0">
              <Link to="/home" className="flex items-center gap-2 group px-1 py-1">
                <Logo className="w-5 h-5 group-hover:scale-105 transition-transform text-zinc-950" />
                <span className="font-display font-bold text-sm tracking-tight text-gray-950">BurnCloud</span>
              </Link>
              <button
                onClick={handleNewChat}
                className="p-1.5 hover:bg-gray-200/70 rounded-lg text-gray-600 hover:text-gray-950 transition-colors cursor-pointer"
                title={language === 'zh' ? '新建会话 (⌘N)' : 'New Chat (⌘N)'}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>



            {/* Chat Sessions History List */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1 px-2 font-semibold">
                {language === 'zh' ? '近期对话记录' : 'Recent Chats'}
              </div>
              {sessions.map((sess) => {
                const isActive = sess.id === activeSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => setActiveSessionId(sess.id)}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-white border border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-gray-950 font-medium'
                        : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <Bot className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-zinc-950' : 'text-gray-400'}`} />
                      <span className="truncate text-[12px]">{sess.title}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDeleteSession(e, sess.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-gray-100"
                        title={language === 'zh' ? '删除' : 'Delete'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Bottom: Language & Version */}
            <div className="p-3 border-t border-gray-200/80 bg-white/60 relative z-20">
              <div className="flex items-center justify-between px-1 text-xs text-gray-500">
                <span className="text-[11px] font-mono text-gray-400">BurnCloud v2.4</span>
                <LanguageSwitcher variant="footer" dropDirection="up" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MAIN CHAT STAGE: Ollama-style Main Canvas
          ========================================================================= */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-white relative">
        {/* Top Header Navbar */}
        <header className="h-14 border-b border-gray-200/80 px-4 sm:px-6 flex items-center justify-between bg-white/95 backdrop-blur-sm z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Toggle Sidebar Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-950 transition-colors cursor-pointer"
              title={sidebarOpen ? (language === 'zh' ? '折叠侧边栏' : 'Collapse Sidebar') : (language === 'zh' ? '展开侧边栏' : 'Expand Sidebar')}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>

            {/* Model Selector Dropdown Pill */}
            <div className="relative">
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200/90 hover:border-gray-300 bg-gray-50/70 hover:bg-white text-xs font-medium transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                <span className="font-mono font-bold text-gray-950">{activeModel.name}</span>
                <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">({activeModel.contextWindow})</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Model Dropdown Menu */}
              <AnimatePresence>
                {modelDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setModelDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 top-full mt-1.5 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-[11px] font-mono text-gray-500">
                        <span>{language === 'zh' ? '可用开源与机密模型' : 'Available Models'}</span>
                        <span>{language === 'zh' ? '直接直通底价' : 'Direct Wholesale'}</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto py-1 space-y-1">
                        {availableModels.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedModelId(m.id);
                              setModelDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer ${
                              m.id === selectedModelId
                                ? 'bg-zinc-950 text-white shadow-xs'
                                : 'hover:bg-gray-50 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs">{m.name}</span>
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${m.id === selectedModelId ? 'bg-zinc-800 text-zinc-200' : 'bg-gray-100 text-gray-600'}`}>
                                ${m.inputPrice1M}/M
                              </span>
                            </div>
                            <div className={`text-[11px] mt-0.5 truncate ${m.id === selectedModelId ? 'text-zinc-300' : 'text-gray-500'}`}>
                              {m.tagline}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                              <span className={m.id === selectedModelId ? 'text-emerald-300' : 'text-emerald-600'}>
                                {m.throughputTokensPerSec} tok/s
                              </span>
                              <span>•</span>
                              <span className={m.id === selectedModelId ? 'text-zinc-300' : 'text-gray-400'}>
                                p95 {m.p95LatencyMs}ms
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Header Navigation Items */}
          <div className="flex items-center gap-2.5">


            {/* Clear Chat */}
            <button
              onClick={handleNewChat}
              className="p-1.5 text-gray-500 hover:text-gray-950 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              title={language === 'zh' ? '新建对话' : 'New Chat'}
            >
              <Plus className="w-4 h-4" />
            </button>



            {/* Go to Console Button */}
            <Link to={role === 'supplier' ? '/supplier' : role === 'admin' ? '/admin' : '/buyer'}>
              <Button variant="primary" size="sm" className="text-xs gap-1.5">
                <span>{language === 'zh' ? '进入工作台' : 'Console'}</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Conversation Stream Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="max-w-3xl mx-auto w-full">
            {/* If no messages in active session: Ollama-style Empty State */}
            {currentSession.messages.length === 0 ? (
              <div className="pt-12 pb-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-md mb-4 ring-4 ring-zinc-100">
                  <Logo className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight font-display">
                  {language === 'zh' ? '今天想运行什么模型或任务？' : 'What would you like to run today?'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md font-normal leading-relaxed">
                  {language === 'zh'
                    ? '基于 AMD SEV-SNP 硬件 Enclave 的去中心化高速推理，零加价底价计费，硬件密码学证明直通。'
                    : 'Confidential high-throughput inference verified by hardware root-of-trust, zero-markup token pricing.'}
                </p>

                {/* Prompt Starter Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full text-left">
                  {suggestionCards.map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(card.prompt)}
                      className="p-3.5 rounded-2xl border border-gray-200/90 hover:border-gray-900 bg-white hover:bg-gray-50/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all group text-left cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-900 group-hover:text-black">
                        <span>{card.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {card.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Chat Message List */
              <div className="space-y-6 pb-4">
                {currentSession.messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={msg.id} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {/* Avatar */}
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-xs">
                          <Logo className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className={`max-w-[85%] sm:max-w-[78%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                        {/* Thinking Accordion for Reasoning Models (DeepSeek R1 style) */}
                        {!isUser && msg.thinking && (
                          <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 overflow-hidden text-xs">
                            <button
                              onClick={() => toggleThinking(msg.id)}
                              className="w-full flex items-center justify-between px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors font-mono text-[11px] font-medium cursor-pointer"
                            >
                              <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>{language === 'zh' ? '思考过程 (Chain-of-Thought)' : 'Thinking Process'}</span>
                              </span>
                              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${msg.thinkingOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {msg.thinkingOpen && (
                              <div className="px-3 py-2 border-t border-gray-200/60 bg-white/60 font-mono text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {msg.thinking}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                            isUser
                              ? 'bg-zinc-950 text-white font-medium rounded-tr-sm'
                              : 'bg-white border border-gray-200/90 text-gray-900 rounded-tl-sm'
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-sans">
                            {msg.content}
                          </div>
                        </div>

                        {/* Telemetry / Metrics strip for assistant message */}
                        {!isUser && msg.metrics && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-gray-500 px-1">
                            <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                              <Zap className="w-2.5 h-2.5" />
                              <span>{msg.metrics.tps} tok/s</span>
                            </span>
                            <span>•</span>
                            <span>{msg.metrics.ttft}ms TTFT</span>
                            <span>•</span>
                            <span className="text-gray-600 font-medium">{msg.metrics.enclave}</span>
                            <span>•</span>
                            <span className="text-gray-700 font-semibold">{msg.metrics.cost}</span>

                            <button
                              onClick={() => handleCopyCode(msg.content, msg.id)}
                              className="ml-auto flex items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors p-1"
                              title="Copy response"
                            >
                              {copiedCodeId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* User Avatar */}
                      {isUser && (
                        <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Generating Loading State */}
                {isGenerating && (
                  <div className="flex gap-3.5 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center text-white flex-shrink-0 shadow-xs">
                      <Logo className="w-4 h-4 text-white" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200/90 shadow-xs flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-mono text-gray-600">
                        {language === 'zh' ? '正在连接硬件 Enclave 推理流...' : 'Connecting to Hardware Enclave Stream...'}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Floating Input Container (Ollama style) */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent z-10 flex-shrink-0">
          <div className="max-w-3xl mx-auto w-full">
            <div className="relative rounded-2xl border border-gray-200/90 bg-white shadow-sm focus-within:ring-2 focus-within:ring-zinc-950/10 focus-within:border-zinc-950 transition-all p-2.5">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  language === 'zh'
                    ? `输入消息或指令（Shift + Enter 换行）• 当前模型: ${activeModel.name}`
                    : `Send a message (Shift + Enter for newline) • Model: ${activeModel.name}`
                }
                rows={1}
                className="w-full resize-none border-0 bg-transparent text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 max-h-36 min-h-[36px] px-2 pt-1 font-sans font-medium"
              />

              {/* Inner input footer toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 px-1 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded-md">
                    {activeModel.id}
                  </span>
                  <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="p-1 text-gray-400 hover:text-gray-900 transition-colors rounded hover:bg-gray-100 flex items-center gap-1 text-[11px] font-mono"
                    title={language === 'zh' ? '推理参数配置' : 'Inference Settings'}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">temp: {temperature}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isGenerating}
                  className="w-8 h-8 rounded-full bg-zinc-950 hover:bg-zinc-850 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                  title={language === 'zh' ? '发送' : 'Send'}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* System Settings Popover */}
              <AnimatePresence>
                {settingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-2 bottom-full mb-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-30 text-xs space-y-3"
                  >
                    <div className="flex items-center justify-between font-bold text-gray-950">
                      <span>{language === 'zh' ? '推理参数' : 'Model Parameters'}</span>
                      <button onClick={() => setSettingsOpen(false)} className="text-gray-400 hover:text-black">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-gray-500 mb-1">
                        <span>Temperature</span>
                        <span>{temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-zinc-950 h-1 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-gray-500 mb-1">System Prompt</div>
                      <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        rows={2}
                        className="w-full text-[11px] p-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Disclaimer */}
            <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-gray-400 font-sans text-center">
              <span>BurnCloud Gateway v2.4 • Verifiable P2P Decentralized Inference</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
