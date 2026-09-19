import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanHistoryItem } from '../types';
import { History, Search, Trash2, ArrowUpRight, ShieldAlert, ShieldCheck, Filter, PlusCircle, Download, FileCode, FileSpreadsheet, ChevronDown, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface ThreatHistorySectionProps {
  history: ScanHistoryItem[];
  onSelect: (item: ScanHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onNewScan: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
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
      damping: 24,
      mass: 0.8
    }
  }
};

export const ThreatHistorySection: React.FC<ThreatHistorySectionProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  onNewScan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'FRAUD' | 'SAFE'>('ALL');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExport = (format: 'JSON' | 'CSV') => {
    if (history.length === 0) return;
    triggerHaptic('success');
    setShowExportMenu(false);

    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    if (format === 'JSON') {
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalRecords: history.length,
        system: 'ScamShield CyberLab',
        scanLogs: history.map(item => ({
          id: item.id,
          timestamp: item.timestamp,
          isoDate: new Date(item.timestamp).toISOString(),
          scannerMode: item.scannerMode,
          verdict: item.result.verdictLabel,
          isFraud: item.result.isFraud,
          riskLevel: item.result.riskLevel,
          riskScore: item.result.estimatedRiskScore,
          category: item.result.category,
          summary: item.result.summary,
          recommendedAction: item.result.recommendedAction,
          redFlags: item.result.redFlags,
          detectedUrls: item.result.detectedUrls,
          messageSnippet: item.messageSnippet,
          fullMessage: item.fullMessage
        }))
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `scamshield_scan_logs_${timestampStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportNotice(`Exported ${history.length} log(s) to JSON`);
      setTimeout(() => setExportNotice(null), 3000);
    } else {
      const headers = [
        'Scan ID',
        'Timestamp',
        'Date Time',
        'Vector Channel',
        'Verdict',
        'Fraud Flag',
        'Risk Level',
        'Risk Score',
        'Threat Category',
        'Executive Summary',
        'Recommended Action',
        'Red Flags',
        'Extracted URLs',
        'Full Message'
      ];

      const escapeCsv = (val: unknown) => {
        if (val === undefined || val === null) return '""';
        const str = Array.isArray(val) ? val.join('; ') : String(val);
        return `"${str.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
      };

      const rows = history.map(item => [
        escapeCsv(item.id),
        escapeCsv(item.timestamp),
        escapeCsv(new Date(item.timestamp).toLocaleString()),
        escapeCsv(item.scannerMode),
        escapeCsv(item.result.verdictLabel),
        escapeCsv(item.result.isFraud ? 'YES' : 'NO'),
        escapeCsv(item.result.riskLevel),
        escapeCsv(item.result.estimatedRiskScore),
        escapeCsv(item.result.category),
        escapeCsv(item.result.summary),
        escapeCsv(item.result.recommendedAction),
        escapeCsv(item.result.redFlags),
        escapeCsv(item.result.detectedUrls),
        escapeCsv(item.fullMessage)
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      downloadAnchor.setAttribute('download', `scamshield_scan_logs_${timestampStr}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);

      setExportNotice(`Exported ${history.length} log(s) to CSV`);
      setTimeout(() => setExportNotice(null), 3000);
    }
  };

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
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 mb-6"
    >
      {/* 1. Metrics Overview Cards Grid: Staggered Entrance as User Scrolls In */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <motion.div
          variants={itemVariants}
          className="bg-[#FFFFFF] border border-[#D7D7D7] p-4 rounded-2xl shadow-xs"
        >
          <div className="text-xs font-semibold text-[#767676]">Total Scans</div>
          <div className="text-2xl font-black text-[#0E0E0E] mt-0.5">{totalScans}</div>
          <div className="text-[11px] text-[#767676] mt-0.5">All monitored vectors</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#FFFFFF] border border-[#D7D7D7] p-4 rounded-2xl shadow-xs"
        >
          <div className="text-xs font-semibold text-[#767676]">Threats Detected</div>
          <div className="text-2xl font-black text-[#D32F2F] mt-0.5">{fraudCount}</div>
          <div className="text-[11px] text-[#D32F2F] mt-0.5">Flagged suspicious</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#FFFFFF] border border-[#D7D7D7] p-4 rounded-2xl shadow-xs"
        >
          <div className="text-xs font-semibold text-[#767676]">Verified Clean</div>
          <div className="text-2xl font-black text-[#1B8A44] mt-0.5">{safeCount}</div>
          <div className="text-[11px] text-[#1B8A44] mt-0.5">Cleared baseline</div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[#FFFFFF] border border-[#D7D7D7] p-4 rounded-2xl shadow-xs"
        >
          <div className="text-xs font-semibold text-[#767676]">Average Risk Index</div>
          <div className="text-2xl font-black text-[#EC783B] mt-0.5">{avgRisk}%</div>
          <div className="text-[11px] text-[#767676] mt-0.5">Score index average</div>
        </motion.div>
      </motion.div>

      {/* 2. History List Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.3 }}
        className="bg-[#FFFFFF] border border-[#D7D7D7] rounded-2xl p-5 sm:p-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ECECEC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0E0E0E] flex items-center justify-center text-white">
              <History className="w-4 h-4 text-[#EC783B]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#0E0E0E]">
                Threat Log Archive
              </h3>
              <p className="text-xs text-[#767676]">
                Review verified incident evaluations and risk signatures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Export Logs Dropdown Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic('light');
                  setShowExportMenu(prev => !prev);
                }}
                disabled={history.length === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                  history.length === 0
                    ? 'bg-[#F6F6F6] text-[#A0A0A0] border-[#D7D7D7] cursor-not-allowed'
                    : 'bg-[#FFFFFF] hover:bg-[#F6F6F6] text-[#0E0E0E] border-[#D7D7D7] shadow-xs'
                }`}
                title="Export scan logs as JSON or CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#EC783B]" />
                <span>Export Logs</span>
                <ChevronDown className="w-3 h-3 text-[#767676]" />
              </motion.button>

              <AnimatePresence>
                {showExportMenu && history.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-52 bg-[#FFFFFF] border border-[#D7D7D7] rounded-xl shadow-lg p-1.5 z-30"
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-[#767676] uppercase border-b border-[#ECECEC] mb-1">
                      Choose Export Format ({history.length} logs)
                    </div>
                    <button
                      type="button"
                      onClick={() => handleExport('JSON')}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0E0E0E] hover:bg-[#F6F6F6] hover:text-[#EC783B] transition-colors text-left cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5 text-[#EC783B]" />
                      <div className="flex flex-col">
                        <span>Export as JSON</span>
                        <span className="text-[10px] text-[#767676]">Structured machine format</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport('CSV')}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0E0E0E] hover:bg-[#F6F6F6] hover:text-[#1B8A44] transition-colors text-left cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#1B8A44]" />
                      <div className="flex flex-col">
                        <span>Export as CSV</span>
                        <span className="text-[10px] text-[#767676]">Spreadsheet review file</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerHaptic('light');
                onNewScan();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EC783B] hover:bg-[#D9662B] text-black font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Scan</span>
            </motion.button>

            {history.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic('warning');
                  onClearAll();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6F6F6] hover:bg-[#FDEAEA] text-[#767676] hover:text-[#D32F2F] font-bold text-xs border border-[#D7D7D7] hover:border-[#F5AAAA] transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Archive</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Export Success Feedback Notification */}
        <AnimatePresence>
          {exportNotice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2.5 p-2 px-3 rounded-xl bg-[#E9F5ED] border border-[#A5D8B4] text-[#1B8A44] text-xs font-semibold flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5 text-[#1B8A44]" />
              <span>{exportNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 border-b border-[#ECECEC]">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#767676] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search past logs or categories..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F6F6F6] border border-[#D7D7D7] text-xs font-medium focus:outline-none focus:border-[#EC783B]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F6F6F6] p-1 rounded-xl border border-[#D7D7D7] w-full sm:w-auto">
            {(['ALL', 'FRAUD', 'SAFE'] as const).map(type => (
              <button
                key={type}
                onClick={() => {
                  triggerHaptic('light');
                  setFilterType(type);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-[#FFFFFF] text-[#0E0E0E] shadow-2xs border border-[#D7D7D7]'
                    : 'text-[#767676] hover:text-[#0E0E0E]'
                }`}
              >
                {type === 'ALL' ? 'All Logs' : type === 'FRAUD' ? 'Threats' : 'Verified'}
              </button>
            ))}
          </div>
        </div>

        {/* Items List (Staggered Children) */}
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <History className="w-8 h-8 text-[#BEBEBE] mx-auto" />
            <div className="text-xs font-bold text-[#767676]">No threat records found</div>
            <p className="text-[11px] text-[#9E9E9E] max-w-xs mx-auto">
              Run a scan on an SMS, email, or suspicious link to build your threat log.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-[#ECECEC] mt-1"
          >
            {filteredItems.map(item => {
              const isFraud = item.result.isFraud;

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: '#F9F9F9' }}
                  className="py-3 sm:py-3.5 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl transition-colors group cursor-pointer"
                  onClick={() => {
                    triggerHaptic('light');
                    onSelect(item);
                  }}
                >
                  <div className="flex items-start gap-3 overflow-hidden max-w-xl">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isFraud
                          ? 'bg-[#FDEAEA] text-[#D32F2F] border border-[#F5AAAA]'
                          : 'bg-[#E9F5ED] text-[#1B8A44] border border-[#A5D8B4]'
                      }`}
                    >
                      {isFraud ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            isFraud
                              ? 'bg-[#D32F2F] text-white'
                              : 'bg-[#1B8A44] text-white'
                          }`}
                        >
                          {item.result.verdictLabel}
                        </span>
                        <span className="text-[11px] font-bold text-[#0E0E0E]">
                          {item.result.category}
                        </span>
                        <span className="text-[10px] text-[#767676]">
                          • {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A4A4A] truncate max-w-md sm:max-w-lg">
                        {item.messageSnippet}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-extrabold text-[#0E0E0E] bg-[#ECECEC] px-2 py-1 rounded-lg">
                      {item.result.estimatedRiskScore}%
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={e => {
                        e.stopPropagation();
                        triggerHaptic('light');
                        onDelete(item.id);
                      }}
                      className="p-1.5 rounded-lg text-[#767676] hover:text-[#D32F2F] hover:bg-[#FDEAEA] transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
