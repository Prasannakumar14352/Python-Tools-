
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { Terminal, Trash2 } from 'lucide-react';

interface ConsoleProps {
  logs: LogEntry[];
  onClear: () => void;
}

const Console: React.FC<ConsoleProps> = ({ logs, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-console rounded-2xl overflow-hidden shadow-xl border border-slate-800">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#1c242d]">
        <div className="flex items-center gap-3 text-slate-300">
          <Terminal size={16} className="text-accent-dark" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">Execution Log</span>
            <span className="text-[9px] text-slate-500 font-medium">System Output: {logs.length} entries</span>
          </div>
        </div>
        <button 
          onClick={onClear}
          title="Clear console"
          className="text-slate-500 hover:text-red-400 transition-all p-1.5 hover:bg-slate-800 rounded-lg active:scale-90"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 font-mono text-[11px] leading-relaxed console-scrollbar bg-console"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
            <Terminal size={40} strokeWidth={1} className="text-slate-600" />
            <span className="text-slate-600 italic tracking-widest uppercase text-[10px] font-bold">Waiting for deployment...</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-3 group">
                <span className="text-slate-600 shrink-0 select-none font-bold">[{log.timestamp}]</span>
                <span className={
                  log.level === 'ERROR' ? 'text-red-400' : 
                  log.level === 'SUCCESS' ? 'text-accent' : 
                  log.level === 'WARNING' ? 'text-amber-400' : 'text-slate-300'
                }>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;
