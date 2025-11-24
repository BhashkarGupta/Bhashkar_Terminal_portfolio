
import React, { useState, useEffect, useRef } from 'react';
import { ShellMode } from '../types';
import { BASH_BOOT_LOGS, PS_BOOT_LOGS } from '../constants';

interface BootSequenceProps {
  shellMode: ShellMode;
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ shellMode, onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const isBash = shellMode === ShellMode.BASH;
  const sourceLogs = isBash ? BASH_BOOT_LOGS : PS_BOOT_LOGS;

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      // Defensive check: ensure we don't exceed bounds
      if (currentIndex >= sourceLogs.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800); // Small delay after logs finish before hiding
        return;
      }

      const nextLog = sourceLogs[currentIndex];
      if (nextLog) {
          setLogs(prev => [...prev, nextLog]);
      }
      currentIndex++;

      // Auto scroll to bottom
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

    }, 150); // Speed of log appearance

    return () => clearInterval(interval);
  }, [shellMode, sourceLogs, onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col p-4 md:p-10 font-mono text-sm md:text-base overflow-hidden ${isBash ? 'bg-black text-gray-300' : 'bg-[#012456] text-gray-100'}`}>
      {/* Boot Header */}
      <div className="mb-4">
        {isBash ? (
          <div>
            <p>TechFixer Linux Kernel v6.8.1-generic</p>
            <p>Copyright (c) 1991-2024 TechFixer Labs, Inc.</p>
            <p className="mt-2">Booting system...</p>
          </div>
        ) : (
          <div>
            <p>Windows PowerShell</p>
            <p>Copyright (C) Microsoft Corporation. All rights reserved.</p>
            <p className="mt-2">Boot Sequence Initiated...</p>
          </div>
        )}
      </div>

      {/* Logs Area */}
      <div ref={scrollRef} className="flex-1 overflow-hidden flex flex-col justify-end pb-10">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
             {isBash ? (
               <span className="flex gap-2">
                 {/* Defensive check: log must be defined */}
                 {log && log.startsWith('[ OK ]') ? (
                    <>
                      <span className="text-green-500 font-bold">[ OK ]</span>
                      <span>{log.replace('[ OK ]', '').trim()}</span>
                    </>
                 ) : (
                   <span className="opacity-80 ml-1">{log || ''}</span>
                 )}
               </span>
             ) : (
               <span className="flex gap-2">
                 <span className="text-yellow-400">{'>'}</span>
                 <span>{log || ''}</span>
               </span>
             )}
          </div>
        ))}
        <div className="animate-pulse mt-2">_</div>
      </div>
    </div>
  );
};
