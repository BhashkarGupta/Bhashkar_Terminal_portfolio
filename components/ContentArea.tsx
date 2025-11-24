
import React, { useState, useEffect } from 'react';
import { useAppContext, ViewType } from '../App';
import { ShellMode, ThemeMode } from '../types';
import { BASH_PROMPT, PS_PROMPT, BASH_ACCENT, PS_ACCENT } from '../constants';
import { Terminal, ArrowRight, Play } from 'lucide-react';
import { Typewriter } from './Typewriter';

// Define the logical flow of the application
const VIEW_ORDER: ViewType[] = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];

// Reusable component to fade in content line-by-line after header finishes
const AnimatedBlock: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-500 transform ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {children}
    </div>
  );
};

export const ContentArea: React.FC = () => {
  const { shellMode, themeMode, activeView, setActiveView } = useAppContext();
  const isBash = shellMode === ShellMode.BASH;
  const isDark = themeMode === ThemeMode.DARK;

  const cardBg = isDark ? 'bg-white/5' : 'bg-black/5';
  const accentColor = isBash ? BASH_ACCENT : PS_ACCENT;

  // Determine next view for the "Auto Script Execution" prompt
  const currentIndex = VIEW_ORDER.indexOf(activeView);
  const nextView = currentIndex < VIEW_ORDER.length - 1 ? VIEW_ORDER[currentIndex + 1] : null;

  // Key-based re-rendering: When activeView changes, this whole component re-renders
  // allowing us to run the "typing" animation for the command again.
  return (
    <div key={activeView} className="max-w-4xl mx-auto min-h-[calc(100vh-10rem)] flex flex-col">
      
      {/* 1. The Command Execution Line */}
      <CommandBar 
        activeView={activeView} 
        isBash={isBash} 
        isDark={isDark} 
        accentColor={accentColor}
      />

      {/* 2. The Output Area */}
      <div className="flex-1 mt-6 flex flex-col">
        <div className="flex-1">
          {activeView === 'home' && <HomeView accentColor={accentColor} />}
          {activeView === 'about' && <AboutView cardBg={cardBg} />}
          {activeView === 'experience' && <ExperienceView cardBg={cardBg} accentColor={accentColor} isDark={isDark} />}
          {activeView === 'projects' && <ProjectsView cardBg={cardBg} accentColor={accentColor} />}
          {activeView === 'skills' && <SkillsView cardBg={cardBg} accentColor={accentColor} />}
          {activeView === 'contact' && <ContactView isBash={isBash} />}
        </div>

        {/* 3. Mobile "Auto Script" Prompt (Next Action) */}
        {nextView && (
          <div className="mt-12 mb-8 md:hidden">
            <NextScriptPrompt 
              nextView={nextView} 
              isBash={isBash} 
              isDark={isDark} 
              onExecute={() => setActiveView(nextView)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const NextScriptPrompt = ({ nextView, isBash, isDark, onExecute }: { nextView: ViewType, isBash: boolean, isDark: boolean, onExecute: () => void }) => {
  const prompt = isBash ? 'root@mobile:~$' : 'PS C:\\Users\\Mobile>';
  const cmd = isBash ? `./${nextView}.sh` : `.\\Start-${nextView.charAt(0).toUpperCase() + nextView.slice(1)}.ps1`;
  const accent = isBash ? 'text-green-500' : 'text-blue-400';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-black/5';

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '2s' }}>
      <div className="text-xs uppercase tracking-widest opacity-40 mb-2">Suggested Next Action</div>
      <button 
        onClick={onExecute}
        className={`w-full text-left p-4 rounded border border-dashed border-current border-opacity-30 group transition-all ${hoverBg}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} group-hover:scale-110 transition-transform`}>
            <Play size={16} className={isBash ? 'text-green-500' : 'text-yellow-500'} fill="currentColor" />
          </div>
          <div className="font-mono text-sm md:text-base overflow-hidden">
            <span className={`${accent} mr-2 font-bold`}>{prompt}</span>
            <span className="group-hover:underline underline-offset-4 decoration-2">{cmd}</span>
            <span className="animate-cursor-blink ml-1 inline-block w-1.5 h-4 bg-current align-middle"></span>
          </div>
        </div>
        <div className="mt-2 text-xs opacity-50 pl-12">
          Click to execute next script...
        </div>
      </button>
    </div>
  )
};

const CommandBar = ({ activeView, isBash, isDark, accentColor }: any) => {
  // Map views to commands
  const commands: Record<ViewType, { bash: string; ps: string }> = {
    home: { bash: './init.sh', ps: 'Start-Process -FilePath ./init.ps1' },
    about: { bash: 'cat ./whoami.txt', ps: 'Get-Content .\\WhoAmI.txt' },
    experience: { bash: './history.sh | grep "Work"', ps: 'Get-History | Select-String "Work"' },
    projects: { bash: 'ls -la ./repos', ps: 'Get-ChildItem .\\Repos' },
    skills: { bash: 'printenv | grep SKILLS', ps: 'Get-Variable -Name Skills' },
    contact: { bash: './contact.sh --message', ps: 'Send-MailMessage -To "Me"' },
  };

  const currentCmd = isBash ? commands[activeView].bash : commands[activeView].ps;
  const prompt = isBash ? BASH_PROMPT : PS_PROMPT;
  
  const promptColor = isBash 
    ? (isDark ? 'text-green-500' : 'text-green-700')
    : (isDark ? 'text-white' : 'text-blue-700');
    
  const cmdColor = isBash
    ? (isDark ? 'text-yellow-200' : 'text-yellow-700')
    : (isDark ? 'text-yellow-400' : 'text-blue-900');

  return (
    <div className="font-bold text-sm md:text-base break-all flex flex-wrap items-center gap-2 border-b border-dashed border-current border-opacity-20 pb-4">
      <span className={`${promptColor} select-none whitespace-nowrap`}>{prompt}</span>
      <span className={`${cmdColor}`}>
        <Typewriter text={currentCmd} speed={30} showCursor={true} />
      </span>
    </div>
  );
};

const HomeView = ({ accentColor }: { accentColor: string }) => (
  <div className="flex flex-col justify-center h-full pt-10 md:pt-20">
      <div className="mb-4">
        <AnimatedBlock delay={500}>
          <div className="text-xs uppercase tracking-widest opacity-60 mb-2">System Status: Online</div>
        </AnimatedBlock>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        <AnimatedBlock delay={800}>
          <span>Bhashkar </span>
          <span className={`${accentColor}`}>Gupta</span>
        </AnimatedBlock>
      </h1>
      <div className="text-xl md:text-2xl opacity-90 mb-6">
        <AnimatedBlock delay={1500}>
          System Administrator | Blue Team Aspirant | Free Time Coder
        </AnimatedBlock>
      </div>
      <div className="text-lg opacity-70 border-l-4 border-current pl-4 italic">
        <AnimatedBlock delay={2200}>
          "Bridging the gap between Operations and Security."
        </AnimatedBlock>
      </div>
  </div>
);

const AboutView = ({ cardBg }: { cardBg: string }) => (
  <AnimatedBlock delay={800}>
    <div className={`p-6 rounded-lg border border-current border-opacity-20 ${cardBg}`}>
      <p className="leading-relaxed text-lg">
        System Administrator with 4 years of experience managing hybrid infrastructure (Windows/Linux). 
        Proponent of the 'Inverted-T' engineering model. Currently pursuing MSc in Information Security 
        and building stateless privacy tools.
      </p>
    </div>
  </AnimatedBlock>
);

const ExperienceView = ({ cardBg, accentColor, isDark }: any) => (
  <div className="space-y-8 relative border-l border-current border-opacity-20 ml-3 pl-8 mt-4">
      {/* Job 1 */}
      <AnimatedBlock delay={800}>
        <div className="relative">
          <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-current ${isDark ? 'bg-gray-900' : 'bg-white'}`}></div>
          <h3 className={`text-xl font-bold ${accentColor}`}>iBoss Tech Solutions</h3>
          <p className="text-sm opacity-60 mb-2">2022 – Present | IT Support Engineer (Infra & IAM)</p>
          <div className={`p-4 rounded border border-current border-opacity-10 mt-2 ${cardBg}`}>
            <ul className="list-disc list-inside opacity-90 space-y-1">
              <li>Focus: Azure AD, Intune, BeyondTrust, Varonis.</li>
              <li>Managed hybrid identity and access management policies.</li>
            </ul>
          </div>
        </div>
      </AnimatedBlock>

      {/* Job 2 */}
      <AnimatedBlock delay={1400}>
        <div className="relative mt-8">
          <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-current ${isDark ? 'bg-gray-900' : 'bg-white'}`}></div>
          <h3 className={`text-xl font-bold ${accentColor}`}>TATA Power</h3>
          <p className="text-sm opacity-60 mb-2">2020 – 2022 | IT Support Engineer</p>
          <div className={`p-4 rounded border border-current border-opacity-10 mt-2 ${cardBg}`}>
            <ul className="list-disc list-inside opacity-90 space-y-1">
              <li>Focus: Windows Server Administration.</li>
              <li>Network Operations & Infrastructure maintenance.</li>
            </ul>
          </div>
        </div>
      </AnimatedBlock>
  </div>
);

const ProjectsView = ({ cardBg, accentColor }: any) => (
  <div className="grid md:grid-cols-2 gap-6 mt-4">
    <AnimatedBlock delay={800}>
      <div className={`p-6 rounded border border-current border-opacity-20 hover:border-opacity-50 transition-all ${cardBg} h-full`}>
        <div className="flex items-center gap-2 mb-4">
            <Terminal size={20} className={accentColor} />
            <h3 className="font-bold text-xl">ForgetMe</h3>
        </div>
        <p className="text-sm font-bold opacity-80 mb-2">Stateless Password Manager</p>
        <p className="opacity-70 text-sm mb-4">
          Zero-Knowledge tool using Argon2id hashing & Web Crypto API. Eliminates DB breach risks.
        </p>
        <div className="flex gap-2 mt-auto">
            <span className="px-2 py-1 text-xs border border-current border-opacity-30 rounded">CryptoAPI</span>
            <span className="px-2 py-1 text-xs border border-current border-opacity-30 rounded">React</span>
        </div>
      </div>
    </AnimatedBlock>

    <AnimatedBlock delay={1200}>
      <div className={`p-6 rounded border border-current border-opacity-20 hover:border-opacity-50 transition-all ${cardBg} h-full`}>
        <div className="flex items-center gap-2 mb-4">
            <Terminal size={20} className={accentColor} />
            <h3 className="font-bold text-xl">Config-Encryptor</h3>
        </div>
        <p className="text-sm font-bold opacity-80 mb-2">Browser Extension</p>
        <p className="opacity-70 text-sm mb-4">
          Extension for secure, local-only configuration export using DOM manipulation directly in the browser.
        </p>
        <div className="flex gap-2 mt-auto">
            <span className="px-2 py-1 text-xs border border-current border-opacity-30 rounded">JS</span>
            <span className="px-2 py-1 text-xs border border-current border-opacity-30 rounded">DOM</span>
        </div>
      </div>
    </AnimatedBlock>
  </div>
);

const SkillsView = ({ cardBg, accentColor }: any) => (
  <div className={`grid md:grid-cols-3 gap-4 mt-4`}>
      <AnimatedBlock delay={800}>
        <div className={`p-4 rounded border border-current border-opacity-20 ${cardBg}`}>
          <h4 className={`font-bold mb-3 ${accentColor} border-b border-current border-opacity-20 pb-2`}>INFRASTRUCTURE</h4>
          <ul className="space-y-2 text-sm">
            <li>Windows Server</li>
            <li>Linux (Kali/Debian)</li>
            <li>Azure AD</li>
            <li>Intune</li>
          </ul>
        </div>
      </AnimatedBlock>

      <AnimatedBlock delay={1100}>
        <div className={`p-4 rounded border border-current border-opacity-20 ${cardBg}`}>
          <h4 className={`font-bold mb-3 ${accentColor} border-b border-current border-opacity-20 pb-2`}>SECURITY</h4>
          <ul className="space-y-2 text-sm">
            <li>IAM Principles</li>
            <li>BeyondTrust</li>
            <li>Varonis</li>
            <li>Argon2id Hashing</li>
          </ul>
        </div>
      </AnimatedBlock>

      <AnimatedBlock delay={1400}>
        <div className={`p-4 rounded border border-current border-opacity-20 ${cardBg}`}>
          <h4 className={`font-bold mb-3 ${accentColor} border-b border-current border-opacity-20 pb-2`}>CODE</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="opacity-50">$</span> Bash Scripting</li>
            <li><span className="opacity-50">.py</span> Python</li>
            <li><span className="opacity-50">.js</span> JavaScript</li>
            <li><span className="opacity-50">.ps1</span> PowerShell</li>
          </ul>
        </div>
      </AnimatedBlock>
  </div>
);

const ContactView = ({ isBash }: any) => (
  <AnimatedBlock delay={800}>
    <div className={`p-6 border border-dashed border-current border-opacity-30 rounded text-center mt-10`}>
        <p className="mb-4 text-lg">Open to opportunities in Security Operations and DevSecOps.</p>
        <button className={`px-6 py-3 font-bold rounded ${isBash ? 'bg-green-600 hover:bg-green-700 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-colors`}>
          Initiate Handshake
        </button>
    </div>
  </AnimatedBlock>
);
