import React, { useState } from 'react';
import { ScamAnalysisResult } from '../types';
import { Network, ArrowRight, ShieldAlert, Cpu, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface AttackGraphProps {
  result: ScamAnalysisResult;
}

interface GraphNode {
  id: string;
  stage: string;
  title: string;
  category: string;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  details: string;
  signals: string[];
}

export const AttackGraph: React.FC<AttackGraphProps> = ({ result }) => {
  // Derive graph nodes dynamically based on result
  const nodes: GraphNode[] = [
    {
      id: 'vector',
      stage: 'STAGE 01',
      title: 'Inbound Vector',
      category: 'INFILTRATION CHANNEL',
      status: result.isFraud ? 'HIGH' : 'LOW',
      details: 'Initial transmission vector used to breach user perimeter.',
      signals: [
        result.detectedUrls.length > 0 ? `${result.detectedUrls.length} links parsed` : 'Direct textual transmission',
        'Unsolicited push mechanism'
      ]
    },
    {
      id: 'pretext',
      stage: 'STAGE 02',
      title: 'Pretext & Actor',
      category: 'SOCIAL ENGINEERING',
      status: result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH' ? 'CRITICAL' : 'MEDIUM',
      details: `Impersonation disguise: ${result.category}.`,
      signals: [
        result.category,
        result.redFlags[0] || 'Behavioral mimicry'
      ]
    },
    {
      id: 'exploit',
      stage: 'STAGE 03',
      title: 'Exploit Technique',
      category: 'TACTICAL MANIPULATION',
      status: result.riskLevel,
      details: 'Psychological pressure and evasive redirection tactics.',
      signals: [
        result.redFlags[1] || 'Urgency / coercion trigger',
        result.detectedUrls.some(u => u.suspicious) ? 'Domain obfuscation' : 'Direct request'
      ]
    },
    {
      id: 'objective',
      stage: 'STAGE 04',
      title: 'Objective Target',
      category: 'ADVERSARY PAYLOAD',
      status: result.isFraud ? 'CRITICAL' : 'LOW',
      details: result.isFraud
        ? 'Account takeover, OTP capture, or irreversible fund transfer.'
        : 'Informational exchange without observable exfiltration target.',
      signals: [
        result.isFraud ? 'Exfiltration of credentials' : 'No credential capture',
        result.recommendedAction
      ]
    }
  ];

  const [selectedNodeId, setSelectedNodeId] = useState<string>('pretext');
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const getStatusBadge = (status: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-[#D32F2F] text-white';
      case 'HIGH':
        return 'bg-[#EC783B] text-black font-extrabold';
      case 'MEDIUM':
        return 'bg-[#D97706] text-white';
      case 'LOW':
        return 'bg-[#1B8A44] text-white';
    }
  };

  return (
    <div className="space-y-4 mb-6 animate-in fade-in duration-300">
      <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D7D7D7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FDEEE6] flex items-center justify-center">
              <Network className="w-4 h-4 text-[#EC783B]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0E0E0E]">ATTACK CORRELATION GRAPH</h3>
              <p className="text-[11px] text-[#767676] font-mono">
                INTERACTIVE TOPOLOGY // CLICK NODES TO INSPECT SPECIFIC ATTACK TACTICS
              </p>
            </div>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#ECECEC] font-bold text-[#1B1B1B]">
            {result.category.toUpperCase()}
          </span>
        </div>

        {/* 4-Stage Horizontal Graph Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-5">
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-[#F6F6F6] border-[#EC783B] shadow-md -translate-y-0.5'
                    : 'bg-[#FFFFFF] border-[#D7D7D7] hover:border-[#BEBEBE] hover:bg-[#FBFBFB]'
                }`}
              >
                <div className="flex items-center justify-between mb-2 font-mono text-[10px]">
                  <span className="text-[#767676] font-bold">{node.stage}</span>
                  <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-extrabold ${getStatusBadge(node.status)}`}>
                    {node.status}
                  </span>
                </div>

                <div className="font-extrabold text-xs sm:text-sm text-[#0E0E0E] mb-1">
                  {node.title}
                </div>
                <div className="text-[10px] font-mono text-[#767676] uppercase tracking-wider mb-2">
                  {node.category}
                </div>

                <p className="text-[11px] text-[#4A4A4A] line-clamp-2 leading-relaxed">
                  {node.details}
                </p>

                {/* Flow indicator arrow for larger screens */}
                {index < nodes.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 bg-[#FFFFFF] border border-[#D7D7D7] rounded-full p-0.5 shadow-xs">
                    <ArrowRight className="w-3 h-3 text-[#767676]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Inspection Card */}
        <div className="p-4 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ECECEC]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#EC783B]">
                [{activeNode.stage}]
              </span>
              <span className="font-extrabold text-sm text-[#0E0E0E]">
                {activeNode.title} // DEEP INSPECTION
              </span>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-bold ${getStatusBadge(activeNode.status)}`}>
              SEVERITY: {activeNode.status}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#1B1B1B] my-3 leading-relaxed">
            {activeNode.details}
          </p>

          <div className="space-y-1.5">
            <div className="font-mono text-[10px] text-[#767676] uppercase tracking-wider">
              CORRELATED TELEMETRY SIGNALS:
            </div>
            <div className="flex flex-wrap gap-2">
              {activeNode.signals.map((sig, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#D7D7D7] text-xs font-mono text-[#1B1B1B]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EC783B]"></span>
                  <span>{sig}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
