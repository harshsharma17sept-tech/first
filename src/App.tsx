import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AnalysisTab, AttackPreset, ScamAnalysisResult, ScanHistoryItem, HeuristicStrictness } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DashboardNav } from './components/DashboardNav';
import { ScannerWorkstation, PRESET_ATTACKS } from './components/ScannerWorkstation';
import { ResultOverview } from './components/ResultOverview';
import { AttackGraph } from './components/AttackGraph';
import { TimelineSection } from './components/TimelineSection';
import { ThreatHistorySection } from './components/ThreatHistorySection';
import { MaxShieldModal } from './components/MaxShieldModal';
import { SettingsModal, UserProfile, SecuritySettings } from './components/SettingsModal';
import { ThreeBackground } from './components/ThreeBackground';
import { LoadingScreen } from './components/LoadingScreen';
import { HeuristicEngine } from './engine/HeuristicEngine';
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'scamshield_history_v2';
const STORAGE_KEY_PRO = 'scamshield_pro_v2';
const STORAGE_KEY_PROFILE = 'scamshield_user_profile_v2';
const STORAGE_KEY_SETTINGS = 'scamshield_user_settings_v2';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Harsh Sharma',
  email: 'harshsharma17sept@gmail.com',
  role: 'Lead Security Analyst',
  avatarColor: '#EC783B'
};

const DEFAULT_SETTINGS: SecuritySettings = {
  deepAiAnalysis: true,
  realtimeUrlCheck: true,
  enable3dBackground: true,
  hapticFeedback: true,
  autoLogScans: true
};

