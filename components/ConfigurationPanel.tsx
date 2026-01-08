
import React, { useState } from 'react';
import { AppConfig } from '../types';
import { FEATURE_CLASSES_MOCK, DEFAULT_CONFIG } from '../constants';
import FileBrowserModal from './FileBrowserModal';
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
  Search
} from 'lucide-react';

interface ConfigurationPanelProps {
  activeView: string;
  config: AppConfig;
  onChange: (updates: Partial<AppConfig>) => void;
  isExecuting: boolean;
  onExecute: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ activeView, config, onChange, isExecuting, onExecute }) => {
  const [urlError, setUrlError] = useState<string | null>(null);
  const [browserMode, setBrowserMode] = useState<{ isOpen: boolean; mode: 'file' | 'folder' | 'gdb'; target: keyof AppConfig | 'portalExcel'; title: string }>({
    isOpen: false,
    mode: 'folder',
    target: 'sourceGdb',
    title: 'Select Geodatabase'
  });

  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError(null);
      return;
    }
    try {
      new URL(url);
      setUrlError(null);
    } catch (e) {
      setUrlError('Please enter a valid URL (e.g. https://www.arcgis.com)');
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

  const InputField = ({ label, value, sub, placeholder, icon: Icon, onChange: onValChange, error, isFile = true, onFileClick }: any) => (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{label}</label>
        <Info size={12} className="text-slate-300 dark:text-slate-600 cursor-help" />
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{sub}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600">
              <Icon size={14} strokeWidth={2} />
            </span>
            <input
              disabled={isExecuting}
              type="text"
              value={value}
              onChange={(e) => {
                onValChange(e.target.value);
                if (label.toLowerCase().includes('url')) validateUrl(e.target.value);
              }}
              className={`w-full bg-slate-50 dark:bg-slate-800/50 border ${error ? 'border-red-300 dark:border-red-900 focus:ring-red-200' : 'border-slate-200 dark:border-slate-700 focus:ring-accent-dark/20 focus:border-accent-dark'} rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-600 dark:text-slate-300 font-mono focus:outline-none focus:ring-2 transition-all shadow-inner`}
              placeholder={placeholder}
            />
          </div>
          {isFile && (
            <button 
              onClick={onFileClick}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3.5 rounded-lg text-slate-500 dark:text-slate-400 transition-all shadow-sm active:scale-[0.97] hover:border-accent-dark/50 group"
              title="Browse system"
            >
              <Search size={16} className="group-hover:text-accent-dark transition-colors" />
            </button>
          )}
        </div>
        {error && <span className="text-[9px] text-red-500 font-bold px-1">{error}</span>}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'gdb-extract':
        const isGdbSelected = config.sourceGdb && (config.sourceGdb.toLowerCase().endsWith('.gdb') || config.sourceGdb.toLowerCase().endsWith('.gdb\\'));
        return (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
            <InputField 
              label="Source Geodatabase"
              sub="Path to the source File Geodatabase (.gdb)"
              value={config.sourceGdb}
              icon={Database}
              placeholder="C:\Data\MyDatabase.gdb"
              onChange={(v: string) => onChange({ sourceGdb: v })}
              onFileClick={() => openBrowser('sourceGdb', 'gdb', 'Select Source Geodatabase')}
            />
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                  <Database size={14} className="text-accent-dark" /> Feature Classes 
                  {isGdbSelected && <CheckCircle2 size={12} className="text-emerald-500" />}
                </h4>
                {isGdbSelected && <button className="text-[10px] font-bold text-accent-dark hover:underline">Select All</button>}
              </div>

              {isGdbSelected ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar animate-in fade-in duration-500">
                  {FEATURE_CLASSES_MOCK.map((fc, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 border border-slate-50 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-800/30 hover:bg-accent-light/10 dark:hover:bg-accent-dark/10 hover:border-accent-light dark:hover:border-accent-dark transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-accent-dark focus:ring-accent-dark/20" defaultChecked />
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{fc.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold">{fc.rows} rows</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl py-12 px-6 flex flex-col items-center justify-center bg-slate-50/20 dark:bg-slate-800/10 text-center space-y-3">
                  <Database size={32} strokeWidth={1} className="text-slate-200 dark:text-slate-700" />
                  <div className="space-y-1">
                    <span className="text-slate-400 dark:text-slate-600 text-[11px] font-bold uppercase tracking-widest block">Select a geodatabase to view contents</span>
                    <span className="text-[9px] text-slate-300 dark:text-slate-600 italic">Browsing allows picking folders as .gdb containers</span>
                  </div>
                </div>
              )}
            </div>

            <InputField 
              label="Output Folder"
              sub="Destination folder for extracted files"
              value={config.outputFolder}
              icon={FolderOpen}
              placeholder="C:\output\Shapefiles"
              onChange={(v: string) => onChange({ outputFolder: v })}
              onFileClick={() => openBrowser('outputFolder', 'folder', 'Select Output Folder')}
            />
          </div>
        );

      case 'sde-to-sde':
        return (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
              <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <RefreshCw size={14} className="text-accent-dark" /> Enterprise Connection (.sde)
              </h4>
              <InputField 
                label="Source SDE Connection"
                sub="Select the .sde connection file for source access"
                value={config.sdeConnection}
                icon={FileCode}
                placeholder="C:\Users\User\AppData\Roaming\Esri\ArcGISPro\DBConnections\Source.sde"
                onChange={(v: string) => onChange({ sdeConnection: v })}
                onFileClick={() => openBrowser('sdeConnection', 'file', 'Select Source SDE Connection File')}
              />
              <div className="flex justify-center py-2">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 dark:text-slate-600">
                  <ArrowRight size={18} />
                </div>
              </div>
              <InputField 
                label="Target SDE Connection"
                sub="Select the .sde connection file for destination access"
                value={config.targetSdeConnection}
                icon={FileCode}
                placeholder="C:\Users\User\AppData\Roaming\Esri\ArcGISPro\DBConnections\Target.sde"
                onChange={(v: string) => onChange({ targetSdeConnection: v })}
                onFileClick={() => openBrowser('targetSdeConnection', 'file', 'Select Target SDE Connection File')}
              />
            </div>
          </div>
        );

      case 'fc-comparison':
        return (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeftRight size={14} className="text-accent-dark" /> Local Machine Data
              </h4>
              <InputField 
                label="Source Dataset"
                sub="Source feature class path"
                value={config.sourceDataset}
                icon={Database}
                placeholder="C:\Data\Source.gdb\FeatureClass"
                onChange={(v: string) => onChange({ sourceDataset: v })}
                onFileClick={() => openBrowser('sourceDataset', 'gdb', 'Browse Source Dataset')}
              />
              <InputField 
                label="Target Dataset"
                sub="Target feature class path"
                value={config.targetDataset}
                icon={Database}
                placeholder="C:\Data\Target.gdb\FeatureClass"
                onChange={(v: string) => onChange({ targetDataset: v })}
                onFileClick={() => openBrowser('targetDataset', 'gdb', 'Browse Target Dataset')}
              />
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">Comparison Mode</h4>
              <div className="space-y-3">
                {[
                  { id: 'schema', title: 'Schema Comparison', desc: 'Compare field definitions and geometry types' },
                  { id: 'attribute', title: 'Attribute Comparison', desc: 'Identify data value discrepancies' },
                  { id: 'spatial', title: 'Spatial Comparison', desc: 'Check topology and coordinate shifts' }
                ].map(type => (
                  <label key={type.id} className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${config.comparisonType === type.id ? 'border-accent-dark bg-accent-light/5 dark:bg-accent-dark/5 shadow-sm ring-1 ring-accent-dark/10' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                    <div className="mt-0.5">
                      <input 
                        type="radio" 
                        name="compType" 
                        className="w-4 h-4 text-accent-dark border-slate-300 dark:border-slate-600 focus:ring-accent-dark/20" 
                        checked={config.comparisonType === type.id} 
                        onChange={() => onChange({ comparisonType: type.id as any })}
                      />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 mb-0.5 uppercase tracking-wide">{type.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{type.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'portal-extract':
        return (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
             <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
               <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                 <Globe size={14} className="text-accent-dark" /> Portal Credentials
               </h4>
               <InputField 
                  label="Portal URL"
                  sub="ArcGIS Online or Enterprise URL"
                  value={config.portalUrl}
                  icon={Globe}
                  error={urlError}
                  isFile={false}
                  placeholder="https://www.arcgis.com"
                  onChange={(v: string) => onChange({ portalUrl: v })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField 
                    label="Username"
                    sub="Account user"
                    value={config.portalUser}
                    icon={User}
                    isFile={false}
                    placeholder="User_Name"
                    onChange={(v: string) => onChange({ portalUser: v })}
                  />
                  <InputField 
                    label="Password"
                    sub="Account password"
                    value={config.portalPass}
                    icon={Lock}
                    isFile={false}
                    placeholder="••••••••"
                    onChange={(v: string) => onChange({ portalPass: v })}
                  />
                </div>
             </div>
             <InputField 
                label="Local Excel File Output"
                sub="Destination path for the content inventory"
                value={config.outputFolder + '\\portal_items.xls'}
                icon={FileSpreadsheet}
                onFileClick={() => openBrowser('portalExcel', 'folder', 'Choose Output Location')}
                placeholder="C:\Results\portal_items.xls"
                onChange={(v: string) => onChange({ outputFolder: v.substring(0, v.lastIndexOf('\\')) })}
              />
          </div>
        );

      default:
        return <div className="text-slate-400 italic text-sm p-12 text-center">Select a tool to continue configuration...</div>;
    }
  };

  const getExecuteLabel = () => {
    switch(activeView) {
      case 'gdb-extract': return 'Execute Extraction';
      case 'sde-to-sde': return 'Execute Migration';
      case 'fc-comparison': return 'Run Comparison';
      case 'portal-extract': return 'Extract Portal Items';
      default: return 'Execute';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col relative overflow-hidden transition-colors">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-8 tracking-tight">
        {activeView === 'sde-to-sde' ? 'Database Migration' : (activeView === 'fc-comparison' ? 'Quality Comparison' : 'Tool Configuration')}
      </h3>

      {renderContent()}

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
        <button
          onClick={onExecute}
          disabled={isExecuting || !!urlError}
          className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-white transition-all text-xs uppercase tracking-[0.15em] shadow-lg shadow-accent/20 active:scale-[0.98] ${
            isExecuting || !!urlError
              ? 'bg-accent/40 cursor-not-allowed shadow-none' 
              : 'bg-accent-dark hover:bg-[#25a99e] shadow-accent/30'
          }`}
        >
          {isExecuting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          <span>{getExecuteLabel()}</span>
        </button>
        <button 
          onClick={() => onChange(DEFAULT_CONFIG)}
          className="border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all shadow-sm active:scale-[0.95]"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
      </div>

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
