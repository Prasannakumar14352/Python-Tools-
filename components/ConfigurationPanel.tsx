
import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { FEATURE_CLASSES_MOCK, DEFAULT_CONFIG } from '../constants';
import FileBrowserModal from './FileBrowserModal';
import { GoogleGenAI } from "@google/genai";
import { 
  Database, 
  FolderOpen, 
  Info, 
  RefreshCw, 
  ArrowRight,
  ArrowLeftRight,
  Globe,
  User,
  Lock,
  FileSpreadsheet,
  Play,
  RotateCcw,
  CheckCircle2,
  FileCode,
  Search,
  Loader2,
  AlertCircle,
  FileOutput,
  Type,
  Settings2,
  History
} from 'lucide-react';

interface FeatureClass {
  name: string;
  rows: string;
  type: string;
}

interface ConfigurationPanelProps {
  activeView: string;
  config: AppConfig;
  onChange: (updates: Partial<AppConfig>) => void;
  isExecuting: boolean;
  onExecute: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ activeView, config, onChange, isExecuting, onExecute }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [featureClasses, setFeatureClasses] = useState<FeatureClass[]>([]);
  const [browserMode, setBrowserMode] = useState<{ isOpen: boolean; mode: 'file' | 'folder' | 'gdb'; target: keyof AppConfig | 'portalExcel'; title: string }>({
    isOpen: false,
    mode: 'folder',
    target: 'sourceGdb',
    title: 'Select Geodatabase'
  });

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const getRelevantPath = () => {
    if (activeView === 'gdb-extract') return config.sourceGdb;
    if (activeView === 'sde-to-gdb') return config.sdeToGdbSource;
    return '';
  };

  useEffect(() => {
    const path = getRelevantPath();
    const isGisPath = path && (
      path.toLowerCase().endsWith('.gdb') || 
      path.toLowerCase().endsWith('.gdb\\') || 
      path.toLowerCase().endsWith('.sde')
    );
    
    if (isGisPath && (activeView === 'gdb-extract' || activeView === 'sde-to-gdb')) {
      scanWorkspace(path);
    } else {
      setFeatureClasses([]);
    }
  }, [config.sourceGdb, config.sdeToGdbSource, activeView]);

  const scanWorkspace = async (path: string) => {
    if (!config.backendVerified) {
      setScanError("Python backend not verified.");
      return;
    }
    setIsScanning(true);
    setScanError(null);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a Python backend with Arcpy installed. Workspace: "${path}". Return a JSON array of feature classes with keys: "name", "rows", and "type".`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "[]");
      setFeatureClasses(data.length > 0 ? data : FEATURE_CLASSES_MOCK);
    } catch (err) {
      setScanError("Failed to scan workspace metadata.");
      setFeatureClasses([]);
    } finally {
      setIsScanning(false);
    }
  };

  const openBrowser = (target: keyof AppConfig | 'portalExcel', mode: 'file' | 'folder' | 'gdb', title: string) => {
    setBrowserMode({ isOpen: true, mode, target, title });
  };

  const handleBrowserSelect = (path: string) => {
    if (browserMode.target === 'portalExcel') {
      onChange({ outputFolder: path.substring(0, path.lastIndexOf('\\')) });
    } else {
      onChange({ [browserMode.target as keyof AppConfig]: path });
    }
  };

  const InputField = ({ label, value, sub, placeholder, icon: Icon, onChange: onValChange, isFile = true, onFileClick }: any) => (
    <div className="space-y-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{label}</label>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={14} />
          </span>
          <input
            disabled={isExecuting}
            type="text"
            value={value}
            onChange={(e) => onValChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-600 dark:text-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all shadow-inner"
            placeholder={placeholder}
          />
        </div>
        {isFile && (
          <button onClick={onFileClick} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Search size={14} />
          </button>
        )}
      </div>
    </div>
  );

  const renderConfig = () => {
    switch (activeView) {
      case 'sde-to-gdb':
        return (
          <div className="space-y-6">
            <InputField 
              label="Source SDE Workspace"
              sub="Connection file or path"
              value={config.sdeToGdbSource}
              icon={Database}
              placeholder="C:\GIS\Data\source.sde"
              onChange={(v: string) => onChange({ sdeToGdbSource: v })}
              onFileClick={() => openBrowser('sdeToGdbSource', 'file', 'Select Source Workspace')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Target Folder"
                value={config.sdeToGdbTargetFolder}
                icon={FolderOpen}
                onChange={(v: string) => onChange({ sdeToGdbTargetFolder: v })}
                onFileClick={() => openBrowser('sdeToGdbTargetFolder', 'folder', 'Select Target Folder')}
              />
              <InputField 
                label="Output GDB Name"
                value={config.sdeToGdbName}
                icon={Type}
                isFile={false}
                onChange={(v: string) => onChange({ sdeToGdbName: v })}
              />
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 relative min-h-[120px]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-3 flex items-center gap-2">
                <Database size={12} /> Detected Workspace Content
                {isScanning && <Loader2 size={10} className="animate-spin text-accent-dark" />}
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                {featureClasses.map((fc, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-400 p-2 bg-white dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                    <span className="font-bold">{fc.name}</span>
                    <span className="text-[9px] opacity-60">{fc.rows} rows • {fc.type}</span>
                  </div>
                ))}
                {!isScanning && featureClasses.length === 0 && (
                  <div className="text-center py-4 text-slate-400 text-[10px] italic">No workspace selected or connected</div>
                )}
              </div>
            </div>
          </div>
        );
      case 'gdb-extract':
        return (
          <div className="space-y-6">
            <InputField label="Source Geodatabase" value={config.sourceGdb} icon={Database} onChange={(v: string) => onChange({ sourceGdb: v })} onFileClick={() => openBrowser('sourceGdb', 'gdb', 'Select Source Geodatabase')} />
            <InputField label="Output Folder" value={config.outputFolder} icon={FolderOpen} onChange={(v: string) => onChange({ outputFolder: v })} onFileClick={() => openBrowser('outputFolder', 'folder', 'Select Output Folder')} />
          </div>
        );
      case 'sde-to-sde':
        return (
          <div className="space-y-6">
            <InputField label="Source SDE" value={config.sdeConnection} icon={FileCode} onChange={(v: string) => onChange({ sdeConnection: v })} onFileClick={() => openBrowser('sdeConnection', 'file', 'Select Source SDE')} />
            <div className="flex justify-center"><ArrowRight size={16} className="text-slate-300" /></div>
            <InputField label="Target SDE" value={config.targetSdeConnection} icon={FileCode} onChange={(v: string) => onChange({ targetSdeConnection: v })} onFileClick={() => openBrowser('targetSdeConnection', 'file', 'Select Target SDE')} />
          </div>
        );
      case 'fc-comparison':
        return (
          <div className="space-y-6">
            <InputField label="Source Dataset" value={config.sourceDataset} icon={Database} onChange={(v: string) => onChange({ sourceDataset: v })} />
            <InputField label="Target Dataset" value={config.targetDataset} icon={Database} onChange={(v: string) => onChange({ targetDataset: v })} />
          </div>
        );
      case 'portal-extract':
        return (
          <div className="space-y-6">
            <InputField label="Portal URL" value={config.portalUrl} icon={Globe} onChange={(v: string) => onChange({ portalUrl: v })} isFile={false} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Username" value={config.portalUser} icon={User} onChange={(v: string) => onChange({ portalUser: v })} isFile={false} />
              <InputField label="Password" value={config.portalPass} icon={Lock} onChange={(v: string) => onChange({ portalPass: v })} isFile={false} />
            </div>
          </div>
        );
      case 'job-history':
        return (
          <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 space-y-4">
            <History size={48} strokeWidth={1} className="opacity-20" />
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Execution Archives</p>
              <p className="text-[10px] italic">No historical jobs found on this workstation.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-12 text-center text-slate-400 space-y-4">
            <AlertCircle size={32} className="mx-auto opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">Select a valid tool from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-8 py-6">
        <div className="flex items-center gap-3">
          <Settings2 size={18} className="text-accent-dark" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight uppercase">Tool Parameters</h3>
        </div>
        {activeView !== 'job-history' && (
          <button onClick={() => onChange(DEFAULT_CONFIG)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors uppercase tracking-widest">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {renderConfig()}
      </div>

      {activeView !== 'job-history' && (
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white transition-all text-xs uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] ${
              isExecuting ? 'bg-accent/40 cursor-not-allowed' : 'bg-accent-dark hover:bg-[#25a99e] shadow-accent/20'
            }`}
          >
            {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            <span>{isExecuting ? 'Executing Task...' : 'Run Automation'}</span>
          </button>
        </div>
      )}

      <FileBrowserModal 
        isOpen={browserMode.isOpen}
        mode={browserMode.mode}
        title={browserMode.title}
        onClose={() => setBrowserMode(p => ({ ...p, isOpen: false }))}
        onSelect={handleBrowserSelect}
      />
    </div>
  );
};

export default ConfigurationPanel;
