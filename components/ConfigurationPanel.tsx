import React, { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { FEATURE_CLASSES_MOCK, DEFAULT_CONFIG } from '../constants';
import FileBrowserModal from './FileBrowserModal';
import { GoogleGenAI } from "@google/genai";
import { 
  Database, 
  FolderOpen, 
  RefreshCw, 
  ArrowRight,
  ArrowLeftRight,
  Globe,
  User,
  Lock,
  Play,
  RotateCcw,
  FileCode,
  Search,
  Loader2,
  AlertCircle,
  FileDown,
  Type,
  Settings2,
  History,
  FileText,
  FileSpreadsheet
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
  const [featureClasses, setFeatureClasses] = useState<FeatureClass[]>([]);
  const [browserMode, setBrowserMode] = useState<{ isOpen: boolean; mode: 'file' | 'folder' | 'gdb'; target: keyof AppConfig; title: string }>({
    isOpen: false,
    mode: 'folder',
    target: 'sourceGdb',
    title: 'Select Geodatabase'
  });

  const getAi = () => {
    try {
      const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : '';
      return new GoogleGenAI({ apiKey });
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const path = activeView === 'gdb-extract' ? config.sourceGdb : (activeView === 'sde-to-gdb' ? config.sdeToGdbSource : '');
    const isGisPath = path && (path.toLowerCase().endsWith('.gdb') || path.toLowerCase().endsWith('.sde'));
    
    if (isGisPath) {
      scanWorkspace(path);
    } else {
      setFeatureClasses([]);
    }
  }, [config.sourceGdb, config.sdeToGdbSource, activeView]);

  const scanWorkspace = async (path: string) => {
    if (!config.backendVerified) return;
    setIsScanning(true);
    const ai = getAi();
    if (!ai) {
      setFeatureClasses(FEATURE_CLASSES_MOCK);
      setIsScanning(false);
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a Python backend with Arcpy. Scan: "${path}". Return JSON array with name, rows, type.`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "[]");
      setFeatureClasses(data.length > 0 ? data : FEATURE_CLASSES_MOCK);
    } catch (err) {
      setFeatureClasses(FEATURE_CLASSES_MOCK);
    } finally {
      setIsScanning(false);
    }
  };

  const InputField = ({ label, value, icon: Icon, onChange: onValChange, isFile = true, onFileClick, placeholder, type = "text" }: any) => (
    <div className="space-y-2 animate-in fade-in duration-300">
      <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={14} /></span>
          <input
            disabled={isExecuting}
            type={type}
            value={value}
            onChange={(e) => onValChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-600 dark:text-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-accent-dark/20 transition-all shadow-inner"
            placeholder={placeholder}
          />
        </div>
        {isFile && (
          <button onClick={onFileClick} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
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
            <InputField label="Source SDE Workspace" value={config.sdeToGdbSource} icon={Database} onChange={(v: string) => onChange({ sdeToGdbSource: v })} onFileClick={() => setBrowserMode({ isOpen: true, mode: 'file', target: 'sdeToGdbSource', title: 'Select SDE File' })} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Target Folder" value={config.sdeToGdbTargetFolder} icon={FolderOpen} onChange={(v: string) => onChange({ sdeToGdbTargetFolder: v })} onFileClick={() => setBrowserMode({ isOpen: true, mode: 'folder', target: 'sdeToGdbTargetFolder', title: 'Select Output Directory' })} />
              <InputField label="Output GDB Name" value={config.sdeToGdbName} icon={Type} isFile={false} onChange={(v: string) => onChange({ sdeToGdbName: v })} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Database size={12} /> Live Workspace Preview {isScanning && <Loader2 size={10} className="animate-spin" />}
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                {featureClasses.map((fc, i) => (
                  <div key={i} className="flex justify-between text-[10px] text-slate-500 py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-mono text-slate-700 dark:text-slate-300">{fc.name}</span>
                    <span>{fc.type} • {fc.rows}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'gdb-extract':
        return (
          <div className="space-y-6">
            <InputField label="Source GDB" value={config.sourceGdb} icon={Database} onChange={(v: string) => onChange({ sourceGdb: v })} onFileClick={() => setBrowserMode({ isOpen: true, mode: 'gdb', target: 'sourceGdb', title: 'Select Source GDB' })} />
            <InputField label="Output Folder" value={config.outputFolder} icon={FolderOpen} onChange={(v: string) => onChange({ outputFolder: v })} onFileClick={() => setBrowserMode({ isOpen: true, mode: 'folder', target: 'outputFolder', title: 'Select Target Folder' })} />
          </div>
        );
      case 'sde-to-sde':
        return (
          <div className="space-y-6">
            <InputField label="Source Connection" value={config.sdeConnection} icon={FileCode} onChange={(v: string) => onChange({ sdeConnection: v })} onFileClick={() => setBrowserMode({ isOpen: true, mode: 'file', target: 'sdeConnection', title: 'Select Connection' })} />
            <div className="flex justify-center"><ArrowRight size={16} className="text-slate-300" /></div>
            <InputField label="Target Connection" value={config.targetSdeConnection} icon={FileCode} onChange={(v: string) => onChange({ targetSdeConnection: v })} onFileClick={() => setBrowserMode({ isOpen: true, mode: 'file', target: 'targetSdeConnection', title: 'Select Connection' })} />
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
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <InputField 
              label="Portal URL" 
              value={config.portalUrl} 
              icon={Globe} 
              onChange={(v: string) => onChange({ portalUrl: v })} 
              isFile={false} 
              placeholder="https://www.arcgis.com" 
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="User" 
                value={config.portalUser} 
                icon={User} 
                onChange={(v: string) => onChange({ portalUser: v })} 
                isFile={false} 
                placeholder="spkumar14352" 
              />
              <InputField 
                label="Password" 
                value={config.portalPass} 
                icon={Lock} 
                onChange={(v: string) => onChange({ portalPass: v })} 
                isFile={false} 
                type="password" 
                placeholder="••••••••" 
              />
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <InputField 
                label="Excel Output Path" 
                value={config.portalOutputPath} 
                icon={FileSpreadsheet} 
                onChange={(v: string) => onChange({ portalOutputPath: v })} 
                onFileClick={() => setBrowserMode({ isOpen: true, mode: 'folder', target: 'portalOutputPath', title: 'Select Output Directory' })} 
                placeholder="C:\GIS\Reports\Portal_Inventory.xls"
              />
            </div>
          </div>
        );
      case 'job-history':
        return <div className="p-12 text-center text-slate-400 italic text-xs"><History size={40} className="mx-auto mb-4 opacity-20" /> No records found.</div>;
      default:
        return <div className="p-12 text-center text-slate-400 italic text-xs"><AlertCircle size={40} className="mx-auto mb-4 opacity-20" /> Select tool.</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-8 py-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
             <Settings2 size={16} className="text-accent-dark" />
             <h3 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest leading-none">Tool configuration</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
            <FileText size={10} /> {config.scriptFilePaths[activeView] || 'No file assigned'}
          </div>
        </div>
        <button onClick={() => onChange(DEFAULT_CONFIG)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase">Reset</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">{renderConfig()}</div>

      {activeView !== 'job-history' && activeView !== 'dashboard' && activeView !== 'settings' && (
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20">
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white transition-all text-xs uppercase tracking-[0.2em] shadow-lg ${isExecuting ? 'bg-accent/40 cursor-not-allowed' : 'bg-accent-dark hover:bg-[#25a99e] shadow-accent/20 active:scale-[0.98]'}`}
          >
            {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            <span>{isExecuting ? 'In Progress' : 'Execute Python Tool'}</span>
          </button>
        </div>
      )}

      <FileBrowserModal 
        isOpen={browserMode.isOpen} 
        mode={browserMode.mode} 
        title={browserMode.title} 
        onClose={() => setBrowserMode(p => ({ ...p, isOpen: false }))} 
        onSelect={(p) => {
          let finalPath = p;
          if (browserMode.target === 'portalOutputPath' && !p.toLowerCase().endsWith('.xls')) {
            finalPath = p.endsWith('\\') ? `${p}Portal_Inventory.xls` : `${p}\\Portal_Inventory.xls`;
          }
          onChange({ [browserMode.target]: finalPath });
        }} 
      />
    </div>
  );
};

export default ConfigurationPanel;