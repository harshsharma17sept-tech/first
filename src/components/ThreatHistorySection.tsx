import React, { useState } from 'react';
import { ScanHistoryItem } from '../types';
import { History, Search, Trash2, ArrowUpRight, ShieldAlert, ShieldCheck, Filter, PlusCircle } from 'lucide-react';

interface ThreatHistorySectionProps {
  history: ScanHistoryItem[];
  onSelect: (item: ScanHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onNewScan: () => void;
}

export const ThreatHistorySection: React.FC<ThreatHistorySectionProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  onNewScan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'FRAUD' | 'SAFE'>('ALL');

  // Compute metrics
  const totalScans = history.length;
  const fraudCount = history.filter(h => h.result.isFraud).length;
  const safeCount = history.filter(h => !h.result.isFraud).length;
  const avgRisk = totalScans > 0
    ? Math.round(history.reduce((acc, h) => acc + h.result.estimatedRiskScore, 0) / totalScans)
    : 0;

  // Filter items
  const filteredItems = history.filter(item => {
    const matchesSearch = item.messageSnippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.summary.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'FRAUD') return item.result.isFraud;
    if (filterType === 'SAFE') return !item.result.isFraud;
    return true;
  });

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4 mb-6 animate-in fade-in duration-300">
      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-[#FFFFFF] border border-[#D7D7D7] p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-[#767676] uppercase">TOTAL LOGGED</div>
          <div className="text-xl font-black text-[#0E0E0E] mt-0.5">{totalScans}</div>
          <div className="text-[10px] font-mono text-[#767676]">All vectors</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D7D7D7] p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-[#767676] uppercase">FRAUD INTERCEPTED</div>
          <div className="text-xl font-black text-[#D32F2F] mt-0.5">{fraudCount}</div>
          <div className="text-[10px] font-mono text-[#D32F2F]">Critical / High</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D7D7D7] p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-[#767676] uppercase">CLEAN VERIFIED</div>
          <div className="text-xl font-black text-[#1B8A44] mt-0.5">{safeCount}</div>
          <div className="text-[10px] font-mono text-[#1B8A44]">Cleared baseline</div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D7D7D7] p-3.5 rounded-xl">
          <div className="text-[10px] font-mono text-[#767676] uppercase">AVG THREAT INDEX</div>
          <div className="text-xl font-black text-[#EC783B] mt-0.5">{avgRisk}%</div>
          <div className="text-[10px] font-mono text-[#767676]">Weighted score</div>
        </div>
      </div>

      {/* Surveillance History Card */}
      <div className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D7D7D7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FDEEE6] flex items-center justify-center">
              <History className="w-4 h-4 text-[#EC783B]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#0E0E0E]">THREAT LOG ARCHIVE</h3>
              <p className="text-[11px] text-[#767676] font-mono">
                LOCAL SANDBOX SURVEILLANCE AUDIT TRAIL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewScan}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EC783B] hover:bg-[#D9662B] text-black font-mono text-xs font-extrabold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>NEW SCAN</span>
            </button>

            {history.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] border border-[#D7D7D7] font-mono text-xs text-[#767676] hover:text-[#D32F2F] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR ALL</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#767676] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search threat logs, category, text..."
              className="w-full bg-[#F6F6F6] border border-[#D7D7D7] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-[#0E0E0E] focus:outline-none focus:border-[#EC783B]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#ECECEC] p-1 rounded-lg border border-[#D7D7D7] w-full sm:w-auto">
            {(['ALL', 'FRAUD', 'SAFE'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-md font-mono text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-[#FFFFFF] text-[#0E0E0E] shadow-xs'
                    : 'text-[#767676] hover:text-[#0E0E0E]'
                }`}
              >
                {type === 'ALL' ? 'ALL SCANS' : type === 'FRAUD' ? 'FRAUD ONLY' : 'SAFE ONLY'}
              </button>
            ))}
          </div>
        </div>

        {/* History Items List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 px-4 bg-[#F6F6F6] border border-dashed border-[#D7D7D7] rounded-xl">
            <History className="w-8 h-8 text-[#9A9A9A] mx-auto mb-2" />
            <div className="font-extrabold text-sm text-[#0E0E0E]">NO THREAT LOGS RECORDED</div>
            <p className="text-xs text-[#767676] font-mono mt-1 max-w-sm mx-auto">
              Scan a suspicious SMS, email, or link, or launch a scenario preset from the scanner workstation above.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group p-3.5 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7] hover:border-[#BEBEBE] hover:bg-[#FFFFFF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div
                  onClick={() => onSelect(item)}
                  className="cursor-pointer flex-1 space-y-1"
                >
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-[#ECECEC] text-[#1B1B1B] font-bold text-[10px]">
                      {item.scannerMode}
                    </span>
                    <span className="text-[#767676] text-[10px]">
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <span className="text-[#767676]">•</span>
                    <span className="font-bold text-[#0E0E0E] text-[11px]">
                      {item.result.category}
                    </span>
                  </div>

                  <p className="text-xs text-[#4A4A4A] line-clamp-1 font-mono">
                    "{item.messageSnippet}"
                  </p>
                </div>

                <div className="flex items-center gap-2 justify-between sm:justify-end shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-xs font-black px-2.5 py-1 rounded-md ${
                      item.result.isFraud
                        ? 'bg-[#FDEAEA] text-[#D32F2F] border border-[#F5AAAA]'
                        : 'bg-[#E9F5ED] text-[#1B8A44] border border-[#A5D8B4]'
                    }`}
                  >
                    {item.result.isFraud ? (
                      <ShieldAlert className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    <span>{item.result.riskPercentageString}</span>
                  </span>

                  <button
                    onClick={() => onSelect(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ECECEC] hover:bg-[#E4E4E4] font-mono text-xs font-bold text-[#1B1B1B] transition-colors"
                    title="Inspect in Overview"
                  >
                    <span>INSPECT</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 rounded-lg text-[#9A9A9A] hover:text-[#D32F2F] hover:bg-[#FDEAEA] transition-colors"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
