
import React, { useState } from 'react';
import { AppConfig } from '../types';
// Add missing import for DEFAULT_CONFIG
import { DEFAULT_CONFIG } from '../constants';
import { 
  Terminal, 
  Settings as SettingsIcon, 
  Play, 
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  RotateCcw,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface SettingsViewProps {
  config: AppConfig;
  onChange: (updates: Partial<AppConfig>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ config, onChange }) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const handleTestInterpreter = () => {
    setTestStatus('testing');
    setTimeout(() => {
      // Mock validation: success if path contains 'python'
      if (config.interpreterPath.toLowerCase().includes('python')) {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure global application parameters and environment config</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Python Environment Section */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Terminal size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Python Environment</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Python Interpreter Path</label>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Specify the absolute path to your Python executable (e.g., C:\Python39\python.exe or ArcGIS Pro environment)</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={config.interpreterPath}
                  onChange={(e) => {
                    onChange({ interpreterPath: e.target.value });
                    setTestStatus('idle');
                  }}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 focus:border-accent-dark transition-all"
                  placeholder="C:\Program Files\ArcGIS\Pro\bin\Python\envs\arcgispro-py3\python.exe"
                />
                <button 
                  onClick={handleTestInterpreter}
                  disabled={testStatus === 'testing' || !config.interpreterPath}
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 transition-all shadow-sm active:scale-[0.98] ${
                    testStatus === 'testing' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' :
                    testStatus === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' :
                    testStatus === 'failed' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800' :
                    'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {testStatus === 'testing' ? (
                    <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                  ) : testStatus === 'success' ? (
                    <CheckCircle2 size={14} />
                  ) : testStatus === 'failed' ? (
                    <XCircle size={14} />
                  ) : (
                    <Play size={14} />
                  )}
                  {testStatus === 'testing' ? 'Validating...' : 
                   testStatus === 'success' ? 'Valid' : 
                   testStatus === 'failed' ? 'Invalid Path' : 'Test Connection'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Display Settings Section */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
              <Sun size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Display Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => onChange({ theme: 'light' })}
              className={`flex items-start gap-4 p-5 border rounded-2xl transition-all text-left ${config.theme === 'light' ? 'border-accent-dark bg-accent-light/5 shadow-sm ring-1 ring-accent-dark/10' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${config.theme === 'light' ? 'border-accent-dark bg-accent-dark' : 'border-slate-300 dark:border-slate-600'}`}>
                {config.theme === 'light' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 mb-1 uppercase tracking-wide flex items-center gap-2">
                  <Sun size={14} className="text-amber-500" /> Light Mode
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Bright and clean interface for high-lit environments.</div>
              </div>
            </button>

            <button 
              onClick={() => onChange({ theme: 'dark' })}
              className={`flex items-start gap-4 p-5 border rounded-2xl transition-all text-left ${config.theme === 'dark' ? 'border-accent-dark bg-accent-light/5 shadow-sm ring-1 ring-accent-dark/10' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
            >
              <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${config.theme === 'dark' ? 'border-accent-dark bg-accent-dark' : 'border-slate-300 dark:border-slate-600'}`}>
                {config.theme === 'dark' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 mb-1 uppercase tracking-wide flex items-center gap-2">
                  <Moon size={14} className="text-indigo-400" /> Dark Mode
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Modern dark aesthetic, easier on the eyes in low light.</div>
              </div>
            </button>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg">
              <Trash2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight text-red-800 dark:text-red-400">Danger Zone</h3>
          </div>
          <div className="flex items-center justify-between p-4 border border-red-100 dark:border-red-900/30 bg-red-50/20 dark:bg-red-950/10 rounded-xl">
            <div>
              <div className="text-[11px] font-bold text-red-900 dark:text-red-400 uppercase">Reset Application Data</div>
              <div className="text-[10px] text-red-700/70 dark:text-red-400/60">Clear all saved paths, credentials, and configuration history.</div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white text-[11px] font-bold rounded-lg hover:bg-red-700 transition-all shadow-sm shadow-red-200 dark:shadow-red-950/50">
              Reset Everything
            </button>
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button 
          onClick={() => onChange(DEFAULT_CONFIG)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          <RotateCcw size={14} /> Discard Changes
        </button>
        <button className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-accent-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#25a99e] transition-all shadow-lg shadow-accent/20">
          <Save size={14} /> Save Configuration
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
