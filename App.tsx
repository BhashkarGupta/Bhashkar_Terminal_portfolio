
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Layout } from './components/Layout';
import { BootSequence } from './components/BootSequence';
import { ShellMode, ThemeMode } from './types';

export type ViewType = 'home' | 'about' | 'experience' | 'projects' | 'certifications' | 'skills' | 'contact' | 'resume';

interface AppContextType {
  shellMode: ShellMode;
  themeMode: ThemeMode;
  activeView: ViewType;
  toggleShell: () => void;
  toggleTheme: () => void;
  setActiveView: (view: ViewType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('home');

  // Initialize Shell Mode based on OS
  const [shellMode, setShellMode] = useState<ShellMode>(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      // Simple check for Windows. If found, default to PowerShell.
      if (userAgent.indexOf("Win") !== -1) {
        return ShellMode.POWERSHELL;
      }
    }
    // Default to Bash for Mac, Linux, Android, iOS, etc.
    return ShellMode.BASH;
  });

  // Initialize Theme Mode based on system preference
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      // Check if user prefers light mode
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return ThemeMode.LIGHT;
      }
    }
    // Default to Dark
    return ThemeMode.DARK;
  });

  const toggleShell = () => {
    setShellMode(prev => prev === ShellMode.BASH ? ShellMode.POWERSHELL : ShellMode.BASH);
  };

  const toggleTheme = () => {
    setThemeMode(prev => prev === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  // Apply theme class to body
  useEffect(() => {
    const root = window.document.documentElement;
    if (themeMode === ThemeMode.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <AppContext.Provider value={{ shellMode, themeMode, toggleShell, toggleTheme, activeView, setActiveView }}>
      {isLoading ? (
        <BootSequence shellMode={shellMode} onComplete={() => setIsLoading(false)} />
      ) : (
        <Layout />
      )}
    </AppContext.Provider>
  );
}
