
import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  RefreshCw, 
  ArrowLeftRight, 
  Globe, 
  History, 
  Settings,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (viewId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', sub: 'Overview & quick actions', icon: LayoutDashboard },
    { id: 'gdb-extract', label: 'GDB Extraction', sub: 'Extract from Geodatabase', icon: Database },
    { id: 'sde-to-sde', label: 'SDE to SDE', sub: 'Migrate feature classes', icon: RefreshCw },
    { id: 'fc-comparison', label: 'FC Comparison', sub: 'Compare datasets', icon: ArrowLeftRight },
    { id: 'portal-extract', label: 'Portal Extract', sub: 'Export Portal items', icon: Globe },
    { id: 'job-history', label: 'Job History', sub: 'View past executions', icon: History },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-dark rounded-lg flex items-center justify-center text-white shadow-sm">
            <Globe size={18} />
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-800 tracking-tight">GIS Hub</h1>
            <span className="text-[9px] text-slate-500 font-medium tracking-wide">Automation Toolbox</span>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-500 transition-colors">
          <ChevronLeft size={16} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-accent-light/20 text-accent-dark' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className={`flex items-center justify-center w-6 ${isActive ? 'text-accent-dark' : 'text-slate-400'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <div>
                <div className={`text-[11px] font-bold leading-none mb-1 ${isActive ? 'text-accent-dark' : 'text-slate-700'}`}>
                  {item.label}
                </div>
                <div className="text-[9px] text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-36">
                  {item.sub}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => onViewChange('settings')}
          className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${
            activeView === 'settings' 
              ? 'bg-accent-light/20 text-accent-dark' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Settings size={20} className={activeView === 'settings' ? 'text-accent-dark' : 'text-slate-500'} />
          <span className={`text-[11px] font-bold uppercase tracking-wider ${activeView === 'settings' ? 'text-accent-dark' : 'text-slate-700'}`}>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
