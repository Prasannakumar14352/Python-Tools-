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
  FileDown,
  Settings as SettingsIcon,
  History,
  LayoutDashboard,
  Terminal
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
        setConfig({ ...DEFAULT_CONFIG, ...parsed }); 
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('geoflow_v5_config', JSON.stringify(config));
    if (config.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [config]);

  const addLog = useCallback((log: LogEntry) => setLogs(prev => [...prev, log]), []);

  const handleExecute = async () => {
    setShowConfirm(false);
    setIsExecuting(true);
    setLogs([]);
    addLog({ timestamp: new Date().toLocaleTimeString(), level: 'SYSTEM', message: `Initialising ${activeView.toUpperCase()} operation...` });

    const dummyScript = { id: activeView, name: activeView, description: '', icon: '', status: ExecutionStatus.IDLE };
    try {
      const success = await simulateScriptRun(dummyScript, config, addLog, () => {});
      if (success) {
        addLog({ timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Task completed successfully.' });
      } else {
        addLog({ timestamp: new Date().toLocaleTimeString(), level: 'ERROR', message: 'Operation failed. Check local Python logs.' });
      }
    } catch (err) {
      addLog({ timestamp: new Date().toLocaleTimeString(), level: 'ERROR', message: `Execution Error: ${err.message}` });
    } finally {
      setIsExecuting(false);
    }
  };

  const getToolInfo = () => {
    switch(activeView) {
      case 'dashboard': return { title: 'Dashboard', sub: 'Project Overview', icon: LayoutDashboard };
      case 'sde-to-gdb': return { title: 'SDE to GDB', sub: 'Enterprise to File GDB Migration', icon: FileDown };
      case 'gdb-extract': return { title: 'GDB Extraction', sub: 'Feature Class Export', icon: Database };
      case 'sde-to-sde': return { title: 'SDE to SDE', sub: 'Database to Database Sync', icon: RefreshCw };
      case 'fc-comparison': return { title: 'Comparison', sub: 'Dataset Analysis Tool', icon: ArrowLeftRight };
      case 'portal-extract': return { title: 'Portal Extraction', sub: 'AGOL Content Inventory', icon: Globe };
      case 'job-history': return { title: 'History', sub: 'Task execution records', icon: History };
      case 'settings': return { title: 'Settings', sub: 'Application Preferences', icon: SettingsIcon };
      default: return { title: 'Tool', sub: 'GIS Automation', icon: Terminal };
    }
  };

  const toolInfo = getToolInfo();
  const Icon = toolInfo?.icon || Terminal;

  const renderContent = () => {
    try {
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
          <div className="w-[50%] lg:w-[55%] h-full flex flex-col overflow-hidden">
            <ConfigurationPanel 
              activeView={activeView}
              config={config}
              onChange={(u) => setConfig(p => ({ ...p, ...u }))}
              isExecuting={isExecuting}
              onExecute={() => setShowConfirm(true)}
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
    } catch (err) {
      console.error("Render error in App content area", err);
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
           <AlertTriangle size={64} className="mb-4 text-red-500 opacity-20" />
           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Interface Error</h3>
           <p className="text-sm">Something went wrong while rendering this tool. Please try selecting another option.</p>
           <button onClick={() => setActiveView('dashboard')} className="mt-6 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest">Return to Dashboard</button>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f1f5f9] dark:bg-slate-950 font-sans transition-colors duration-300">
      <Sidebar activeView={activeView} onViewChange={(v) => { if (!isExecuting) setActiveView(v); }} />

      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        {activeView !== 'dashboard' && (
          <header className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-light/20 text-accent-dark rounded-2xl flex items-center justify-center shadow-sm">
                <Icon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{toolInfo?.title}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{toolInfo?.sub}</p>
              </div>
            </div>
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
              <button onClick={() => setShowConfirm(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Execute Automation?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">Confirm starting the <span className="text-accent-dark font-bold">"{toolInfo?.title}"</span> process. Data will be modified at the target locations.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">Cancel</button>
              <button onClick={handleExecute} className="flex-1 px-4 py-3 rounded-xl bg-accent-dark text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-[#25a99e]">Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;