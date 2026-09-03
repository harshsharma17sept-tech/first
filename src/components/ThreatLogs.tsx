import React, { useState } from 'react';
import { ScamAnalysisResult, RiskLevel } from '../types';
import { History, ShieldAlert, ShieldCheck, Trash2, ArrowUpRight, Search } from 'lucide-react';

interface ThreatLogsProps {
  history: ScamAnalysisResult[];
  onSelectResult: (item: ScamAnalysisResult) => void;
  onClearHistory: () => void;
  onScanPrompt: () => void;
}

export const ThreatLogs: React.FC<ThreatLogsProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onScanPrompt
}) => {
  const [filter, setFilter] = useState<'all' | 'fraud' | 'safe'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const totalScans = history.length;
  const fraudCount = history.filter(h => h.isFraud).length;
  const safeCount = history.filter(h => !h.isFraud).length;
  const avgScore = totalScans > 0
    ? Math.round(history.reduce((sum, h) => sum + h.estimatedRiskScore, 0) / totalScans)
    : 0;

  const filteredHistory = history.filter(item => {
    if (filter === 'fraud' && !item.isFraud) return false;
    if (filter === 'safe' && item.isFraud) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.rawText.toLowerCase().includes(q) ||
        item.verdictLabel.toLowerCase().includes(q) ||
        item.detectedCategories.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return { bg: '#FDEAEA', border: '#F5B7B1', text: '#D32F2F' };
      case 'MEDIUM':
        return { bg: '#FFF3E0', border: '#FFE0B2', text: '#E65100' };
      default:
        return { bg: '#E9F5ED', border: '#A3E4D7', text: '#1B8A44' };
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#1B1B1B] p-5 rounded-sm mb-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#D7D7D7]">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-[#EC783B]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#0E0E0E]">
            THREAT LOGS & SURVEILLANCE HISTORY
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-2.5 py-1 bg-[#F6F6F6] hover:bg-[#E4E4E4] border border-[#D7D7D7] text-[#D32F2F] text-xs font-mono rounded-sm transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR LOGS</span>
          </button>
        )}
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-[#F6F6F6] border border-[#D7D7D7] p-3 rounded-sm">
          <div className="text-[10px] font-mono text-[#767676] mb-1">TOTAL SCANS</div>
          <div className="text-xl font-bold font-mono text-[#0E0E0E]">{totalScans}</div>
        </div>

        <div className="bg-[#F6F6F6] border border-[#D7D7D7] p-3 rounded-sm">
          <div className="text-[10px] font-mono text-[#767676] mb-1">FRAUD BLOCKED</div>
          <div className="text-xl font-bold font-mono text-[#D32F2F]">{fraudCount}</div>
        </div>

        <div className="bg-[#F6F6F6] border border-[#D7D7D7] p-3 rounded-sm">
          <div className="text-[10px] font-mono text-[#767676] mb-1">CLEAN VERIFIED</div>
          <div className="text-xl font-bold font-mono text-[#1B8A44]">{safeCount}</div>
        </div>

        <div className="bg-[#F6F6F6] border border-[#D7D7D7] p-3 rounded-sm">
          <div className="text-[10px] font-mono text-[#767676] mb-1">AVG RISK INDEX</div>
          <div className="text-xl font-bold font-mono text-[#EC783B]">{avgScore}%</div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Filters */}
        <div className="flex items-center bg-[#F6F6F6] p-1 border border-[#D7D7D7] rounded-sm text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 font-bold rounded-sm ${
              filter === 'all' ? 'bg-[#0E0E0E] text-white' : 'text-[#767676] hover:text-[#0E0E0E]'
            }`}
          >
            ALL ({totalScans})
          </button>
          <button
            onClick={() => setFilter('fraud')}
            className={`px-3 py-1 font-bold rounded-sm ${
              filter === 'fraud' ? 'bg-[#D32F2F] text-white' : 'text-[#767676] hover:text-[#0E0E0E]'
            }`}
          >
            FRAUD ONLY ({fraudCount})
          </button>
          <button
            onClick={() => setFilter('safe')}
            className={`px-3 py-1 font-bold rounded-sm ${
              filter === 'safe' ? 'bg-[#1B8A44] text-white' : 'text-[#767676] hover:text-[#0E0E0E]'
            }`}
          >
            SAFE ONLY ({safeCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#767676]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Filter by keyword..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#F6F6F6] border border-[#D7D7D7] rounded-sm text-xs font-mono text-[#0E0E0E] focus:outline-none focus:border-[#1B1B1B]"
          />
        </div>
      </div>

      {/* List */}
      {filteredHistory.length === 0 ? (
        <div className="p-8 text-center bg-[#F6F6F6] border border-[#D7D7D7] rounded-sm text-xs font-mono text-[#767676]">
          No surveillance records found matching current query.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHistory.map(item => {
            const riskColor = getRiskColor(item.riskLevel);
            return (
              <div
                key={item.id}
                onClick={() => onSelectResult(item)}
                className="bg-[#F6F6F6] hover:bg-[#FDF4EE] border border-[#D7D7D7] hover:border-[#1B1B1B] p-3.5 rounded-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-sm border"
                      style={{
                        backgroundColor: riskColor.bg,
                        borderColor: riskColor.border,
                        color: riskColor.text
                      }}
                    >
                      {item.verdictLabel.split('//')[0].trim()}
                    </span>
                    <span className="text-[11px] font-mono text-[#767676]">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#E4E4E4] text-[#0E0E0E] text-[10px] font-mono uppercase rounded-sm">
                      {item.mode}
                    </span>
                  </div>

                  <p className="text-xs text-[#0E0E0E] font-mono truncate">
                    {item.rawText}
                  </p>

                  {item.detectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {item.detectedCategories.slice(0, 3).map((cat, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono bg-[#FFFFFF] border border-[#D7D7D7] px-1.5 py-0.2 text-[#767676] rounded-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0 self-end sm:self-center">
                  <div className="text-right font-mono">
                    <div className="text-base font-bold" style={{ color: riskColor.text }}>
                      {item.estimatedRiskScore}%
                    </div>
                  </div>
                  <div className="p-1.5 bg-white border border-[#D7D7D7] rounded-sm text-[#0E0E0E]">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
