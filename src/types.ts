export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface UrlAnalysis {
  url: string;
  suspicious: boolean;
  reason: string;
}

export interface HeuristicDetection {
  triggerName: string;
  description: string;
  severityPoints: number;
}

export interface ScamAnalysisResult {
  riskLevel: RiskLevel;
  estimatedRiskScore: number; // 0 - 100
  category: string;
  summary: string;
  redFlags: string[];
  recommendedAction: string;
  detectedUrls: UrlAnalysis[];
  heuristicSignals: string[];
  isFraud: boolean;
  riskPercentageString: string;
  verdictLabel: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  messageSnippet: string;
  fullMessage: string;
  scannerMode: 'SMS' | 'URL' | 'EMAIL';
  result: ScamAnalysisResult;
}

export type AnalysisTab = 'OVERVIEW' | 'GRAPH' | 'TIMELINE' | 'HISTORY';

export type HeuristicStrictness = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AttackPreset {
  title: string;
  tag: string;
  mode: 'SMS' | 'URL' | 'EMAIL';
  content: string;
}
