import React, { useState, useEffect } from 'react';
import { AnalysisTab, AttackPreset, ScamAnalysisResult, ScanHistoryItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SegmentedTabs } from './components/SegmentedTabs';
import { ScannerWorkstation, PRESET_ATTACKS } from './components/ScannerWorkstation';
import { ResultOverview } from './components/ResultOverview';
import { AttackGraph } from './components/AttackGraph';
import { TimelineSection } from './components/TimelineSection';
import { ThreatHistorySection } from './components/ThreatHistorySection';
import { MaxShieldModal } from './components/MaxShieldModal';
import { HeuristicEngine } from './engine/HeuristicEngine';
import { AlertCircle, Terminal, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'scamshield_history_v1';
const STORAGE_KEY_PRO = 'scamshield_pro_v1';

export const App: React.FC = () => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [scannerMode, setScannerMode] = useState<'SMS' | 'URL' | 'EMAIL'>('SMS');
  const [activeTab, setActiveTab] = useState<AnalysisTab>('OVERVIEW');
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_PRO) === 'true';
  });

  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    // Default sample fixtures for immediate cybersecurity lab experience
    const initialPreset = PRESET_ATTACKS[0];
    const initialResult = HeuristicEngine.analyzeLocally(initialPreset.content);
    return [
      {
        id: 'seed-01',
        timestamp: Date.now() - 3600000,
        messageSnippet: initialPreset.content.substring(0, 90) + '...',
        fullMessage: initialPreset.content,
        scannerMode: 'SMS',
        result: initialResult
      }
    ];
  });

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Initial load of first preset to showcase workstation immediately
  useEffect(() => {
    if (!analysisResult && history.length > 0) {
      setAnalysisResult(history[0].result);
      setMessageInput(history[0].fullMessage);
      setScannerMode(history[0].scannerMode);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAnalyze = async () => {
    if (!messageInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Call secure backend API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageInput.trim(),
          scannerMode
        })
      });

      let result: ScamAnalysisResult;

      if (response.ok) {
        result = await response.json();
      } else {
        // Fallback to local heuristic engine
        console.warn('Backend API error, running local heuristic engine fallback');
        result = HeuristicEngine.analyzeLocally(messageInput.trim());
      }

      setAnalysisResult(result);

      // Add to history
      const newHistoryItem: ScanHistoryItem = {
        id: `scan-${Date.now()}`,
        timestamp: Date.now(),
        messageSnippet: messageInput.trim().substring(0, 95) + (messageInput.length > 95 ? '...' : ''),
        fullMessage: messageInput.trim(),
        scannerMode,
        result
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      setActiveTab('OVERVIEW');
      showToast('Threat assessment completed.');
    } catch (err: any) {
      console.warn('Network error, executing offline heuristic analysis:', err);
      try {
        const fallbackResult = HeuristicEngine.analyzeLocally(messageInput.trim());
        setAnalysisResult(fallbackResult);
        const newHistoryItem: ScanHistoryItem = {
          id: `scan-${Date.now()}`,
          timestamp: Date.now(),
          messageSnippet: messageInput.trim().substring(0, 95) + (messageInput.length > 95 ? '...' : ''),
          fullMessage: messageInput.trim(),
          scannerMode,
          result: fallbackResult
        };
        setHistory(prev => [newHistoryItem, ...prev]);
        setActiveTab('OVERVIEW');
        showToast('Assessment completed via local heuristic core.');
      } catch (localErr: any) {
        setErrorMessage(localErr?.message || 'Failed to analyze threat vector');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: AttackPreset) => {
    setMessageInput(preset.content);
    setScannerMode(preset.mode);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setMessageInput('');
    setErrorMessage(null);
  };

  const handleSelectHistoryItem = (item: ScanHistoryItem) => {
    setMessageInput(item.fullMessage);
    setScannerMode(item.scannerMode);
    setAnalysisResult(item.result);
    setActiveTab('OVERVIEW');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    showToast('Threat log deleted.');
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    showToast('Threat log archive cleared.');
  };

  const handleActivatePro = (plan: string) => {
    setIsPro(true);
    localStorage.setItem(STORAGE_KEY_PRO, 'true');
    setShowProModal(false);
    showToast(`MaxShield Pro (${plan.toUpperCase()}) Activated! Continuous Zero-Day Surveillance Armed.`);
  };

  return (
    <div className="min-h-screen bg-[#E4E4E4] text-[#0E0E0E] editorial-grid selection:bg-[#EC783B] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E0E0E] text-white font-mono text-xs shadow-xl animate-in slide-in-from-bottom-3 duration-200 border border-[#BEBEBE]">
          <CheckCircle2 className="w-4 h-4 text-[#EC783B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MaxShield Pro Modal */}
      {showProModal && (
        <MaxShieldModal
          isCurrentPro={isPro}
          onClose={() => setShowProModal(false)}
          onActivatePro={handleActivatePro}
        />
      )}

      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Header Bar */}
        <Header
          isPro={isPro}
          onScanNow={() => {
            setActiveTab('OVERVIEW');
            handleAnalyze();
          }}
          onOpenPro={() => setShowProModal(true)}
          onShowInfo={() => showToast('ScamShield Cybersecurity Lab v2.6.4 // Zero-Trust Engine')}
        />

        {/* Hero Section & Stats */}
        <Hero
          threatScannedCount={184 + history.length}
          isPro={isPro}
          onUpgradeClick={() => setShowProModal(true)}
        />

        {/* 4-Segmented Tabs */}
        <SegmentedTabs
          activeTab={activeTab}
          historyCount={history.length}
          onTabChange={tab => setActiveTab(tab)}
        />

        {/* Error Alert Card */}
        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-[#FDEAEA] border border-[#F5AAAA] flex items-center gap-3 text-xs font-mono text-[#D32F2F]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Workstation or History View */}
        {activeTab === 'HISTORY' ? (
          <ThreatHistorySection
            history={history}
            onSelect={handleSelectHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onNewScan={() => {
              handleClear();
              setActiveTab('OVERVIEW');
            }}
          />
        ) : (
          <>
            {/* Input Workstation */}
            <ScannerWorkstation
              input={messageInput}
              scannerMode={scannerMode}
              isLoading={isLoading}
              onInputChange={setMessageInput}
              onModeChange={setScannerMode}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              onSelectPreset={handleSelectPreset}
            />

            {/* Active Analysis Results based on Tab */}
            {analysisResult && (
              <>
                {activeTab === 'OVERVIEW' && (
                  <ResultOverview
                    result={analysisResult}
                    onActionFeedback={showToast}
                  />
                )}
                {activeTab === 'GRAPH' && (
                  <AttackGraph result={analysisResult} />
                )}
                {activeTab === 'TIMELINE' && (
                  <TimelineSection result={analysisResult} />
                )}
              </>
            )}
          </>
        )}

        {/* Editorial Footer */}
        <footer className="mt-8 pt-6 pb-4 border-t border-[#D7D7D7] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#767676]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EC783B]"></span>
            <span className="font-bold text-[#0E0E0E]">SCAMSHIELD CYBERLAB</span>
            <span>// DEPLOYED ON CLOUD RUN</span>
          </div>
          <div>CONFIDENTIAL ZERO-TRUST SIMULATION SANDBOX</div>
        </footer>
      </main>
    </div>
  );
};

export default App;
