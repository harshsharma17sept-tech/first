import React from 'react';
import { AnalysisTab } from '../types';
import { DashboardNav } from './DashboardNav';

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
  return (
    <DashboardNav
      activeTab={activeTab}
      historyCount={historyCount}
      onTabChange={onTabChange}
    />
  );
};
