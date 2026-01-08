
import React, { useState } from 'react';
import { 
  Folder, 
  Database, 
  Search, 
  X, 
  HardDrive, 
  ChevronLeft,
  Check,
  Monitor,
  ExternalLink,
  Info
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'folder' | 'gdb' | 'file';
  path: string;
}

interface FileBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  title: string;
  mode: 'file' | 'folder' | 'gdb';
}

const MOCK_FS: Record<string, FileItem[]> = {
  'C:': [
    { name: 'Data', type: 'folder', path: 'C:\\Data' },
    { name: 'Projects', type: 'folder', path: 'C:\\Projects' },
    { name: 'Output', type: 'folder', path: 'C:\\Output' },
    { name: 'Windows', type: 'folder', path: 'C:\\Windows' },
  ],
  'C:\\Data': [
    { name: 'Inventory.gdb', type: 'gdb', path: 'C:\\Data\\Inventory.gdb' },
    { name: 'Basemap.gdb', type: 'gdb', path: 'C:\\Data\\Basemap.gdb' },
    { name: 'Field_Collections', type: 'folder', path: 'C:\\Data\\Field_Collections' },
  ],
  'C:\\Projects': [
    { name: '2024_CityPlanning.gdb', type: 'gdb', path: 'C:\\Projects\\2024_CityPlanning.gdb' },
    { name: 'Utility_Migration', type: 'folder', path: 'C:\\Projects\\Utility_Migration' },
    { name: 'Production_Server.sde', type: 'file', path: 'C:\\Projects\\Production_Server.sde' },
  ],
  'C:\\Output': [
    { name: 'Shapefiles', type: 'folder', path: 'C:\\Output\\Shapefiles' },
    { name: 'Exports', type: 'folder', path: 'C:\\Output\\Exports' },
  ],
  'C:\\Data\\Field_Collections': [
    { name: 'StormWater_Draft.gdb', type: 'gdb', path: 'C:\\Data\\Field_Collections\\StormWater_Draft.gdb' },
  ]
};

const FileBrowserModal: React.FC<FileBrowserModalProps> = ({ isOpen, onClose, onSelect, title, mode }) => {
  const [currentPath, setCurrentPath] = useState('C:');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [manualPath, setManualPath] = useState('');

  if (!isOpen) return null;

  const items = (MOCK_FS[currentPath] || []).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path);
      setSelectedItem(null);
    } else {
      setSelectedItem(item.path);
    }
  };

  const handleBack = () => {
    const parts = currentPath.split('\\');
    if (parts.length > 1) {
      parts.pop();
      setCurrentPath(parts.join('\\'));
      setSelectedItem(null);
    } else if (currentPath !== 'C:') {
      setCurrentPath('C:');
    }
  };

  const pickRealLocalSystem = async () => {
    try {
      if (mode === 'folder' || mode === 'gdb') {
        // @ts-ignore
        const handle = await window.showDirectoryPicker();
        // Browsers don't give full absolute paths for security. 
        // We will "guess" or provide the name and ask the user to confirm.
        const path = `C:\\${handle.name}`;
        onSelect(path);
        onClose();
      } else {
        // @ts-ignore
        const [handle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'GIS Files',
              accept: { 'application/octet-stream': ['.sde', '.gdb', '.lyr', '.mxd'] },
            },
          ],
        });
        const path = `C:\\${handle.name}`;
        onSelect(path);
        onClose();
      }
    } catch (err) {
      console.warn('Local system picker cancelled or not supported', err);
    }
  };

  const handleConfirm = () => {
    const finalPath = manualPath || selectedItem || (mode === 'folder' ? currentPath : null);
    if (finalPath) {
      onSelect(finalPath);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
              <Monitor size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <HardDrive size={12} className="text-slate-400" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{currentPath}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Quick Access Sidebar */}
          <div className="w-48 border-r border-slate-100 dark:border-slate-800 p-4 space-y-2 bg-slate-50/30 dark:bg-slate-900/50 hidden md:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">Quick Access</span>
            {['C:', 'Desktop', 'Documents', 'Downloads'].map(loc => (
              <button 
                key={loc}
                onClick={() => setCurrentPath(loc === 'C:' ? 'C:' : `C:\\Users\\User\\${loc}`)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Folder size={14} className="text-slate-300" /> {loc}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={pickRealLocalSystem}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-accent-dark/10 text-accent-dark rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent-dark/20 transition-all border border-accent-dark/20"
              >
                <ExternalLink size={14} /> Real OS Dialog
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <button 
                onClick={handleBack}
                disabled={currentPath === 'C:'}
                className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search in current folder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 focus:border-accent-dark transition-all"
                />
              </div>
            </div>

            {/* Browser Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
              {items.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group relative
                    ${selectedItem === item.path 
                      ? 'bg-accent-light/10 border-accent-dark ring-1 ring-accent-dark/30 shadow-sm' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all transform group-hover:scale-110
                    ${item.type === 'gdb' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500' : 
                      item.type === 'file' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600' :
                      'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-accent-dark'}
                  `}>
                    {item.type === 'gdb' ? <Database size={24} /> : item.type === 'file' ? <Check size={24} /> : <Folder size={24} />}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-center truncate w-full px-2">
                    {item.name}
                  </span>
                  {selectedItem === item.path && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-accent-dark text-white rounded-full flex items-center justify-center shadow-sm">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
              {items.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center opacity-30 italic">
                  <Folder size={48} strokeWidth={1} className="mb-2 text-slate-400" />
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">No matching items found</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manual Path Entry & Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected or Manual Path Entry</label>
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                <Info size={12} />
                <span className="text-[9px] font-medium italic">Paste path from Windows Explorer if browsing restricted</span>
              </div>
            </div>
            <input 
              type="text" 
              value={manualPath || selectedItem || (mode === 'folder' ? currentPath : '')}
              onChange={(e) => {
                setManualPath(e.target.value);
                setSelectedItem(null);
              }}
              placeholder="e.g. C:\Data\Inventory.gdb"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent-dark/20 focus:border-accent-dark shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button 
              onClick={pickRealLocalSystem}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <Monitor size={14} /> Use OS Dialog
            </button>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                disabled={mode !== 'folder' && !selectedItem && !manualPath}
                className="px-8 py-2 bg-accent-dark text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#25a99e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20 flex items-center gap-2 active:scale-95"
              >
                <Check size={14} /> Select Path
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileBrowserModal;
