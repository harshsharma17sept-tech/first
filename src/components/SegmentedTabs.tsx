import React from 'react';
import { AnalysisTab } from '../types';
import { LayoutDashboard, Network, GitFork, History } from 'lucide-react';

interface SegmentedTabsProps {
  activeTab: AnalysisTab;
  historyCount: number;
  onTabChange: (tab: AnalysisTab) => void;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  activeTab,
  historyCount,
  onTabChange
}) => {
  const tabs: { id: AnalysisTab; label: string; code: string; icon: React.ReactNode }[] = [
    { id: 'OVERVIEW', label: 'OVERVIEW', code: '01', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'GRAPH', label: 'ATTACK GRAPH', code: '02', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'TIMELINE', label: 'KILL-CHAIN', code: '03', icon: <GitFork className="w-3.5 h-3.5" /> },
    { id: 'HISTORY', label: 'THREAT LOGS', code: '04', icon: <History className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="w-full bg-[#ECECEC] p-1 rounded-xl border border-[#D7D7D7] mb-4 grid grid-cols-2 sm:grid-cols-4 gap-1">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-mono text-xs font-bold transition-all ${
              isActive
                ? 'bg-[#FFFFFF] text-[#0E0E0E] shadow-xs border border-[#D7D7D7]'
                : 'text-[#4A4A4A] hover:text-[#0E0E0E] hover:bg-[#E4E4E4]'
            }`}
          >
            <span className="text-[#EC783B]">{tab.icon}</span>
            <span className="hidden xs:inline text-[10px] text-[#767676]">[{tab.code}]</span>
            <span className="truncate">{tab.label}</span>
            {tab.id === 'HISTORY' && historyCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-[#EC783B] text-black font-extrabold' : 'bg-[#D7D7D7] text-[#1B1B1B]'
              }`}>
                {historyCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
