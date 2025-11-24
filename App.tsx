import React, { useState, useEffect, createContext, useContext } from 'react';
import { Layout } from './components/Layout';
import { ShellMode, ThemeMode } from './types';

interface AppContextType {
  shellMode: ShellMode;
  themeMode: ThemeMode;
  toggleShell: () => void;
  toggleTheme: () => void;
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
  const [shellMode, setShellMode] = useState<ShellMode>(ShellMode.BASH);
  const [themeMode, setThemeMode] = useState<ThemeMode>(ThemeMode.DARK);

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
    <AppContext.Provider value={{ shellMode, themeMode, toggleShell, toggleTheme }}>
      <Layout />
    </AppContext.Provider>
  );
}