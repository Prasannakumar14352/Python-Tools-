
import React from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  RefreshCw, 
  ArrowLeftRight, 
  History,
  Clock,
  Wand2,
  Settings
} from 'lucide-react';

interface DashboardViewProps {
  onQuickAction: (viewId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onQuickAction }) => {
  const stats = [
    { label: 'Python Backend', value: 'Not Configured', sub: 'Configure in Settings', icon: Terminal, color: 'slate' },
    { label: 'Total Jobs', value: '0', sub: 'Recent executions', icon: Play, color: 'slate' },
    { label: 'Successful', value: '0', sub: 'Completed successfully', icon: CheckCircle2, color: 'emerald' },
    { label: 'Failed', value: '0', sub: 'Need attention', icon: AlertCircle, color: 'red' },
  ];

  const quickActions = [
    { id: 'gdb-extract', label: 'GDB Extraction', sub: 'Extract data from Geodatabase', icon: Database },
    { id: 'sde-to-sde', label: 'SDE to SDE', sub: 'Migrate feature classes', icon: RefreshCw },
    { id: 'fc-comparison', label: 'FC Comparison', sub: 'Compare datasets', icon: ArrowLeftRight },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h2>
        <p className="text-sm text-slate-500">Welcome to GIS Hub Automation Toolbox</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-accent transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  {stat.label === 'Python Backend' ? (
                    <div className="py-1 px-3 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 w-fit">Not Configured</div>
                  ) : (
                    <div className={`text-2xl font-bold ${stat.color === 'emerald' ? 'text-emerald-500' : stat.color === 'red' ? 'text-red-500' : 'text-slate-800'}`}>
                      {stat.value}
                    </div>
                  )}
                </div>
                <Icon size={24} strokeWidth={1.5} className="text-slate-300" />
              </div>
              {stat.label === 'Python Backend' ? (
                <button className="text-[10px] font-bold text-accent-dark hover:underline">Configure in Settings</button>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">{stat.sub}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">Quick Actions</h3>
          <p className="text-xs text-slate-400 mb-6">Start a new job</p>
          <div className="space-y-3">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onQuickAction(action.id)}
                  className="w-full flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all group hover:border-accent-light"
                >
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 group-hover:text-accent-dark rounded-lg flex items-center justify-center transition-colors shadow-sm">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-slate-700 group-hover:text-accent-dark transition-colors">{action.label}</div>
                    <div className="text-[10px] text-slate-400">{action.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 tracking-tight">Recent Jobs</h3>
              <p className="text-xs text-slate-400">Latest executions</p>
            </div>
            <button 
              onClick={() => onQuickAction('job-history')}
              className="text-[11px] font-bold text-slate-500 px-3 py-1 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4 py-8">
            <Clock size={48} strokeWidth={1} className="opacity-20" />
            <div className="text-center">
              <div className="text-sm font-bold text-slate-500">No jobs executed yet</div>
              <div className="text-[11px]">Start by running an automated tool</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Required Alert */}
      <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl flex gap-4 items-start shadow-sm">
        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
          <AlertCircle size={18} />
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-orange-900 tracking-tight">Python Backend Required</h4>
            <p className="text-[11px] text-orange-800/80 leading-relaxed max-w-2xl">
              To execute GIS operations, you need to set up the Python/ArcPy backend on your server. 
              The backend provides the necessary geoprocessing engine for all toolbox scripts.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-accent-dark text-white text-[11px] font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-accent-dark/90 shadow-sm shadow-accent/20 transition-all active:scale-[0.98]">
              <Wand2 size={14} /> Setup Wizard
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <Settings size={14} /> Go to Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
