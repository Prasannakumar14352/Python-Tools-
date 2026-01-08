
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Console from './components/Console';
import ConfigurationPanel from './components/ConfigurationPanel';
import DashboardView from './components/DashboardView';
import SettingsView from './components/SettingsView';
import { AppConfig, ExecutionStatus, LogEntry } from './types';
import { DEFAULT_CONFIG } from './constants';
import { simulateScriptRun } from './services/mockExecution';
import { 
  Play, 
  X, 
  AlertTriangle,
  Database,
  RefreshCw,
  ArrowLeftRight,
  Globe,
  Clock,
  Settings as SettingsIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('geoflow_v5_config');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        // Ensure defaults for new properties if migrating
        setConfig({ ...DEFAULT_CONFIG, ...parsed }); 
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('geoflow_v5_config', JSON.stringify(config));
    
    // Apply theme to document
    if (config.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [config]);

  const addLog = useCallback((log: LogEntry) => setLogs(prev => [...prev, log]), []);

  const confirmExecute = () => {
    setShowConfirm(true);
  };

  const handleExecute = async () => {
    setShowConfirm(false);
    setIsExecuting(true);
    setLogs([]);
    addLog({ timestamp: new Date().toLocaleTimeString(), level: 'SYSTEM', message: `Initializing ${activeView} task sequence...` });

    const dummyScript = { id: activeView, name: activeView, description: '', icon: '', status: ExecutionStatus.IDLE };
    const success = await simulateScriptRun(dummyScript, config, addLog, () => {});

    if (success) {
      addLog({ timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Pipeline process finished successfully.' });
    } else {
      addLog({ timestamp: new Date().toLocaleTimeString(), level: 'ERROR', message: 'Execution failed. Review console logs for data lock errors.' });
    }
    setIsExecuting(false);
  };

  const getToolInfo = () => {
    switch(activeView) {
      case 'gdb-extract': return { title: 'GDB Extraction', sub: 'Extract feature classes from a File Geodatabase to individual shapefiles', icon: Database };
      case 'sde-to-sde': return { title: 'SDE to SDE Conversion', sub: 'Migrate feature classes between Enterprise Geodatabases', icon: RefreshCw };
      case 'fc-comparison': return { title: 'Feature Class Comparison', sub: 'Compare schema, attributes, or spatial properties between datasets', icon: ArrowLeftRight };
      case 'portal-extract': return { title: 'Portal Content Extraction', sub: 'Connect to Portal/AGOL and export a catalog of items to Excel', icon: Globe };
      case 'job-history': return { title: 'Job History', sub: 'Historical records of all automation workflows', icon: Clock };
      case 'settings': return { title: 'Settings', sub: 'Global application parameters and environment config', icon: SettingsIcon };
      default: return null;
    }
  };

  const toolInfo = getToolInfo();
  const Icon = toolInfo?.icon;

  const renderContent = () => {
    if (activeView === 'dashboard') {
      return (
        <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar pb-8">
          <DashboardView config={config} onQuickAction={setActiveView} />
        </div>
      );
    }

    if (activeView === 'settings') {
      return (
        <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar pb-8">
          <SettingsView config={config} onChange={(u) => setConfig(p => ({ ...p, ...u }))} />
        </div>
      );
    }

    return (
      <div className="flex-1 flex gap-8 min-h-0 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="w-[55%] h-full flex flex-col overflow-hidden">
          <ConfigurationPanel 
            activeView={activeView}
            config={config}
            onChange={(u) => setConfig(p => ({ ...p, ...u }))}
            isExecuting={isExecuting}
            onExecute={confirmExecute}
          />
        </div>
        <div className="flex-1 h-full">
          <Console 
            logs={logs} 
            onClear={() => setLogs([])} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f1f5f9] dark:bg-slate-950 font-sans transition-colors duration-300">
      <Sidebar activeView={activeView} onViewChange={(v) => { if (!isExecuting) setActiveView(v); }} />

      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        {activeView !== 'dashboard' && (
          <header className="flex items-center justify-between mb-8 shrink-0 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-light/30 text-accent-dark rounded-2xl flex items-center justify-center shadow-sm">
                {Icon && <Icon size={24} strokeWidth={2} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{toolInfo?.title}</h2>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{toolInfo?.sub}</p>
              </div>
            </div>
            {activeView !== 'settings' && activeView !== 'job-history' && (
              <div className="flex items-center gap-3">
                 <div className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center gap-2 shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></div>
                   <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase">🕒 PENDING EXECUTION</span>
                 </div>
              </div>
            )}
          </header>
        )}

        {renderContent()}
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner">
                <AlertTriangle size={24} />
              </div>
              <button onClick={() => setShowConfirm(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Execute Script?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Are you sure you want to execute the <span className="font-bold text-accent-dark">"{toolInfo?.title}"</span> tool? 
              This operation may be long-running and will modify data at the specified destinations.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button 
                onClick={handleExecute}
                className="flex-1 px-4 py-3 rounded-xl bg-accent-dark text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#25a99e] transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
              >
                <Play size={14} fill="currentColor" />
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
