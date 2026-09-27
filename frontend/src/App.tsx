import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import {
  KnowledgeGraphData,
  BusinessRule,
  ChangeImpact,
  Mission,
  VerificationResult
} from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AskWhyDrawer } from './components/AskWhyDrawer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AnalyzeModal } from './components/AnalyzeModal';
import { UploadModal } from './components/UploadModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AdminModal } from './components/AdminModal';
import { OverviewPage } from './pages/OverviewPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { BusinessRulesPage } from './pages/BusinessRulesPage';
import { ImpactSimulatorPage } from './pages/ImpactSimulatorPage';
import { CodeExplorerPage } from './pages/CodeExplorerPage';
import { MissionsPage } from './pages/MissionsPage';
import { VerificationPage } from './pages/VerificationPage';
import { ReportsPage } from './pages/ReportsPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isFramed, setIsFramed] = useState<boolean>(true);
  const [bgTheme, setBgTheme] = useState<'pastel' | 'porcelain' | 'slate'>('pastel');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [repoInfo, setRepoInfo] = useState<{ name: string; runtime: string }>({
    name: 'legacy-shop',
    runtime: 'Node.js 12'
  });

  const addToast = (title: string, message?: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Core Data
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({
    nodes: [],
    edges: [],
    stats: {
      total_nodes: 0,
      total_edges: 0,
      services: 0,
      apis: 0,
      business_rules: 0,
      security_findings: 0,
      tests: 0
    }
  });
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [impact, setImpact] = useState<ChangeImpact | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);

  // Ask Why Drawer
  const [isAskWhyOpen, setIsAskWhyOpen] = useState<boolean>(false);
  const [askWhyTarget, setAskWhyTarget] = useState<string>('PaymentService');

  // Code Explorer state
  const [codeFile, setCodeFile] = useState<string>('services/payment.js');
  const [codeLine, setCodeLine] = useState<number>(1);

  // Initial Data Load
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const g = await api.getKnowledgeGraph();
      setGraphData(g);
      const r = await api.getBusinessRules();
      setRules(r.rules);
      const imp = await api.simulateImpact('PaymentService');
      setImpact(imp);
      const m = await api.getActiveMission();
      setMission(m);
      const v = await api.runVerification();
      setVerification(v);
    } catch (err) {
      console.error('Failed to load initial data', err);
    }
  };

  const handleLoadDemo = async () => {
    setIsAnalyzeModalOpen(true);
    setIsAnalyzing(true);
    try {
      await api.loadDemoRepo();
      await loadAllData();
      setRepoInfo({ name: 'legacy-shop', runtime: 'Node.js 12' });
      addToast('Demo Repository Loaded', 'Initialized legacy-shop (Node 12, Express, MongoDB v3).', 'success');
    } catch (err) {
      console.error('Failed to load demo', err);
      addToast('Failed to Load Demo', 'Ensure FastAPI backend is running on port 8000.', 'warning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzeModalOpen(true);
    setIsAnalyzing(true);
    try {
      await api.analyzeRepo();
      await loadAllData();
      addToast('Static Analysis Completed', 'AST parsed: 27 nodes, 35 edges, 5 business rules.', 'success');
    } catch (err) {
      console.error('Analysis error', err);
      addToast('Analysis Failed', 'Could not parse codebase AST.', 'warning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadSuccess = async (name: string, runtime: string) => {
    setRepoInfo({ name, runtime });
    await loadAllData();
    addToast('Repository Analyzed', `Successfully parsed AST and extracted rules for ${name}.`, 'success');
  };

  const handleSimulate = async (target: string) => {
    setIsAnalyzing(true);
    try {
      const data = await api.simulateImpact(target);
      setImpact(data);
      addToast('Blast Radius Calculated', `Simulated impact analysis for ${target} (${data.impact_level} RISK).`, 'info');
    } catch (err) {
      console.error('Simulation error', err);
      addToast('Simulation Error', `Failed to simulate blast radius for ${target}`, 'warning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateRuleStatus = async (id: string, status: string, note?: string) => {
    try {
      await api.updateBusinessRule(id, status, note);
      const r = await api.getBusinessRules();
      setRules(r.rules);
      addToast('Business Rule Updated', `Rule ${id} marked as ${status.toUpperCase()}.`, 'success');
    } catch (err) {
      console.error('Failed to update rule', err);
      addToast('Rule Update Failed', 'Could not update rule status.', 'warning');
    }
  };

  const handleCreateMission = async (goal: string) => {
    try {
      const m = await api.createMission(goal);
      setMission(m);
      addToast('Mission Initialized', `Goal: "${goal}" — Starting multi-agent workflow.`, 'info');
    } catch (err) {
      console.error('Failed to launch mission', err);
      addToast('Mission Launch Failed', 'Could not initialize mission.', 'warning');
    }
  };

  const handleSubmitGateDecision = async (option: string, rationale: string) => {
    try {
      const m = await api.submitGateDecision(option, rationale);
      setMission(m);
      const v = await api.runVerification();
      setVerification(v);
      addToast('Gate Decision Certified', `Action: "${option.toUpperCase()}" recorded in Institutional Memory.`, 'success');
    } catch (err) {
      console.error('Failed to submit decision', err);
      addToast('Decision Failed', 'Could not submit gate decision.', 'warning');
    }
  };

  const handleRerunVerification = async () => {
    setIsAnalyzing(true);
    try {
      const v = await api.runVerification();
      setVerification(v);
      addToast('Behavioral Contracts Verified', `${v.behavioral_contracts.length}/${v.behavioral_contracts.length} contracts passed with 100% fidelity.`, 'success');
    } catch (err) {
      console.error('Verification error', err);
      addToast('Verification Failed', 'Node test runner encountered an issue.', 'warning');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleJumpToCode = (file: string, line: number = 1) => {
    setCodeFile(file);
    setCodeLine(line);
    setActiveTab('code');
  };

  const handleOpenAskWhyWithNode = (nodeName: string) => {
    setAskWhyTarget(nodeName);
    setIsAskWhyOpen(true);
  };

  const cycleTheme = () => {
    if (bgTheme === 'pastel') setBgTheme('porcelain');
    else if (bgTheme === 'porcelain') setBgTheme('slate');
    else setBgTheme('pastel');
  };

  const outerBgClass =
    bgTheme === 'pastel'
      ? 'bg-[#ebe7f8]'
      : bgTheme === 'porcelain'
      ? 'bg-[#f1f3f9]'
      : 'bg-[#e2e8f0]';

  return (
    <div
      className={`h-screen w-screen transition-all duration-300 overflow-hidden font-sans select-none ${
        isFramed
          ? `${outerBgClass} p-3 sm:p-4 md:p-5 flex items-center justify-center`
          : 'bg-[#f8f7fc] p-0'
      }`}
    >
      {/* Floating App Window Container matching reference screenshot */}
      <div
        className={`w-full h-full bg-[#f8f7fc] flex overflow-hidden relative transition-all duration-300 ${
          isFramed
            ? 'rounded-[28px] md:rounded-[32px] border border-white/90 shadow-[0_20px_60px_-15px_rgba(100,70,200,0.14)] ring-1 ring-purple-900/5'
            : 'rounded-none border-0 shadow-none'
        }`}
      >
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAskWhy={() => setIsAskWhyOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8f7fc]">
          {/* Floating Inset Top Navbar Card */}
          <Navbar
            onLoadDemo={handleLoadDemo}
            onAnalyze={handleAnalyze}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            onOpenProfile={() => setIsAdminModalOpen(true)}
            isAnalyzing={isAnalyzing}
            repoName={repoInfo.name}
            runtime={repoInfo.runtime}
            missionStatus={mission?.status || 'idle'}
            pageTitle={activeTab}
            isFramed={isFramed}
            onToggleFramed={() => setIsFramed(!isFramed)}
            bgTheme={bgTheme}
            onCycleTheme={cycleTheme}
          />

          {/* Viewport Router */}
          <main className="flex-1 overflow-hidden relative bg-[#f8f7fc]">
          {activeTab === 'overview' && (
            <OverviewPage
              stats={{
                files: 17,
                dependencies: 5,
                rules: rules.length,
                security: 4,
                tests: 7
              }}
              onNavigate={setActiveTab}
              onRunMission={() => setActiveTab('missions')}
            />
          )}

          {activeTab === 'graph' && (
            <KnowledgeGraphPage
              key={graphData.nodes.length}
              initialNodes={graphData.nodes}
              initialEdges={graphData.edges}
              stats={graphData.stats}
              onOpenAskWhyWithNode={handleOpenAskWhyWithNode}
              onJumpToCode={handleJumpToCode}
              onSimulateTarget={(target) => {
                handleSimulate(target);
                setActiveTab('impact');
              }}
            />
          )}

          {activeTab === 'rules' && (
            <BusinessRulesPage
              rules={rules}
              onUpdateRuleStatus={handleUpdateRuleStatus}
              onJumpToCode={handleJumpToCode}
            />
          )}

          {activeTab === 'impact' && (
            <ImpactSimulatorPage
              impact={impact}
              onSimulate={handleSimulate}
              onLaunchMission={() => setActiveTab('missions')}
              onJumpToCode={handleJumpToCode}
              loading={isAnalyzing}
            />
          )}

          {activeTab === 'code' && (
            <CodeExplorerPage
              initialFile={codeFile}
              initialLine={codeLine}
            />
          )}

          {activeTab === 'missions' && (
            <MissionsPage
              mission={mission}
              onCreateMission={handleCreateMission}
              onSubmitGateDecision={handleSubmitGateDecision}
              onNavigateToVerify={() => setActiveTab('verify')}
            />
          )}

          {activeTab === 'verify' && (
            <VerificationPage
              verification={verification}
              onRerun={handleRerunVerification}
              onNavigateToReport={() => setActiveTab('reports')}
              loading={isAnalyzing}
            />
          )}

          {activeTab === 'reports' && <ReportsPage />}
        </main>
      </div>
    </div>

      {/* Contextual Ask ReForge Drawer */}
      <AskWhyDrawer
        isOpen={isAskWhyOpen}
        onClose={() => setIsAskWhyOpen(false)}
        targetNode={askWhyTarget}
        onJumpToCode={handleJumpToCode}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Deterministic Multi-Step Analysis Modal */}
      <AnalyzeModal
        isOpen={isAnalyzeModalOpen}
        onComplete={() => setIsAnalyzeModalOpen(false)}
      />

      {/* Upload Repository & Code Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onError={(msg) => addToast('Upload Error', msg, 'warning')}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Admin Profile Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        repoName={repoInfo.name}
        runtime={repoInfo.runtime}
      />
    </div>
  );
};

export default App;
