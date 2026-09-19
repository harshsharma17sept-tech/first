import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ScamAnalysisResult } from '../types';
import { Network, ArrowRight, ShieldAlert, Cpu, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface AttackGraphProps {
  result: ScamAnalysisResult;
}

interface GraphNode {
  id: string;
  stageNumber: number;
  stageName: string;
  title: string;
  category: string;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  details: string;
  signals: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 420,
      damping: 22,
      mass: 0.8
    }
  }
};

export const AttackGraph: React.FC<AttackGraphProps> = ({ result }) => {
  const nodes: GraphNode[] = [
    {
      id: 'vector',
      stageNumber: 1,
      stageName: 'Stage 1',
      title: 'Inbound Vector',
      category: 'Infiltration Channel',
      status: result.isFraud ? 'HIGH' : 'LOW',
      details: 'Initial communication channel used to deliver the unsolicited message.',
      signals: [
        result.detectedUrls.length > 0 ? `${result.detectedUrls.length} links parsed` : 'Direct textual transmission',
        'Unsolicited push mechanism'
      ]
    },
    {
      id: 'pretext',
      stageNumber: 2,
      stageName: 'Stage 2',
      title: 'Pretext & Actor Identity',
      category: 'Social Engineering',
      status: result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH' ? 'CRITICAL' : 'MEDIUM',
      details: `Impersonation disguised under: ${result.category}.`,
      signals: [
        result.category,
        result.redFlags[0] || 'Behavioral mimicry'
      ]
    },
    {
      id: 'exploit',
      stageNumber: 3,
      stageName: 'Stage 3',
      title: 'Exploit Technique',
      category: 'Tactical Manipulation',
      status: result.riskLevel,
      details: 'Psychological urgency triggers and evasive redirection tactics.',
      signals: [
        result.redFlags[1] || 'Urgency / coercion trigger',
        result.detectedUrls.some(u => u.suspicious) ? 'Domain obfuscation' : 'Direct request'
      ]
    },
    {
      id: 'objective',
      stageNumber: 4,
      stageName: 'Stage 4',
      title: 'Adversary Objective',
      category: 'Impact & Target',
      status: result.isFraud ? 'CRITICAL' : 'LOW',
      details: result.isFraud
        ? 'Extraction of credentials, 2FA codes, or monetary transfer.'
        : 'Informational interaction with zero unauthorized impact.',
      signals: [
        result.isFraud ? 'Account takeover risk' : 'Benign interaction verified',
        result.recommendedAction
      ]
    }
  ];

  const [selectedNodeId, setSelectedNodeId] = useState<string>('vector');
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const getStatusBadge = (status: GraphNode['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-[#FDEAEA] text-[#D32F2F] border border-[#F5AAAA]';
      case 'HIGH':
        return 'bg-[#FDEEE6] text-[#D9662B] border border-[#F6AB83]';
      case 'MEDIUM':
        return 'bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]';
      case 'LOW':
      default:
        return 'bg-[#E9F5ED] text-[#1B8A44] border border-[#A5D8B4]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mb-6"
    >
      <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-2xl p-5 sm:p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#ECECEC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0E0E0E] flex items-center justify-center text-white shrink-0">
              <Network className="w-4 h-4 text-[#EC783B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0E0E0E]">
                Attack Vector & Topology Graph
              </h3>
              <p className="text-xs text-[#767676]">
                Select any stage to inspect specific attack mechanics and signals
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-lg bg-[#ECECEC] font-bold text-[#1B1B1B]">
            {result.category}
          </span>
        </div>

        {/* 4-Stage Horizontal Graph Flow: Staggered Entrance as user scrolls into view */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-5"
        >
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <motion.div
                key={node.id}
                variants={itemVariants}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedNodeId(node.id);
                }}
                className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-[#F6F6F6] border-[#EC783B] shadow-md ring-1 ring-[#EC783B]/20'
                    : 'bg-[#FFFFFF] border-[#D7D7D7] hover:border-[#BEBEBE] hover:bg-[#FAFAFA]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#767676]">{node.stageName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(node.status)}`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-[#0E0E0E] mb-0.5">
                    {node.title}
                  </div>
                  <div className="text-[11px] text-[#767676] font-medium mb-2">
                    {node.category}
                  </div>

                  <p className="text-xs text-[#4A4A4A] line-clamp-2 leading-relaxed">
                    {node.details}
                  </p>
                </div>

                {/* Flow indicator arrow for larger screens */}
                {index < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#FFFFFF] p-0.5 rounded-full border border-[#BEBEBE] text-[#767676]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Selected Stage Detail Drawer */}
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-[#F6F6F6] border border-[#D7D7D7] rounded-xl p-4 sm:p-5 mt-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#EC783B]">
                {activeNode.stageName}:
              </span>
              <span className="text-sm font-bold text-[#0E0E0E]">
                {activeNode.title}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(activeNode.status)}`}>
                {activeNode.status}
              </span>
            </div>
            <span className="text-xs text-[#767676]">
              Sub-Vector Analysis
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#1B1B1B] leading-relaxed mb-3">
            {activeNode.details}
          </p>

          <div className="border-t border-[#D7D7D7] pt-3">
            <div className="text-[11px] font-bold text-[#767676] uppercase tracking-wider mb-2">
              Extracted Threat Signals & Tactics:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeNode.signals.map((signal, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center gap-2 text-xs bg-[#FFFFFF] border border-[#D7D7D7] p-2.5 rounded-lg text-[#1B1B1B]"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-[#EC783B] shrink-0" />
                  <span className="font-medium truncate">{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
