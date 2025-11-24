
import React, { useState } from 'react';
import { useAppContext, ViewType } from '../App';
import { ShellMode, ThemeMode } from '../types';
import { Folder, FileCode, Server, Database, User, Shield, Terminal, Moon, Sun, Home, ChevronLeft, ChevronRight, Award, Mail, FileText } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  borderColor: string;
  bgColor: string;
  width: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, borderColor, bgColor, width }) => {
  const { shellMode, themeMode, activeView, setActiveView, toggleShell, toggleTheme } = useAppContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isBash = shellMode === ShellMode.BASH;
  const isDark = themeMode === ThemeMode.DARK;

  const navItems: { id: ViewType; label: string; icon: any }[] = [
    { id: 'home', label: isBash ? 'init.sh' : 'Start-Process', icon: Home },
    { id: 'about', label: isBash ? 'whoami' : 'WhoAmI', icon: User },
    { id: 'experience', label: isBash ? 'history' : 'Get-History', icon: Server },
    { id: 'projects', label: isBash ? 'list_repos' : 'Get-ChildItem', icon: FileCode },
    { id: 'certifications', label: isBash ? 'apt list' : 'Get-Package', icon: Award },
    { id: 'skills', label: isBash ? 'print_env' : 'Get-Variable', icon: Database },
    { id: 'contact', label: isBash ? 'contact.sh' : 'Send-MailMessage', icon: Mail },
    { id: 'resume', label: isBash ? 'wget resume.pdf' : 'Invoke-WebRequest', icon: FileText },
  ];

  const handleNavClick = (id: ViewType) => {
    setActiveView(id);
    setIsOpen(false);
  };

  const currentWidth = isCollapsed ? 60 : width;
  
  // Safe calculation for style width to avoid SSR/Initial render issues on mobile
  const sidebarStyle = {
    width: isOpen ? '16rem' : ((typeof window !== 'undefined' && window.innerWidth >= 768) ? `${currentWidth}px` : '16rem')
  };

  return (
    <aside 
      style={sidebarStyle}
      className={`
        fixed inset-y-0 left-0 z-40 transform transition-[width,transform] duration-300 ease-in-out
        md:relative md:translate-x-0 border-r ${borderColor} ${bgColor}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        pt-20 md:pt-0 flex flex-col
      `}
    >
      <div className="flex-1 flex flex-col p-4 overflow-y-auto no-scrollbar overflow-x-hidden">
        {/* Header / Collapse Toggle */}
        <div className="flex items-center justify-between mb-6 px-1">
           {!isCollapsed && (
             <div className="text-sm font-bold opacity-50 tracking-widest uppercase whitespace-nowrap">
               Script Explorer
             </div>
           )}
           <button 
             onClick={() => setIsCollapsed(!isCollapsed)}
             className="hidden md:block p-1 hover:bg-white/10 rounded transition-colors ml-auto"
             title={isCollapsed ? "Expand" : "Collapse"}
           >
             {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
           </button>
        </div>
        
        {/* Root Folder Display */}
        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-2 py-2 opacity-70 cursor-default mb-2">
             <Folder size={16} className="shrink-0" />
             <span className="font-bold truncate" title={isBash ? '/root/scripts' : 'C:\\Users\\Administrator\\Scripts'}>
                {isBash ? 'root/scripts' : 'C:\\Users\\Admin\\Scripts'}
             </span>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
             <Folder size={20} className="opacity-70" />
          </div>
        )}
        
        {/* Nav Items */}
        <ul className={`${!isCollapsed ? 'pl-4 border-l border-opacity-20 border-current ml-3' : ''} space-y-1`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => handleNavClick(item.id)}
                className={`
                  flex items-center gap-3 w-full px-2 py-2 text-sm text-left rounded group transition-all
                  ${activeView === item.id 
                    ? (isDark ? 'bg-white/10 text-white font-bold' : 'bg-black/10 text-black font-bold') 
                    : 'opacity-70 hover:opacity-100 hover:bg-white/5'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon size={18} className={`shrink-0 ${activeView === item.id ? (isBash ? 'text-green-400' : 'text-blue-400') : (isBash ? 'text-blue-400' : 'text-yellow-400')} group-hover:scale-110 transition-transform`} />
                {!isCollapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    <span className={`opacity-0 group-hover:opacity-30 text-xs shrink-0 ${activeView === item.id ? 'opacity-30' : ''}`}>
                      {isBash ? '.sh' : '.ps1'}
                    </span>
                  </>
                )}
              </button>
            </li>
          ))}
          <li className={`mt-4 pt-4 ${!isCollapsed ? 'border-t border-current border-opacity-10' : ''}`}>
             {!isCollapsed ? (
               <div className="flex items-center gap-2 px-2 py-2 opacity-50 text-xs">
                 <Shield size={14} className="shrink-0" />
                 <span className="truncate">SecurityContext: Privileged</span>
               </div>
             ) : (
               <div className="flex justify-center" title="SecurityContext: Privileged">
                 <Shield size={16} className="opacity-50" />
               </div>
             )}
          </li>
        </ul>
      </div>

      {/* Mobile Settings Panel (Hidden on Desktop) */}
      <div className="md:hidden p-4 border-t border-current border-opacity-10">
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
    </aside>
  );
};
