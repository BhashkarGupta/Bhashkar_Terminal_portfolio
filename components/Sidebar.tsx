import React from 'react';
import { useAppContext } from '../App';
import { ShellMode, ThemeMode } from '../types';
import { Folder, FileCode, Server, Database, User, Shield, Terminal, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  borderColor: string;
  bgColor: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, borderColor, bgColor }) => {
  const { shellMode, themeMode, toggleShell, toggleTheme } = useAppContext();
  const isBash = shellMode === ShellMode.BASH;
  const isDark = themeMode === ThemeMode.DARK;

  const navItems = [
    { id: 'about', label: isBash ? 'whoami' : 'WhoAmI', icon: User },
    { id: 'experience', label: isBash ? 'history' : 'Get-History', icon: Server },
    { id: 'projects', label: isBash ? 'list_repos' : 'Get-ChildItem', icon: FileCode },
    { id: 'skills', label: isBash ? 'print_env' : 'Get-Variable', icon: Database },
  ];

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 border-r ${borderColor} ${bgColor}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        pt-20 md:pt-0
      `}
    >
      <div className="h-full flex flex-col p-4">
        <div className="text-sm font-bold opacity-50 mb-4 px-2 tracking-widest uppercase">
          Explorer
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-2 px-2 py-2 opacity-70 cursor-default">
             <Folder size={16} className="shrink-0" />
             <span className="font-bold truncate" title={isBash ? '/root' : 'C:\\Users\\Administrator'}>
                {isBash ? 'root' : 'C:\\Users\\Administrator'}
             </span>
          </div>
          
          <ul className="pl-4 border-l border-opacity-20 border-current ml-3 space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left opacity-70 hover:opacity-100 hover:bg-white/5 rounded group"
                >
                  <item.icon size={15} className={`shrink-0 ${isBash ? 'text-blue-400' : 'text-yellow-400'} group-hover:scale-110 transition-transform`} />
                  <span className="truncate">{item.label}</span>
                  <span className="opacity-0 group-hover:opacity-30 text-xs ml-auto shrink-0">{isBash ? '.sh' : '.ps1'}</span>
                </button>
              </li>
            ))}
            <li className="mt-4 pt-4 border-t border-current border-opacity-10">
               <div className="flex items-center gap-2 px-2 py-2 opacity-50 text-xs">
                 <Shield size={14} className="shrink-0" />
                 <span className="truncate">SecurityContext: Privileged</span>
               </div>
            </li>
          </ul>
        </div>

        {/* Mobile Settings Panel (Visible only on mobile since main header toggles are hidden) */}
        <div className="md:hidden mt-4 pt-4 border-t border-current border-opacity-10">
            <div className="text-[10px] font-bold opacity-40 mb-3 uppercase tracking-widest">
                System Config
            </div>
            <div className="grid grid-cols-2 gap-2">
                 <button 
                    onClick={toggleShell}
                    className={`flex items-center justify-center gap-2 px-2 py-2 rounded border border-current border-opacity-20 text-xs font-bold transition-all hover:bg-white/5 ${isBash ? 'bg-white/5' : ''}`}
                 >
                    <Terminal size={14} />
                    {isBash ? 'BASH' : 'PS'}
                 </button>
                 <button 
                    onClick={toggleTheme}
                    className={`flex items-center justify-center gap-2 px-2 py-2 rounded border border-current border-opacity-20 text-xs font-bold transition-all hover:bg-white/5 ${isDark ? 'bg-white/5' : ''}`}
                 >
                    {isDark ? <Moon size={14} /> : <Sun size={14} />}
                    {isDark ? 'DARK' : 'LGHT'}
                 </button>
            </div>
        </div>
      </div>
    </aside>
  );
};