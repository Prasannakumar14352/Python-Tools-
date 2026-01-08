
import React, { useState } from 'react';
import { 
  Folder, 
  Database, 
  ChevronRight, 
  Search, 
  X, 
  HardDrive, 
  ChevronLeft,
  Check
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

  const handleConfirm = () => {
    if (mode === 'folder') {
      onSelect(currentPath);
    } else if (selectedItem) {
      onSelect(selectedItem);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <HardDrive size={12} className="text-slate-400" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{currentPath}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-4">
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
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-4 custom-scrollbar">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => handleItemClick(item)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group
                ${selectedItem === item.path 
                  ? 'bg-accent-light/10 border-accent-dark' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}
              `}
            >
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors
                ${item.type === 'gdb' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-accent-dark'}
              `}>
                {item.type === 'gdb' ? <Database size={24} /> : <Folder size={24} />}
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-center truncate w-full px-2">
                {item.name}
              </span>
              {selectedItem === item.path && (
                <div className="mt-2 text-[9px] font-bold text-accent-dark uppercase tracking-widest flex items-center gap-1">
                  <Check size={10} /> Selected
                </div>
              )}
            </button>
          ))}
          {items.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center opacity-30 italic">
              <Folder size={48} strokeWidth={1} className="mb-2" />
              <span className="text-sm">Folder is empty</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div className="flex-1 mr-4 overflow-hidden">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Selected Location:</span>
            <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate mt-0.5">
              {selectedItem || (mode === 'folder' ? currentPath : 'No selection')}
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={mode !== 'folder' && !selectedItem}
              className="px-6 py-2 bg-accent-dark text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#25a99e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/20"
            >
              Select {mode === 'folder' ? 'Folder' : 'Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileBrowserModal;
