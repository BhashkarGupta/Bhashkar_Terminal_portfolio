import React, { useState } from 'react';
import { useAppContext } from '../App';
import { ShellMode, ThemeMode } from '../types';
import { BASH_PROMPT, PS_PROMPT } from '../constants';
import { Sidebar } from './Sidebar';
import { ContentArea } from './ContentArea';
import { Menu, Terminal, Moon, Sun, ToggleLeft, ToggleRight } from 'lucide-react';

export const Layout: React.FC = () => {
  const { shellMode, themeMode, toggleShell, toggleTheme } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Styles based on Shell and Theme
  const isBash = shellMode === ShellMode.BASH;
  const isDark = themeMode === ThemeMode.DARK;

  // Base background colors
  const bgColor = isDark 
    ? (isBash ? 'bg-[#0c0c0c]' : 'bg-[#012456]') 
    : 'bg-[#fdf6e3]'; // Solarized Light-ish
  
  const textColor = isDark 
    ? (isBash ? 'text-green-400' : 'text-gray-100') 
    : 'text-slate-800';

  const borderColor = isDark ? 'border-gray-700' : 'border-gray-300';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgColor} ${textColor} flex flex-col md:flex-row overflow-hidden font-mono`}>
      
      {/* Top Bar (Mobile) / Header Strip (Desktop) */}
      <div className={`md:hidden p-4 border-b ${borderColor} flex justify-between items-center sticky top-0 z-50 ${bgColor}`}>
        <div className="flex items-center gap-2">
           {isBash ? <Terminal size={18} /> : <div className="font-bold text-lg px-1 border border-current">PS</div>}
           <span className="text-xs md:text-sm truncate">
             {isBash ? BASH_PROMPT : PS_PROMPT}
           </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          <Menu />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
        borderColor={borderColor}
        bgColor={bgColor}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* IDE Toolbar / Status Bar */}
        <header className={`h-14 border-b ${borderColor} flex items-center justify-between px-6 shrink-0 bg-opacity-90 backdrop-blur-sm z-40`}>
          <div className="hidden md:flex items-center gap-4 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full bg-red-500`}></span>
              <span className={`w-3 h-3 rounded-full bg-yellow-500`}></span>
              <span className={`w-3 h-3 rounded-full bg-green-500`}></span>
            </div>
            <div className="ml-4 font-bold tracking-wider">
               {isBash ? 'BASH_TERMINAL' : 'POWERSHELL_ADMIN'}
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
             {/* Shell Switcher */}
            <button 
              onClick={toggleShell}
              className={`flex items-center gap-2 px-3 py-1 rounded border transition-all hover:bg-white/10 ${borderColor}`}
            >
              <div className="relative w-8 h-4 bg-gray-600 rounded-full flex items-center p-0.5">
                 <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${isBash ? 'translate-x-0' : 'translate-x-4'}`}></div>
              </div>
              <span className="text-xs font-bold w-8 text-center">{isBash ? 'SH' : 'PS'}</span>
            </button>

            {/* Theme Switcher */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-white/10 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-12 pb-32">
          <ContentArea />
          
          <footer className={`mt-20 py-8 border-t ${borderColor} text-center opacity-60 text-sm`}>
            <p>Built by Bhashkar Gupta | Hosted on GitHub Pages</p>
            <p className="mt-2 text-xs">Mode: {isBash ? 'drwx------' : 'Administrator'}</p>
          </footer>
        </div>
      </main>
    </div>
  );
};