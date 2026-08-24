'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  protocolStreamService,
  TelemetryPacket,
  ProtocolLoop,
  PacketSeverity,
} from '@/lib/services/protocolStreamService';
import {
  Terminal,
  Activity,
  ShieldCheck,
  Zap,
  Play,
  Pause,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
  Layers,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
} from 'lucide-react';

interface LiveProtocolDeckProps {
  initialFilter?: ProtocolLoop | 'ALL';
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function LiveProtocolDeck({
  initialFilter = 'ALL',
  compact = false,
  showHeader = true,
  className = '',
}: LiveProtocolDeckProps) {
  const [packets, setPackets] = useState<TelemetryPacket[]>(() => {
    return typeof window !== 'undefined' ? protocolStreamService.getPackets() : [];
  });
  const [activeLoop, setActiveLoop] = useState<ProtocolLoop | 'ALL'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoStreaming, setIsAutoStreaming] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? protocolStreamService.isStreaming() : false;
  });
  const [autoScroll, setAutoScroll] = useState(true);
  const [crtEffect, setCrtEffect] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<TelemetryPacket | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to incoming stream packets
    const unsubscribe = protocolStreamService.subscribe((newPacket) => {
      setPackets((prev) => [newPacket, ...prev.slice(0, 199)]);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [packets, autoScroll]);

  const toggleStreaming = () => {
    const nextState = protocolStreamService.toggleAutoStream();
    setIsAutoStreaming(nextState);
  };

  const handleClear = () => {
    protocolStreamService.clearPackets();
    setPackets([]);
    setSelectedPacket(null);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(packets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cymbal-protocol-telemetry-${new Date().toISOString().slice(0, 19)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = (obj: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTrigger = (type: 'STALLED_CART' | 'STOCK_ARRIVAL' | 'SURVEY_DETRACTOR' | 'AI_ASSISTANT' | 'SD_JWT_VERIFY') => {
    protocolStreamService.triggerManualSimulation(type);
  };

  // Filtered packets
  const filteredPackets = packets.filter((p) => {
    const matchesLoop = activeLoop === 'ALL' || p.loop === activeLoop;
    const matchesSearch =
      !searchQuery.trim() ||
      p.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sourceAgent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.targetAgent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.protocol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLoop && matchesSearch;
  });

  // Metrics
  const totalPackets = packets.length;
  const a2aNegotiations = packets.filter((p) => p.severity === 'A2A_NEGOTIATION').length;
  const verifiedJwtCount = packets.filter((p) => p.severity === 'SD_JWT_VERIFIED' || p.cryptoProof?.verified).length;
  const mandatesSealed = packets.filter((p) => p.severity === 'MANDATE_SEALED').length;
  const avgLatency = packets.length > 0
    ? Math.round(packets.reduce((sum, p) => sum + p.latencyMs, 0) / packets.length)
    : 0;

  const getSeverityBadge = (sev: PacketSeverity) => {
    switch (sev) {
      case 'A2A_NEGOTIATION':
        return <span className="cymbal-stamp bg-[#38bdf8] text-[#020617] text-[9px]">A2A NEGOTIATION</span>;
      case 'MANDATE_SEALED':
        return <span className="cymbal-stamp bg-purple-400 text-[#020617] text-[9px]">AP2 MANDATE</span>;
      case 'SD_JWT_VERIFIED':
        return <span className="cymbal-stamp bg-emerald-400 text-[#020617] text-[9px]">SD-JWT VERIFIED</span>;
      case 'WARN':
        return <span className="cymbal-stamp bg-rose-500 text-white text-[9px]">ESCALATION</span>;
      case 'DISPATCH':
        return <span className="cymbal-stamp bg-amber-400 text-[#020617] text-[9px]">DISPATCH</span>;
      default:
        return <span className="cymbal-stamp bg-slate-700 text-slate-200 text-[9px]">INFO</span>;
    }
  };

  const getLoopColor = (loop: ProtocolLoop) => {
    switch (loop) {
      case 'LOOP_1_RECOVERY':
        return 'text-[#38bdf8] border-[#0284c7]/40 bg-[#0284c7]/10';
      case 'LOOP_2_INVENTORY':
        return 'text-purple-400 border-purple-500/40 bg-purple-500/10';
      case 'LOOP_3_OPERATIONS':
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
      case 'LOOP_4_ASSISTANT':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'CRYPTO_SECURITY':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800/40';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Banner / Metrics Deck */}
      {showHeader && (
        <div className="cymbal-box-lg p-5 bg-[#0a0f1d] border-[#1e293b] space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="cymbal-stamp bg-emerald-400 text-[#020617] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#020617] rounded-full animate-ping" />
                  LIVE TELEMETRY
                </span>
                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                  OBSERVATION DECK • JSON-RPC 2.0 / A2A / AP2 v0.2
                </span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#38bdf8]" />
                Live Agent Protocol Chatter Console
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Inspect real-time cryptographic handshakes, agent negotiation envelopes, and deterministic state transitions.
              </p>
            </div>

            {/* Quick Trigger Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleTrigger('STALLED_CART')}
                className="cymbal-btn-secondary px-2.5 py-1.5 text-xs text-[#38bdf8] hover:border-[#38bdf8] flex items-center gap-1.5 font-mono text-[11px]"
                title="Emit Stalled Cart A2A 5% Recovery Offer"
              >
                <Zap className="w-3 h-3 text-[#38bdf8]" />
                <span>Simulate Loop 1 (A2A Offer)</span>
              </button>

              <button
                onClick={() => handleTrigger('STOCK_ARRIVAL')}
                className="cymbal-btn-secondary px-2.5 py-1.5 text-xs text-purple-400 hover:border-purple-400 flex items-center gap-1.5 font-mono text-[11px]"
                title="Emit Stock Arrival & Mandate Match"
              >
                <Layers className="w-3 h-3 text-purple-400" />
                <span>Simulate Loop 2 (AP2 Mandate)</span>
              </button>

              <button
                onClick={() => handleTrigger('SURVEY_DETRACTOR')}
                className="cymbal-btn-secondary px-2.5 py-1.5 text-xs text-rose-400 hover:border-rose-400 flex items-center gap-1.5 font-mono text-[11px]"
                title="Emit Detractor 2/10 Escalation"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Simulate Loop 3 (Ops Escalation)</span>
              </button>

              <button
                onClick={() => handleTrigger('SD_JWT_VERIFY')}
                className="cymbal-btn-secondary px-2.5 py-1.5 text-xs text-amber-400 hover:border-amber-400 flex items-center gap-1.5 font-mono text-[11px]"
                title="Verify SD-JWT Signature"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Verify SD-JWT</span>
              </button>
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-[#1e293b]">
            <div className="cymbal-box-md p-2.5 bg-[#060913] border-[#1e293b]">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Packets Streamed</span>
              <div className="text-lg font-black font-mono text-white mt-0.5">{totalPackets}</div>
            </div>
            <div className="cymbal-box-md p-2.5 bg-[#060913] border-[#1e293b]">
              <span className="text-[10px] font-mono text-[#38bdf8] uppercase">A2A Negotiations</span>
              <div className="text-lg font-black font-mono text-[#38bdf8] mt-0.5">{a2aNegotiations}</div>
            </div>
            <div className="cymbal-box-md p-2.5 bg-[#060913] border-[#1e293b]">
              <span className="text-[10px] font-mono text-purple-400 uppercase">Mandates Sealed</span>
              <div className="text-lg font-black font-mono text-purple-400 mt-0.5">{mandatesSealed}</div>
            </div>
            <div className="cymbal-box-md p-2.5 bg-[#060913] border-[#1e293b]">
              <span className="text-[10px] font-mono text-emerald-400 uppercase">SD-JWT Verified</span>
              <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">{verifiedJwtCount}</div>
            </div>
            <div className="cymbal-box-md p-2.5 bg-[#060913] border-[#1e293b] col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Avg Loop Latency</span>
              <div className="text-lg font-black font-mono text-amber-400 mt-0.5">{avgLatency} ms</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Console & Filter Toolbar */}
      <div className={`cymbal-box-lg bg-[#060913] border-[#1e293b] overflow-hidden flex flex-col ${crtEffect ? 'shadow-[0_0_25px_rgba(56,189,248,0.15)] ring-1 ring-[#38bdf8]/30' : ''}`}>
        {/* Terminal Title Bar & Filters */}
        <div className="bg-[#0c1222] border-b border-[#1e293b] p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase mr-1">Filter Loop:</span>
            {[
              { id: 'ALL', label: 'ALL PACKETS' },
              { id: 'LOOP_1_RECOVERY', label: 'LOOP 1 (RECOVERY)' },
              { id: 'LOOP_2_INVENTORY', label: 'LOOP 2 (INVENTORY)' },
              { id: 'LOOP_3_OPERATIONS', label: 'LOOP 3 (OPERATIONS)' },
              { id: 'LOOP_4_ASSISTANT', label: 'LOOP 4 (ASSISTANT)' },
              { id: 'CRYPTO_SECURITY', label: 'SD-JWT / CRYPTO' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLoop(tab.id as any)}
                className={`px-2 py-1 font-mono text-[10px] font-bold rounded-t-sm rounded-br-sm rounded-bl-none transition-colors ${
                  activeLoop === tab.id
                    ? 'bg-[#0284c7] text-white shadow-[1px_1px_0px_#020617]'
                    : 'bg-[#111a30] text-slate-400 hover:text-white hover:bg-[#172342]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protocol logs..."
                className="bg-[#111a30] border border-[#1e293b] rounded-t-sm rounded-br-sm rounded-bl-none px-2.5 py-1 text-[11px] font-mono text-white placeholder-slate-500 outline-none focus:border-[#38bdf8] w-36 sm:w-48"
              />
              <Search className="w-3 h-3 text-slate-500 absolute right-2 top-1.5" />
            </div>

            {/* Auto-Stream Toggle */}
            <button
              onClick={toggleStreaming}
              className={`cymbal-tag cursor-pointer ${
                isAutoStreaming
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
              title={isAutoStreaming ? 'Pause live auto-traffic' : 'Start live auto-traffic generator'}
            >
              {isAutoStreaming ? <Pause className="w-3 h-3 animate-pulse" /> : <Play className="w-3 h-3" />}
              <span className="font-mono text-[10px] hidden sm:inline">{isAutoStreaming ? 'STREAMING' : 'PAUSED'}</span>
            </button>

            {/* CRT Effect Toggle */}
            <button
              onClick={() => setCrtEffect(!crtEffect)}
              className={`cymbal-tag cursor-pointer ${
                crtEffect
                  ? 'border-[#38bdf8]/50 bg-[#38bdf8]/10 text-[#38bdf8]'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle CRT Scanline Aesthetics"
            >
              <Radio className="w-3 h-3" />
              <span className="font-mono text-[10px] hidden sm:inline">CRT</span>
            </button>

            {/* Clear */}
            <button
              onClick={handleClear}
              className="p-1.5 bg-[#111a30] border border-[#1e293b] text-slate-400 hover:text-rose-400 rounded-t-sm rounded-br-sm rounded-bl-none transition-colors"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="p-1.5 bg-[#111a30] border border-[#1e293b] text-slate-400 hover:text-[#38bdf8] rounded-t-sm rounded-br-sm rounded-bl-none transition-colors"
              title="Export JSON Telemetry Trace"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Packet Log Stream */}
        <div
          ref={logContainerRef}
          className={`p-3 space-y-2 font-mono overflow-y-auto ${compact ? 'max-h-[360px]' : 'max-h-[580px]'} ${
            crtEffect
              ? 'bg-[radial-gradient(#0c1a2e_1px,transparent_1px)] [background-size:16px_16px] text-green-400'
              : 'bg-[#060913]'
          }`}
        >
          {filteredPackets.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono space-y-2">
              <Terminal className="w-8 h-8 mx-auto text-slate-600" />
              <p>No telemetry packets match the active filter.</p>
              <button
                onClick={() => handleTrigger('STALLED_CART')}
                className="cymbal-btn-secondary px-3 py-1.5 text-xs text-[#38bdf8] inline-flex items-center gap-1.5"
              >
                <Play className="w-3 h-3" /> Trigger Sample Loop Event
              </button>
            </div>
          ) : (
            filteredPackets.map((pkt) => (
              <div
                key={pkt.id}
                onClick={() => setSelectedPacket(pkt)}
                className={`p-3 rounded-t-lg rounded-br-lg rounded-bl-none border cursor-pointer transition-all group ${
                  selectedPacket?.id === pkt.id
                    ? 'border-[#38bdf8] bg-[#0d1c38] shadow-[2px_2px_0px_#020617]'
                    : 'border-[#172342] bg-[#0a0f1d] hover:border-[#0284c7] hover:bg-[#0c162d]'
                }`}
              >
                {/* Packet Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 mb-1.5">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(pkt.severity)}
                    <span className={`cymbal-tag text-[9px] py-0.5 px-1.5 ${getLoopColor(pkt.loop)}`}>
                      {pkt.loop}
                    </span>
                    <span className="text-slate-500">{new Date(pkt.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="cymbal-stamp bg-[#111a30] text-slate-300 border border-[#1e293b] text-[9px]">
                      {pkt.protocol}
                    </span>
                    <span className="text-amber-400 text-[10px] font-bold">{pkt.latencyMs}ms</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#38bdf8] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Routing Direction */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                  <span className="text-slate-400">{pkt.sourceAgent}</span>
                  <span className="text-[#38bdf8]">➔</span>
                  <span className="text-white">{pkt.targetAgent}</span>
                  <span className="text-slate-500 text-[10px] font-normal font-mono ml-2">
                    [{pkt.action}]
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                  {pkt.summary}
                </p>

                {/* Inline Crypto Proof Tag */}
                {pkt.cryptoProof && (
                  <div className="mt-2 pt-1.5 border-t border-[#172342] flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {pkt.cryptoProof.algorithm} Signature Verified
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">Key: {pkt.cryptoProof.keyId}</span>
                    {pkt.cryptoProof.disclosedClaims && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span className="text-amber-300">
                          Disclosed: [{pkt.cryptoProof.disclosedClaims.join(', ')}]
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Status Bar Bottom */}
        <div className="bg-[#0c1222] border-t border-[#1e293b] p-2.5 px-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              TRANSPORT: LOCAL_A2A_BUS
            </span>
            <span className="text-slate-600">|</span>
            <span>DISPLAYING: {filteredPackets.length} / {packets.length}</span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-slate-500">SPEC: RFC-JSON-RPC-2.0 • AP2-v0.2</span>
            <span className="text-slate-600">|</span>
            <span className="text-[#38bdf8] font-bold">CYMBAL AUTONOMOUS PROTOCOL ENGINE</span>
          </div>
        </div>
      </div>

      {/* Packet Inspector Drawer / Modal */}
      {selectedPacket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cymbal-box-lg bg-[#0a0f1d] border-[#38bdf8] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 bg-[#0c1222] border-b border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-[#38bdf8]" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="cymbal-stamp bg-[#38bdf8] text-[#020617] text-[9px]">
                      {selectedPacket.protocol}
                    </span>
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      PACKET INSPECTOR: {selectedPacket.action}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {selectedPacket.id} • {selectedPacket.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyJson(selectedPacket.payload, selectedPacket.id)}
                  className="cymbal-btn-secondary px-2.5 py-1 text-xs flex items-center gap-1.5 font-mono text-[11px]"
                >
                  {copiedId === selectedPacket.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedPacket(null)}
                  className="px-2.5 py-1 bg-[#111a30] text-slate-400 hover:text-white rounded-t-sm rounded-br-sm rounded-bl-none border border-[#1e293b] font-mono text-xs"
                >
                  ESC ✕
                </button>
              </div>
            </div>

            {/* Inspector Body */}
            <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs">
              {/* Routing Summary */}
              <div className="cymbal-box-md p-3.5 bg-[#060913] border-[#1e293b] space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Agent Routing Header</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Source Agent: </span>
                    <span className="text-white font-bold">{selectedPacket.sourceAgent}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Target Agent: </span>
                    <span className="text-white font-bold">{selectedPacket.targetAgent}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Protocol Loop: </span>
                    <span className="text-[#38bdf8] font-bold">{selectedPacket.loop}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Execution Latency: </span>
                    <span className="text-amber-400 font-bold">{selectedPacket.latencyMs} ms</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof Section */}
              {selectedPacket.cryptoProof && (
                <div className="cymbal-box-md p-3.5 bg-[#060913] border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Cryptographic Signature & Proof Verification
                    </span>
                    <span className="text-emerald-400 font-bold">ASSERTION_VERIFIED ✓</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500">Algorithm: </span>
                      <span className="text-emerald-300">{selectedPacket.cryptoProof.algorithm}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Signer Key ID: </span>
                      <span className="text-slate-200">{selectedPacket.cryptoProof.keyId}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">Signature: </span>
                      <span className="text-slate-400">{selectedPacket.cryptoProof.signature}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">Digest Hash: </span>
                      <span className="text-slate-400">{selectedPacket.cryptoProof.digest}</span>
                    </div>
                    {selectedPacket.cryptoProof.disclosedClaims && (
                      <div>
                        <span className="text-slate-500">SD-JWT Disclosed Claims: </span>
                        <span className="text-amber-300 font-bold">
                          {selectedPacket.cryptoProof.disclosedClaims.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Formatted JSON Payload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                  <span>Raw JSON-RPC / Mandate Payload</span>
                  <span className="text-slate-500">APPLICATION/JSON-RPC+JSON</span>
                </div>
                <pre className="p-4 bg-[#060913] border border-[#1e293b] rounded-t-lg rounded-br-lg rounded-bl-none text-slate-200 overflow-x-auto text-[11px] leading-relaxed select-all">
                  {JSON.stringify(selectedPacket.payload, null, 2)}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#0c1222] border-t border-[#1e293b] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Press ESC or click backdrop to close</span>
              <button
                onClick={() => setSelectedPacket(null)}
                className="cymbal-btn-primary px-4 py-1 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
