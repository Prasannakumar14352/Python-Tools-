
import React, { useState } from 'react';
import { AppConfig } from '../types';
import { FEATURE_CLASSES_MOCK, DEFAULT_CONFIG } from '../constants';
import { 
  Database, 
  FolderOpen, 
  Info, 
  RefreshCw, 
  ArrowRight,
  ArrowLeftRight,
  ChevronRight,
  Globe,
  User,
  Lock,
  FileSpreadsheet,
  Play,
  RotateCcw
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

  const simulateSaveAs = (key: keyof AppConfig, defaultValue: string) => {
    const fileName = prompt("Enter output filename:", defaultValue.split('\\').pop());
    if (fileName) {
      const newPath = `C:\\output\\${fileName.endsWith('.xls') ? fileName : fileName + '.xls'}`;
      onChange({ [key]: newPath });
    }
  };

  const InputField = ({ label, value, sub, placeholder, icon: Icon, onChange: onValChange, error, isFile = true, onFileClick }: any) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{label}</label>
        <Info size={12} className="text-slate-300 cursor-help" />
      </div>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
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
              className={`w-full bg-slate-50 border ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-accent-dark/20 focus:border-accent-dark'} rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-600 focus:outline-none focus:ring-2 transition-all`}
              placeholder={placeholder}
            />
          </div>
          {isFile && (
            <button 
              onClick={onFileClick}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 rounded-lg text-slate-500 transition-colors shadow-sm active:scale-[0.97]"
            >
              <FolderOpen size={16} />
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
        return (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            <InputField 
              label="Source Geodatabase"
              sub="Path to the source File Geodatabase (.gdb)"
              value={config.sourceGdb}
              icon={Database}
              placeholder="C:\Data\MyDatabase.gdb"
              onChange={(v: string) => onChange({ sourceGdb: v })}
            />
            <div className="border-2 border-dashed border-slate-100 rounded-2xl py-12 px-6 flex flex-col items-center justify-center bg-slate-50/20 text-center space-y-3">
              <Database size={32} strokeWidth={1} className="text-slate-200" />
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Select a geodatabase to view feature classes</span>
            </div>
            <InputField 
              label="Output Folder"
              sub="Destination folder for extracted files"
              value={config.outputFolder}
              icon={FolderOpen}
              placeholder="C:\output\Shapefiles"
              onChange={(v: string) => onChange({ outputFolder: v })}
            />
          </div>
        );

      case 'sde-to-sde':
        return (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-8">
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <RefreshCw size={14} className="text-accent-dark" /> Connection Settings
              </h4>
              <InputField 
                label="Source SDE Connection"
                sub="Connection string for source SDE"
                value={config.sdeConnection}
                icon={RefreshCw}
                placeholder="server:5151/database@user"
                onChange={(v: string) => onChange({ sdeConnection: v })}
              />
              <div className="flex justify-center py-2">
                <div className="p-2 bg-slate-50 rounded-full text-slate-300">
                  <ArrowRight size={18} />
                </div>
              </div>
              <InputField 
                label="Target SDE Connection"
                sub="Connection string for target SDE"
                value={config.targetSdeConnection}
                icon={RefreshCw}
                placeholder="server:5151/database@user"
                onChange={(v: string) => onChange({ targetSdeConnection: v })}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Feature Classes</h4>
                <button className="text-[10px] font-bold text-accent-dark hover:underline">Select All</button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {FEATURE_CLASSES_MOCK.map((fc, i) => (
                  <div key={i} className="group flex items-center justify-between p-3 border border-slate-50 rounded-xl bg-slate-50/30 hover:bg-accent-light/10 hover:border-accent-light transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-accent-dark focus:ring-accent-dark/20" />
                      <span className="text-[11px] font-bold text-slate-700">{fc.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{fc.rows} rows</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'fc-comparison':
        return (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <ArrowLeftRight size={14} className="text-accent-dark" /> Data Sources
              </h4>
              <InputField 
                label="Source Dataset"
                sub="Source feature class or table"
                value={config.sourceDataset}
                icon={Database}
                placeholder="C:\Data\Source.gdb\FeatureClass"
                onChange={(v: string) => onChange({ sourceDataset: v })}
              />
              <InputField 
                label="Target Dataset"
                sub="Target feature class or table to compare against"
                value={config.targetDataset}
                icon={Database}
                placeholder="C:\Data\Target.gdb\FeatureClass"
                onChange={(v: string) => onChange({ targetDataset: v })}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Comparison Mode</h4>
              <div className="space-y-3">
                {[
                  { id: 'schema', title: 'Schema Comparison', desc: 'Compare field definitions, data types, and geometry types' },
                  { id: 'attribute', title: 'Attribute Comparison', desc: 'Compare attribute values and identify differences' },
                  { id: 'spatial', title: 'Spatial Comparison', desc: 'Compare geometry accuracy and topology' }
                ].map(type => (
                  <label key={type.id} className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${config.comparisonType === type.id ? 'border-accent-dark bg-accent-light/5 shadow-sm' : 'border-slate-50 hover:bg-slate-50 hover:border-slate-200'}`}>
                    <div className="mt-0.5">
                      <input 
                        type="radio" 
                        name="compType" 
                        className="w-4 h-4 text-accent-dark border-slate-300 focus:ring-accent-dark/20" 
                        checked={config.comparisonType === type.id} 
                        onChange={() => onChange({ comparisonType: type.id as any })}
                      />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800 mb-0.5 uppercase tracking-wide">{type.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-relaxed">{type.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'portal-extract':
        return (
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-8">
               <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
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
                label="Output Excel File"
                sub="Destination path for the content inventory"
                value={config.outputFolder + '\\portal_items.xls'}
                icon={FileSpreadsheet}
                onFileClick={() => simulateSaveAs('outputFolder', config.outputFolder + '\\portal_items.xls')}
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
    <div className="bg-panel p-8 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col relative overflow-hidden">
      <h3 className="text-lg font-bold text-slate-800 mb-8 tracking-tight">
        {activeView === 'sde-to-sde' ? 'Configuration' : (activeView === 'fc-comparison' ? 'Job Options' : 'Configuration')}
      </h3>

      {renderContent()}

      <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
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
          className="border border-slate-200 p-3.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all shadow-sm active:scale-[0.95]"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfigurationPanel;
