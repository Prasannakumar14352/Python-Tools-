
import React from 'react';
import { GISScript, ExecutionStatus } from '../types';

interface ScriptCardProps {
  script: GISScript;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, isSelected, onToggle, disabled }) => {
  const isFailed = script.status === ExecutionStatus.FAILED;
  const isRunning = script.status === ExecutionStatus.RUNNING;
  const isFinished = script.status === ExecutionStatus.SUCCESS;

  const getStatusDisplay = () => {
    switch (script.status) {
      case ExecutionStatus.RUNNING: return <span className="text-blue-600 dark:text-blue-400 animate-pulse">Working...</span>;
      case ExecutionStatus.SUCCESS: return <span className="text-emerald-600 dark:text-emerald-400 font-bold">Finished</span>;
      case ExecutionStatus.FAILED: return <span className="text-red-600 dark:text-red-400 font-bold">Error Found</span>;
      case ExecutionStatus.SKIPPED: return <span className="text-slate-400 dark:text-slate-500 italic">Cancelled</span>;
      case ExecutionStatus.PENDING: return <span className="text-slate-400 dark:text-slate-500 italic">In Queue</span>;
      default: return null;
    }
  };

  return (
    <div 
      onClick={() => !disabled && onToggle()}
      className={`
        relative p-5 rounded-xl border transition-all cursor-pointer select-none group h-full flex flex-col
        ${isFailed 
          ? 'bg-red-50 dark:bg-red-950/20 border-red-500 shadow-lg shadow-red-500/10 ring-1 ring-red-500/20' 
          : isSelected 
            ? 'bg-blue-50 dark:bg-blue-600/10 border-blue-500 shadow-md ring-1 ring-blue-500/20' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
        ${disabled && !isRunning && !isFailed ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`
          w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow-sm
          ${isFailed ? 'bg-red-600 text-white' : isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}
        `}>
          {script.icon}
        </div>
        <div className={`
          w-5 h-5 rounded-full border flex items-center justify-center transition-all
          ${isFailed ? 'bg-red-600 border-red-600' : isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-700'}
        `}>
          {(isSelected || isFailed) && <span className="text-[10px] text-white font-bold">{isFailed ? '!' : '✓'}</span>}
        </div>
      </div>
      
      <h3 className={`font-bold mb-1 text-sm ${isFailed ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors'}`}>
        {script.name}
      </h3>
      
      {script.scriptPath && (
        <p className="text-[9px] font-mono text-slate-400 mb-2 truncate opacity-70" title={script.scriptPath}>
          File: {script.scriptPath.split('\\').pop() || script.scriptPath.split('/').pop()}
        </p>
      )}

      {isFailed && script.error ? (
        <div className="text-[10px] text-red-600 dark:text-red-300 bg-red-100/50 dark:bg-red-950/50 p-2.5 rounded-lg border border-red-200 dark:border-red-900 mb-3 animate-in fade-in slide-in-from-top-1">
          <span className="font-bold block mb-0.5">Execution Failed:</span>
          {script.error}
        </div>
      ) : (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {script.description}
        </p>
      )}

      {isRunning && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3 shadow-inner">
          <div 
            className="bg-blue-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            style={{ width: `${script.progress || 0}%` }}
          />
        </div>
      )}
      
      <div className="text-[10px] font-bold uppercase tracking-widest mt-auto border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center min-h-[1.5rem]">
        <div className="flex items-center gap-2">
          {getStatusDisplay()}
        </div>
        {isRunning && <span className="font-mono text-blue-600 dark:text-blue-400">{script.progress || 0}%</span>}
      </div>
    </div>
  );
};

export default ScriptCard;