export const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [messageInput, setMessageInput] = useState<string>('');
  const [scannerMode, setScannerMode] = useState<'SMS' | 'URL' | 'EMAIL'>('SMS');
  const [activeTab, setActiveTab] = useState<AnalysisTab>('OVERVIEW');
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_PRO) === 'true';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [heuristicStrictness, setHeuristicStrictness] = useState<HeuristicStrictness>(() => {
    try {
      const saved = localStorage.getItem('scamshield_heuristic_strictness');
      if (saved === 'LOW' || saved === 'MEDIUM' || saved === 'HIGH') {
        return saved;
      }
    } catch {}
    return 'MEDIUM';
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

    // Default realistic sample threat for immediate demonstration
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

  // Persist storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(securitySettings));
    } catch {}
  }, [securitySettings]);

  useEffect(() => {
    try {
      localStorage.setItem('scamshield_heuristic_strictness', heuristicStrictness);
    } catch {}
  }, [heuristicStrictness]);

  // Initial populate with default sample
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
          scannerMode,
          strictness: heuristicStrictness
        })
      });

      let result: ScamAnalysisResult;

      if (response.ok) {
        result = await response.json();
      } else {
        // Fallback to local heuristic engine with calibrated strictness
        result = HeuristicEngine.analyzeLocally(messageInput.trim(), heuristicStrictness);
      }

      setAnalysisResult(result);

      // Add to history if enabled
      if (securitySettings.autoLogScans) {
        const newHistoryItem: ScanHistoryItem = {
          id: `scan-${Date.now()}`,
          timestamp: Date.now(),
          messageSnippet: messageInput.trim().substring(0, 95) + (messageInput.length > 95 ? '...' : ''),
          fullMessage: messageInput.trim(),
          scannerMode,
          result
        };
        setHistory(prev => [newHistoryItem, ...prev]);
      }

      setActiveTab('OVERVIEW');
      showToast('Threat assessment completed.');
    } catch (err: any) {
      try {
        const fallbackResult = HeuristicEngine.analyzeLocally(messageInput.trim(), heuristicStrictness);
        setAnalysisResult(fallbackResult);
        if (securitySettings.autoLogScans) {
          const newHistoryItem: ScanHistoryItem = {
            id: `scan-${Date.now()}`,
            timestamp: Date.now(),
            messageSnippet: messageInput.trim().substring(0, 95) + (messageInput.length > 95 ? '...' : ''),
            fullMessage: messageInput.trim(),
            scannerMode,
            result: fallbackResult
          };
          setHistory(prev => [newHistoryItem, ...prev]);
        }
        setActiveTab('OVERVIEW');
        showToast('Assessment completed via heuristic analysis.');
      } catch (localErr: any) {
        setErrorMessage(localErr?.message || 'Failed to evaluate threat message');
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
    showToast('Scan log removed.');
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    showToast('Threat history cleared.');
  };

  const handleActivatePro = (plan: string) => {
    setIsPro(true);
    localStorage.setItem(STORAGE_KEY_PRO, 'true');
    setShowProModal(false);
    showToast(`MaxShield Pro (${plan}) activated. Active surveillance enabled.`);
  };

  return (
    <div className="min-h-screen bg-[#E8E8E8] text-[#0E0E0E] relative selection:bg-[#EC783B] selection:text-black">
      {/* 3D Background Theme (Interactive WebGL Canvas) */}
      {securitySettings.enable3dBackground && (
        <ThreeBackground interactive={true} />
      )}

      {/* Loading Screen Animation */}
      <AnimatePresence>
        {initialLoading && (
          <LoadingScreen onComplete={() => setInitialLoading(false)} />
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0E0E0E] text-white text-xs font-semibold shadow-2xl border border-white/10 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-[#1B8A44]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MaxShield Pro Membership Modal */}
      {showProModal && (
        <MaxShieldModal
          isCurrentPro={isPro}
          onClose={() => setShowProModal(false)}
          onActivatePro={handleActivatePro}
        />
      )}

      {/* User Settings & Profile Modal */}
      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          userProfile={userProfile}
          onSaveProfile={setUserProfile}
          settings={securitySettings}
          onSaveSettings={setSecuritySettings}
          onClearHistory={handleClearAllHistory}
        />
      )}

      {/* Main Content Container with Subtle Glass Transparency */}
      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-7">
        {/* Navigation & Status Header */}
        <Header
          isPro={isPro}
          userProfile={userProfile}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenPro={() => setShowProModal(true)}
        />

        {/* Hero Section & Headline */}
        <Hero
          threatScannedCount={184 + history.length}
        />

        {/* 4 Clickable Smooth Animated Dashboard Buttons */}
        <DashboardNav
          activeTab={activeTab}
          historyCount={history.length}
          onTabChange={tab => setActiveTab(tab)}
        />

        {/* Error Alert Card */}
        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-[#FDEAEA] border border-[#F5AAAA] flex items-center gap-3 text-xs font-medium text-[#D32F2F]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dashboard View Routing with Silky Smooth Transitions */}
        <AnimatePresence mode="wait">
          {activeTab === 'OVERVIEW' && (
            <motion.div
              key="overview-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Input Workstation */}
              <ScannerWorkstation
                input={messageInput}
                scannerMode={scannerMode}
                isLoading={isLoading}
                strictness={heuristicStrictness}
                onInputChange={setMessageInput}
                onModeChange={setScannerMode}
                onStrictnessChange={setHeuristicStrictness}
                onAnalyze={handleAnalyze}
                onClear={handleClear}
                onSelectPreset={handleSelectPreset}
              />

              {/* Active Overview Analysis View */}
              {analysisResult && (
                <div className="mt-4">
                  <ResultOverview
                    result={analysisResult}
                    onActionFeedback={showToast}
                  />
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'GRAPH' && (
            <motion.div
              key="graph-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {analysisResult ? (
                <AttackGraph result={analysisResult} />
              ) : (
                <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#D7D7D7] text-center">
                  <p className="text-sm font-semibold text-[#0E0E0E]">No active threat analyzed yet</p>
                  <p className="text-xs text-[#767676] mt-1 mb-4">Run a scan to visualize the threat vector topology</p>
                  <button
                    onClick={() => setActiveTab('OVERVIEW')}
                    className="px-4 py-2 rounded-xl bg-[#EC783B] text-black font-bold text-xs hover:bg-[#D9662B] transition-colors cursor-pointer"
                  >
                    Open Threat Scanner
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'TIMELINE' && (
            <motion.div
              key="timeline-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {analysisResult ? (
                <TimelineSection result={analysisResult} />
              ) : (
                <div className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#D7D7D7] text-center">
                  <p className="text-sm font-semibold text-[#0E0E0E]">No active threat analyzed yet</p>
                  <p className="text-xs text-[#767676] mt-1 mb-4">Run a scan to map the 5-stage attack kill chain</p>
                  <button
                    onClick={() => setActiveTab('OVERVIEW')}
                    className="px-4 py-2 rounded-xl bg-[#EC783B] text-black font-bold text-xs hover:bg-[#D9662B] transition-colors cursor-pointer"
                  >
                    Open Threat Scanner
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'HISTORY' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Professional Humanized Footer */}
        <footer className="mt-10 pt-6 pb-6 border-t border-[#D7D7D7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#767676]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1B8A44]"></span>
            <span className="font-bold text-[#0E0E0E]">ScamShield Security Studio</span>
            <span>• Verified Threat Detection</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="hover:text-[#0E0E0E] transition-colors underline-offset-2 hover:underline"
            >
              Settings & Profile
            </button>
            <span>•</span>
            <span>Private Local Processing</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
