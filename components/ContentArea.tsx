
import React, { useState, useEffect } from 'react';
import { useAppContext, ViewType } from '../App';
import { ShellMode, ThemeMode } from '../types';
import { BASH_PROMPT, PS_PROMPT, BASH_ACCENT, PS_ACCENT } from '../constants';
import { Terminal, ArrowRight, Play, ExternalLink, Github, Download } from 'lucide-react';
import { Typewriter } from './Typewriter';

// Define the logical flow of the application
const VIEW_ORDER: ViewType[] = ['home', 'about', 'experience', 'projects', 'certifications', 'skills', 'contact', 'resume'];

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
  
  // Smart Accent Color:
  // In Light Mode, yellow is hard to read, so we use Blue for PS and Darker Green for Bash.
  const accentColor = isBash 
    ? (isDark ? 'text-green-500' : 'text-green-700') 
    : (isDark ? 'text-yellow-400' : 'text-blue-700');

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
          {activeView === 'about' && <AboutView cardBg={cardBg} accentColor={accentColor} />}
          {activeView === 'experience' && <ExperienceView cardBg={cardBg} accentColor={accentColor} isDark={isDark} />}
          {activeView === 'projects' && <ProjectsView cardBg={cardBg} accentColor={accentColor} isBash={isBash} />}
          {activeView === 'certifications' && <CertificationsView cardBg={cardBg} accentColor={accentColor} isBash={isBash} isDark={isDark} />}
          {activeView === 'skills' && <SkillsView cardBg={cardBg} accentColor={accentColor} isDark={isDark} />}
          {activeView === 'contact' && <ContactView isBash={isBash} isDark={isDark} accentColor={accentColor} />}
          {activeView === 'resume' && <ResumeView cardBg={cardBg} accentColor={accentColor} isBash={isBash} isDark={isDark} />}
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
  const accent = isBash 
    ? (isDark ? 'text-green-500' : 'text-green-700')
    : (isDark ? 'text-blue-400' : 'text-blue-700');
    
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
            <Play size={16} className={isBash ? 'text-green-500' : (isDark ? 'text-yellow-500' : 'text-blue-700')} fill="currentColor" />
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
    home: { bash: './init.sh', ps: 'Start-Process -FilePath .\\init.ps1' },
    about: { bash: 'cat ./whoami.txt', ps: 'Get-Content .\\WhoAmI.txt' },
    experience: { bash: './history.sh | grep "Work"', ps: 'Get-History | Select-String "Work"' },
    projects: { bash: 'ls -la ./repos', ps: 'Get-ChildItem .\\Repos' },
    certifications: { bash: 'apt list --installed | grep "security\\|admin"', ps: 'Get-Package | Where-Object { $_.Name -match "Security|Admin" }' },
    skills: { bash: 'printenv | grep SKILLS', ps: 'Get-Variable -Name Skills' },
    contact: { bash: './contact.sh --message', ps: 'Send-MailMessage -To "Me"' },
    resume: { bash: 'wget ./resume.pdf', ps: 'Invoke-WebRequest -Uri .\\resume.pdf -OutFile Resume.pdf' },
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
          IT Systems Administrator | Infrastructure Hardening & Operations | Identity Access Management (IAM) | Windows & Linux Operations |
        </AnimatedBlock>
      </div>
      <div className="text-lg opacity-70 border-l-4 border-current pl-4 italic">
        <AnimatedBlock delay={2200}>
          "Bridging the gap between Operations and Security."
        </AnimatedBlock>
      </div>
  </div>
);

const AboutView = ({ cardBg, accentColor }: { cardBg: string, accentColor: string }) => (
  <div className="space-y-6">
    <AnimatedBlock delay={800}>
      <div className={`p-6 rounded-lg border border-current border-opacity-20 ${cardBg}`}>
        <p className="leading-relaxed text-lg mb-4">
          I am a System Administrator with 4 years of experience in the trenches of IT Operations. I don't claim to be a security architect yet—I am an operator who is actively transitioning into Blue Team Defense.
        </p>
        <p className="leading-relaxed mb-4">
          My experience is "Horizontal": I know how Windows Servers fail, how Azure AD permissions get messy, and how Linux drivers conflict because I fix them daily. I am now applying that operational knowledge to the "Vertical" stack of Cybersecurity.
        </p>
      </div>
    </AnimatedBlock>

    <AnimatedBlock delay={1500}>
      <div className="pl-4 border-l-2 border-current border-opacity-30">
        <h3 className={`text-xl font-bold mb-3 ${accentColor}`}>The Philosophy</h3>
        <p className="mb-4 text-sm opacity-80">
          I believe the best defenders are the ones who know how the system works under the hood. I am bridging the gap between fixing tickets and securing infrastructure by:
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className={`${accentColor} font-bold`}>01.</span>
            <div>
              <strong className="block mb-1">Building Tools</strong>
              <span className="opacity-70 text-sm">Developing stateless security tools (like ForgetMe) to understand cryptography and privacy engineering.</span>
            </div>
          </li>
          <li className="flex gap-3">
            <span className={`${accentColor} font-bold`}>02.</span>
            <div>
              <strong className="block mb-1">Deepening Knowledge</strong>
              <span className="opacity-70 text-sm">Pursuing an MSc in Information Security to formalize my hands-on experience.</span>
            </div>
          </li>
          <li className="flex gap-3">
            <span className={`${accentColor} font-bold`}>03.</span>
            <div>
              <strong className="block mb-1">Connecting Dots</strong>
              <span className="opacity-70 text-sm">Using my generalist IT background to identify security gaps that specialists might miss.</span>
            </div>
          </li>
        </ul>
      </div>
    </AnimatedBlock>
  </div>
);

const ExperienceView = ({ cardBg, accentColor, isDark }: any) => (
  <div className="space-y-12 relative border-l border-current border-opacity-20 ml-3 pl-8 mt-4 pb-10">
      {/* Job 1 */}
      <AnimatedBlock delay={800}>
        <div className="relative">
          <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-current ${isDark ? 'bg-gray-900' : 'bg-white'} z-10`}></div>
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
            <h3 className={`text-xl font-bold ${accentColor}`}>iBoss Tech Solutions</h3>
            <span className="text-sm opacity-60 font-mono">2022-03 — Present</span>
          </div>
          <p className="text-sm font-bold opacity-80 mb-4">IT Support Engineer (Infrastructure & IAM)</p>
          
          <div className={`p-5 rounded border border-current border-opacity-10 ${cardBg}`}>
            <p className="text-sm mb-4 opacity-70 italic border-b border-current border-opacity-10 pb-2">
              Remote technical support and administration for global users, utilizing enterprise management tools.
            </p>
            <ul className="space-y-3 text-sm opacity-90">
              <li>
                <strong className="block text-xs uppercase tracking-wider opacity-60 mb-1">Identity & Access Operations</strong>
                Daily administration of user lifecycles in Azure AD (Entra ID) and On-Premise AD. Executing password resets, modifying permission groups, and configuring email configurations (Exchange/UNIX).
              </li>
              <li>
                <strong className="block text-xs uppercase tracking-wider opacity-60 mb-1">Endpoint Management</strong>
                Utilizing Microsoft Intune and Windows Autopilot to manage device compliance and application deployment.
              </li>
              <li>
                <strong className="block text-xs uppercase tracking-wider opacity-60 mb-1">Secure Remote Support</strong>
                Leveraging BeyondTrust (PAM) to perform administrative tasks on remote endpoints securely.
              </li>
              <li>
                <strong className="block text-xs uppercase tracking-wider opacity-60 mb-1">Monitoring & Compliance</strong>
                Using Varonis to monitor data access logs and Service Desk Plus to document and track incidents.
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-current border-opacity-10 flex flex-wrap gap-2">
              {['Azure AD', 'Intune', 'BeyondTrust', 'Varonis', 'O365 Admin', 'Service Desk Plus'].map(tech => (
                <span key={tech} className="text-[10px] px-2 py-1 rounded border border-current border-opacity-20 opacity-60">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </AnimatedBlock>

      {/* Job 2 */}
      <AnimatedBlock delay={1400}>
        <div className="relative">
          <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-current ${isDark ? 'bg-gray-900' : 'bg-white'} z-10`}></div>
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
            <h3 className={`text-xl font-bold ${accentColor}`}>TATA Power (IT Division)</h3>
            <span className="text-sm opacity-60 font-mono">2020-04 — 2022-03</span>
          </div>
          <p className="text-sm font-bold opacity-80 mb-4">Information Technology Support Engineer</p>
          
          <div className={`p-5 rounded border border-current border-opacity-10 ${cardBg}`}>
            <p className="text-sm mb-4 opacity-70 italic border-b border-current border-opacity-10 pb-2">
              On-site infrastructure maintenance and L2 technical support.
            </p>
            <ul className="space-y-3 text-sm opacity-90">
              <li>
                <strong className="block text-xs uppercase tracking-wider opacity-60 mb-1">Windows Server Maintenance</strong>
                Responsible for the health of on-premise Windows Servers, routine maintenance, and ensuring backup stability.
              </li>
              <li>
                <strong className="block text-xs uppercase tracking-wider opacity-60 mb-1">Network Troubleshooting</strong>
                Handled L2 connectivity issues involving LAN/WAN, DNS, and DHCP. Tracing faults and restoring access.
              </li>
              <li>
                <strong className="block text-xs uppercase tracking-wider opacity-60 mb-1">System Provisioning</strong>
                Managed imaging and setup process to ensure new hardware was production-ready immediately.
              </li>
              <li>
                <strong className="block text-xs uppercase tracking-wider opacity-60 mb-1">Operational Support</strong>
                Managed IT assets, handled procurement requests (SAP ARIBA), and provided technical training.
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-current border-opacity-10 flex flex-wrap gap-2">
              {['Windows Server', 'Active Directory', 'DNS/DHCP', 'Hardware Troubleshooting', 'SAP ARIBA'].map(tech => (
                <span key={tech} className="text-[10px] px-2 py-1 rounded border border-current border-opacity-20 opacity-60">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </AnimatedBlock>

      {/* Job 3 */}
      <AnimatedBlock delay={2000}>
        <div className="relative">
          <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-2 border-current ${isDark ? 'bg-gray-900' : 'bg-white'} z-10`}></div>
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
            <h3 className={`text-xl font-bold opacity-70`}>TATA Power (Transmission)</h3>
            <span className="text-sm opacity-60 font-mono">2019-09 — 2020-03</span>
          </div>
          <p className="text-sm font-bold opacity-80 mb-4">Lead Engineer (Legacy Process)</p>
          
          <div className={`p-5 rounded border border-current border-opacity-10 ${cardBg} opacity-80`}>
             <p className="text-sm mb-4 opacity-70 italic border-b border-current border-opacity-10 pb-2">
              Critical Infrastructure Maintenance.
            </p>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Managed the inspection and maintenance of 400KV Double Circuit Transmission Lines.</li>
              <li>Focused on safety compliance, technical documentation, and store keeping for engineering assets.</li>
            </ul>
          </div>
        </div>
      </AnimatedBlock>
  </div>
);

const ProjectsView = ({ cardBg, accentColor, isBash }: any) => {
  const projects = [
    {
      title: "ForgetMe - Stateless Password Manager",
      status: "Active",
      stack: ["JavaScript", "Web Crypto API", "Argon2id", "Bootstrap"],
      desc: "A \"Zero-Knowledge\" password generation tool that eliminates database breach risks by deriving credentials deterministically on the client side.",
      details: [
        "Core Tech: Implemented Argon2id (memory-hard hashing) to resist GPU/ASIC cracking attacks.",
        "Privacy: Engineered a purely client-side architecture; no sensitive data ever touches a server."
      ],
      live: "https://forgetme.techfixerlab.com",
      repo: "https://github.com/BhashkarGupta/ForgetMe-Password-Manager"
    },
    {
      title: "ForgetMe - Config Encryptor Extension",
      status: "Stable",
      stack: ["JavaScript", "Chrome Extension API", "AES Encryption"],
      desc: "A browser extension companion for ForgetMe that handles secure local configuration management.",
      details: [
        "Function: Securely exports/imports configuration profiles as AES-encrypted JSON blobs using local storage APIs.",
        "Tech: Demonstrates practical application of DOM manipulation and client-side encryption logic within a sandboxed browser environment."
      ],
      repo: "https://github.com/BhashkarGupta/ForgetMe-Extension"
    },
    {
      title: "Canteen Management Portal",
      status: "Archived",
      stack: ["Node.js", "React.js", "PostgreSQL", "RBAC"],
      desc: "A full-stack web application designed to streamline inventory and order management.",
      details: [
        "Architecture: Built a RESTful API backend with a React frontend.",
        "Security: Implemented Role-Based Access Control (RBAC) to segregate administrative functions from user booking interfaces."
      ],
      repo: "https://github.com/BhashkarGupta/Canteen-Management-Portal"
    },
    {
      title: "Joplin GPT Search Plugin",
      status: "Stable",
      stack: ["TypeScript", "Joplin Data API"],
      desc: "A productivity plugin for the open-source Joplin note-taking app that integrates LLM search capabilities.",
      details: [
        "Integration: Connects Joplin's internal search query to external GPT endpoints.",
        "Customization: Allows users to configure custom search commands via the plugin settings interface."
      ],
      repo: "https://github.com/BhashkarGupta/Jopline-Plugin-Chat-GPT-Search"
    },
    {
      title: "ChatGPT Context Search",
      status: "Stable",
      stack: ["JavaScript", "Context Menu API"],
      desc: "A browser extension that integrates LLM analysis directly into the browser's right-click context menu.",
      details: [
        "Logic: Captures selected text from the DOM and injects it into a pre-configured prompt template for immediate analysis/summary."
      ],
      repo: "https://github.com/BhashkarGupta/ChatGPT-Context-Search"
    },
    {
      title: "Same-Tab Enforcer",
      status: "Utility",
      stack: ["JavaScript", "Manifest V3"],
      desc: "A browser behavior control utility that forces links to open in the current browsing context.",
      details: [
        "Mechanism: Overrides target='_blank' attributes dynamically using content scripts to maintain tab hygiene and prevent unwanted pop-ups."
      ],
      repo: "https://github.com/BhashkarGupta/Same-Tab"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-4 pb-10">
      {projects.map((proj, idx) => (
        <AnimatedBlock key={idx} delay={800 + (idx * 200)}>
          <div className={`p-6 rounded border border-current border-opacity-20 hover:border-opacity-50 transition-all ${cardBg} h-full flex flex-col`}>
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-current border-opacity-20
                        ${proj.status === 'Active' ? 'text-green-500 bg-green-500/10' : ''}
                        ${proj.status === 'Stable' ? 'text-blue-500 bg-blue-500/10' : ''}
                        ${proj.status === 'Archived' ? 'opacity-50' : ''}
                        ${proj.status === 'Utility' ? 'text-purple-500 bg-purple-500/10' : ''}
                    `}>
                        {proj.status}
                    </div>
                    <Terminal size={16} className="opacity-50" />
                </div>
                <h3 className={`font-bold text-lg leading-tight ${accentColor}`}>{proj.title}</h3>
            </div>

            {/* Content */}
            <p className="opacity-80 text-sm mb-4 leading-relaxed">
              {proj.desc}
            </p>

            <ul className="text-xs opacity-70 space-y-2 mb-6 flex-1">
                {proj.details.map((detail, i) => (
                    <li key={i} className="flex gap-2">
                        <span className="shrink-0">{'>'}</span>
                        <span>{detail}</span>
                    </li>
                ))}
            </ul>

            {/* Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
                {proj.stack.map(tech => (
                    <span key={tech} className="px-2 py-1 text-[10px] border border-current border-opacity-20 rounded opacity-60 font-mono">
                        {tech}
                    </span>
                ))}
            </div>

            {/* Links */}
            <div className="mt-auto space-y-2">
                {proj.live && (
                    <a href={proj.live} target="_blank" rel="noopener noreferrer" className="block text-center w-full py-2 text-xs font-bold border border-current rounded hover:bg-current hover:text-black hover:bg-opacity-10 transition-colors">
                        [ Open Live Site ]
                    </a>
                )}
                <a href={proj.repo} target="_blank" rel="noopener noreferrer" 
                   className={`block text-xs font-mono p-2 rounded bg-black/20 hover:bg-black/40 border border-current border-opacity-10 transition-colors truncate group`}
                   title={proj.repo}
                >
                   <span className={`${isBash ? 'text-green-500' : 'text-yellow-500'} mr-2`}>$</span>
                   <span className="opacity-70 group-hover:opacity-100">git clone {proj.repo.replace('https://github.com/BhashkarGupta/', './')}</span>
                </a>
            </div>
          </div>
        </AnimatedBlock>
      ))}
    </div>
  );
};

const CertificationsView = ({ cardBg, accentColor, isBash, isDark }: any) => {
  const certGroups = [
    {
      category: "SECURITY_FUNDAMENTALS",
      items: [
        { name: "google-cybersecurity-cert", ver: "v2023.09", source: "Google" },
        { name: "ms-sc-900-fundamentals", ver: "v2023.04", source: "Microsoft Security" },
        { name: "automate-cyber-tasks-python", ver: "v2023.09", source: "Google" },
      ]
    },
    {
      category: "CLOUD_INFRASTRUCTURE",
      items: [
        { name: "ms-az-900-azure-fund", ver: "v2023.04", source: "Microsoft Azure" },
        { name: "ms-office-365-admin", ver: "v2022.04", source: "Microsoft" },
      ]
    },
    {
      category: "SYSTEM_ADMINISTRATION",
      items: [
        { name: "master-mcse-server-2022", ver: "v2024.01", source: "Windows Server Admin" },
        { name: "comptia-network-plus-training", ver: "COMPLETED", source: "Dion Training" },
        { name: "comptia-a-plus-training", ver: "COMPLETED", source: "Luxa Law" },
      ]
    }
  ];

  return (
    <div className={`mt-4 p-4 md:p-8 rounded border border-current border-opacity-20 ${cardBg} font-mono text-xs md:text-sm overflow-x-auto whitespace-pre flex flex-col gap-12`}>
      {certGroups.map((group, groupIdx) => (
        <AnimatedBlock key={groupIdx} delay={800 + (groupIdx * 300)}>
          <div>
             {/* Header */}
             {isBash ? (
               <div className={`${accentColor} font-bold mb-2`}>[{group.category}]</div>
             ) : (
                <div className="mb-2 opacity-70">
                   <div className={`${accentColor} font-bold`}>Group: {group.category}</div>
                </div>
             )}

             {/* Table/List */}
             {isBash ? (
               <div className="space-y-3">
                 {group.items.map((item, i) => (
                   <div key={i} className="flex flex-col md:flex-row md:items-center">
                      <span className="md:w-64 truncate">{item.name}</span>
                      <span className={`hidden md:inline mx-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>.......</span>
                      <span className={`md:w-32 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>[{item.ver}]</span>
                      <span className={`opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}># {item.source}</span>
                   </div>
                 ))}
               </div>
             ) : (
                <div className="w-full text-left">
                  <div className={`flex border-b border-current border-opacity-20 pb-1 mb-2 ${isDark ? 'opacity-60' : 'opacity-100 font-bold'}`}>
                     <div className="w-64 shrink-0">Name</div>
                     <div className="w-32 shrink-0">Version</div>
                     <div className="flex-1">Source</div>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item, i) => (
                      <div key={i} className="flex">
                         <div className="w-64 shrink-0 truncate pr-2">{item.name.replace(/-/g, '.')}</div>
                         <div className={`w-32 shrink-0 truncate pr-2 ${isDark ? 'opacity-80' : 'opacity-100 text-gray-700'}`}>{item.ver.replace('v', '')}</div>
                         <div className={`flex-1 truncate ${isDark ? 'opacity-60' : 'opacity-100 text-gray-600'}`}>{item.source}</div>
                      </div>
                    ))}
                  </div>
                </div>
             )}
          </div>
        </AnimatedBlock>
      ))}

      <AnimatedBlock delay={2000}>
        <div className={`border-t border-current border-opacity-20 pt-4 ${isBash ? 'text-green-500' : (isDark ? 'text-blue-400' : 'text-blue-700')}`}>
           {isBash ? '> All packages verified.' : 'Total: 8 Packages installed and Verified.'}
        </div>
      </AnimatedBlock>
    </div>
  );
};

const SkillsView = ({ cardBg, accentColor, isDark }: any) => {
  const skills = {
    HOST: "Bhashkar_SysAdmin",
    KERNEL: "Hybrid_Infrastructure",
    MODULES_LOADED: {
      OPERATING_SYSTEMS: [
        "Windows Server 2019/2022",
        "Linux (Debian/Ubuntu/Kali)",
        "Windows 10/11 Enterprise"
      ],
      CLOUD_IDENTITY: [
        "Azure Active Directory (Entra ID)",
        "Microsoft Intune (MDM/MAM)",
        "Office 365 Administration",
        "Hybrid AD Connect",
        "Microsoft Exchange Admin Center"
      ],
      SECURITY_OPS: [
        "Identity Access Management (IAM)",
        "Privileged Access Management (BeyondTrust)",
        "Endpoint Hardening (CIS Benchmarks)",
        "Data Security Auditing (Varonis)",
        "Argon2id Implementation"
      ],
      NETWORKING: [
        "TCP/IP Stack Analysis",
        "DNS / DHCP Management",
        "L2 Troubleshooting",
        "VPN Configuration",
        "Wireshark / Tcpdump"
      ]
    },
    SCRIPTING_LANGUAGES: {
      PRIMARY: ["Bash", "PowerShell"],
      SECONDARY: ["Python", "JavaScript"],
      DATABASE: ["SQL", "PostgreSQL"],
      CODE: ["C", "C++"]
    },
    VIRTUALIZATION: [
      "VMware Workstation Pro",
      "KVM",
      "Windows 365 / Cloud PC"
    ]
  };

  const stringColor = isDark ? "text-green-300" : "text-green-700";
  const bracketColor = "opacity-50";

  return (
    <div className={`mt-4 font-mono text-xs md:text-sm p-4 md:p-6 rounded border border-current border-opacity-20 ${cardBg} overflow-x-auto`}>
      <AnimatedBlock delay={800}>
        <div><span className={bracketColor}>{"{"}</span></div>
      </AnimatedBlock>

      {/* Host & Kernel */}
      <AnimatedBlock delay={1000}>
        <div className="pl-4">
          <span className={`${accentColor} font-bold`}>"HOST"</span>: <span className={stringColor}>"{skills.HOST}"</span>,
        </div>
        <div className="pl-4 mb-4">
          <span className={`${accentColor} font-bold`}>"KERNEL"</span>: <span className={stringColor}>"{skills.KERNEL}"</span>,
        </div>
      </AnimatedBlock>

      {/* Modules Loaded */}
      <AnimatedBlock delay={1300}>
        <div className="pl-4">
          <span className={`${accentColor} font-bold`}>"MODULES_LOADED"</span>: <span className={bracketColor}>{"{"}</span>
        </div>
        <div className="pl-8 border-l border-current border-opacity-10 ml-6 my-1">
          {Object.entries(skills.MODULES_LOADED).map(([key, values], idx) => (
             <div key={key} className="mb-3 last:mb-0">
               <div className="mb-1">
                 <span className={`${accentColor} opacity-90`}>"{key}"</span>: [
               </div>
               <div className="pl-4 flex flex-col">
                 {values.map((v, i) => (
                   <span key={i}>
                     <span className={`${isDark ? 'text-blue-300' : 'text-blue-700'}`}>"{v}"</span>
                     {i < values.length - 1 && ","}
                   </span>
                 ))}
               </div>
               <div>],</div>
             </div>
          ))}
        </div>
        <div className="pl-4 mb-4"><span className={bracketColor}>{"},"}</span></div>
      </AnimatedBlock>

      {/* Scripting */}
      <AnimatedBlock delay={1600}>
        <div className="pl-4">
          <span className={`${accentColor} font-bold`}>"SCRIPTING_LANGUAGES"</span>: <span className={bracketColor}>{"{"}</span>
        </div>
         <div className="pl-8 border-l border-current border-opacity-10 ml-6 my-1">
          {Object.entries(skills.SCRIPTING_LANGUAGES).map(([key, values], idx) => (
             <div key={key} className="mb-1">
               <span className={`${accentColor} opacity-90`}>"{key}"</span>: [
               {values.map((v, i) => (
                 <span key={i}> <span className={`${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>"{v}"</span>{i < values.length - 1 && ","}</span>
               ))}
               <span> ]{idx < 2 && ","}</span>
             </div>
          ))}
        </div>
        <div className="pl-4 mb-4"><span className={bracketColor}>{"},"}</span></div>
      </AnimatedBlock>

      {/* Virtualization */}
      <AnimatedBlock delay={1900}>
        <div className="pl-4">
           <span className={`${accentColor} font-bold`}>"VIRTUALIZATION"</span>: [
        </div>
        <div className="pl-8">
           {skills.VIRTUALIZATION.map((v, i) => (
             <div key={i}>
               <span className={`${isDark ? 'text-purple-300' : 'text-purple-700'}`}>"{v}"</span>
               {i < skills.VIRTUALIZATION.length - 1 && ","}
             </div>
           ))}
        </div>
        <div className="pl-4">]</div>
      </AnimatedBlock>

      <AnimatedBlock delay={2100}>
        <div><span className={bracketColor}>{"}"}</span></div>
      </AnimatedBlock>
    </div>
  );
};

const ContactView = ({ isBash, isDark, accentColor }: any) => {
  const linkColor = isBash ? 'text-green-500 hover:underline' : (isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800');
  const labelColor = isDark ? 'opacity-70' : 'opacity-90 font-bold';
  const valColor = isDark ? 'text-gray-300' : 'text-gray-800';
  
  const channels = [
    {
      id: "CHANNEL_01: EMAIL",
      protocol: "SMTP/Outlook",
      address: "bhashkar.gupta@outlook.com",
      status: "[LISTENING]",
      action: "[SEND_MAIL]",
      link: "mailto:bhashkar.gupta@outlook.com"
    },
    {
      id: "CHANNEL_02: LINKEDIN",
      protocol: "HTTPS",
      address: "/in/bhashkargupta",
      status: "[CONNECTED]",
      action: "[CONNECT]",
      link: "https://www.linkedin.com/in/bhashkargupta"
    },
    {
      id: "CHANNEL_03: GITHUB",
      protocol: "GIT",
      address: "/BhashkarGupta",
      status: "[ACTIVE_REPOS]",
      action: "[INSPECT_CODE]",
      link: "https://github.com/BhashkarGupta"
    },
    {
      id: "CHANNEL_04: BLOG_WEBSITE",
      protocol: "HTTPS",
      address: "www.techfixerlab.com",
      status: "[ONLINE]",
      action: "[VISIT_BLOG]",
      link: "https://www.techfixerlab.com"
    }
  ];

  return (
    <div className="font-mono text-sm md:text-base space-y-8 mt-6">
      <AnimatedBlock delay={800}>
        <div className={`${accentColor} font-bold`}>
           <div>[+] ESTABLISHING SECURE CONNECTION...</div>
           <div>[+] SCANNING FOR OPEN CHANNELS...</div>
        </div>
      </AnimatedBlock>

      {channels.map((channel, idx) => (
        <AnimatedBlock key={idx} delay={1200 + (idx * 200)}>
          <div className="pl-4 border-l-2 border-current border-opacity-20">
             <div className={`${accentColor} font-bold mb-2`}>[{channel.id}]</div>
             <div className="pl-4 space-y-1">
                <div className="flex gap-4">
                  <span className={`w-32 shrink-0 ${labelColor}`}>{'>'} Protocol:</span>
                  <span className={valColor}>{channel.protocol}</span>
                </div>
                <div className="flex gap-4">
                  <span className={`w-32 shrink-0 ${labelColor}`}>{'>'} Target:</span>
                  <span className={valColor}>{channel.address}</span>
                </div>
                <div className="flex gap-4">
                  <span className={`w-32 shrink-0 ${labelColor}`}>{'>'} Status:</span>
                  <span className={isBash ? 'text-green-500' : (isDark ? 'text-green-400' : 'text-green-600')}>{channel.status}</span>
                </div>
                 <div className="flex gap-4 items-center mt-1">
                  <span className={`w-32 shrink-0 ${labelColor}`}>{'>'} Action:</span>
                  <a href={channel.link} target="_blank" rel="noopener noreferrer" className={`${linkColor} font-bold cursor-pointer transition-colors`}>
                    {channel.action}
                  </a>
                  <span className="text-xs opacity-50">(Click to Open)</span>
                </div>
             </div>
          </div>
        </AnimatedBlock>
      ))}

      <AnimatedBlock delay={2200}>
         <div className="pl-4 border-l-2 border-current border-opacity-20">
             <div className={`${accentColor} font-bold mb-2`}>[LOCATION_DATA]</div>
             <div className="pl-4 space-y-1">
                <div className="flex gap-4">
                   <span className={`w-32 shrink-0 ${labelColor}`}>{'>'} Coords:</span>
                   <span className={valColor}>India (Remote Ready)</span>
                </div>
                 <div className="flex gap-4">
                   <span className={`w-32 shrink-0 ${labelColor}`}>{'>'} Timezone:</span>
                   <span className={valColor}>IST (UTC+05:30)</span>
                </div>
             </div>
         </div>
      </AnimatedBlock>

      <AnimatedBlock delay={2400}>
         <div className={`mt-8 pt-4 border-t border-dashed border-current border-opacity-30 ${accentColor}`}>
            <div className="font-bold">[SYSTEM_MESSAGE]</div>
            <div className="opacity-80 mt-1">{'>'} Connection established. Waiting for input...</div>
         </div>
      </AnimatedBlock>
    </div>
  );
};

const ResumeView = ({ cardBg, accentColor, isBash, isDark }: any) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset progress when mounted
    setProgress(0);
    let interval: ReturnType<typeof setInterval>;
    
    // Delay start to match the fade-in animation of the progress bar container (1500ms)
    // We add 100ms extra buffer to be safe.
    const startTimeout = setTimeout(() => {
        interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Slower speed: +1 every 30ms.
                // 100 steps * 30ms = 3000ms (3 seconds) duration.
                return prev + 1; 
            });
        }, 30);
    }, 1600);

    return () => {
        clearTimeout(startTimeout);
        if (interval) clearInterval(interval);
    };
  }, []);

  const resumeUrl = "https://1drv.ms/b/c/78735145e282b672/IQAblf7IEE6PS71X302VeZW3ATjFGnu_KRgj8VQ5DHkbGpU?e=adbA3p";
  const fileName = "Bhashkar_Gupta_Resume.pdf";

  return (
    <div className="font-mono text-sm space-y-6 mt-6 p-4 md:p-8 rounded border border-current border-opacity-20 bg-black/10">
      
      {/* 1. Request Phase */}
      <AnimatedBlock delay={500}>
        {isBash ? (
          <div className="space-y-1 opacity-80">
            <div>--2024-05-21 12:00:00--  https://techfixerlab.com/resume.pdf</div>
            <div>Resolving techfixerlab.com (techfixerlab.com)... 104.21.55.2</div>
            <div>Connecting to techfixerlab.com (techfixerlab.com)|104.21.55.2|:443... connected.</div>
            <div>HTTP request sent, awaiting response... 200 OK</div>
            <div>Length: 2.4MB [application/pdf]</div>
            <div>Saving to: ‘{fileName}’</div>
          </div>
        ) : (
          <div className="space-y-2 opacity-80">
             <div>Writing web request</div>
             <div>    Writing request stream... (Number of bytes written: 245)</div>
             <div>GET {resumeUrl.substring(0, 40)}...</div>
             <div className={`${accentColor}`}>200 OK</div>
             <div>Reading response stream... (Number of bytes read: 241512)</div>
          </div>
        )}
      </AnimatedBlock>

      {/* 2. Progress Bar */}
      <AnimatedBlock delay={1500}>
        <div className="my-6">
          {isBash ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <span>{fileName}</span>
                 <span>{progress}%</span>
                 <span className="hidden md:inline">[</span>
                 <span className="hidden md:inline-block w-40 overflow-hidden text-green-500 whitespace-nowrap">
                    {"=".repeat(Math.floor(progress / 2.5)) + ">"}
                 </span>
                 <span className="hidden md:inline">]</span>
                 <span className="opacity-60">2.40M  --.-KB/s    in 0.1s</span>
              </div>
            </div>
          ) : (
             <div className="border border-current border-opacity-30 p-1 rounded max-w-md">
                <div 
                  className={`h-4 transition-all duration-75 ${isDark ? 'bg-yellow-500' : 'bg-blue-600'}`} 
                  style={{ width: `${progress}%` }}
                ></div>
                <div className="text-center text-xs mt-1">{progress}% Complete</div>
             </div>
          )}
        </div>
      </AnimatedBlock>

      {/* 3. Completion & Button */}
      {progress === 100 && (
         <AnimatedBlock delay={100}>
           <div className="space-y-6">
              <div className={`${isBash ? 'text-green-500' : 'text-blue-500'} font-bold`}>
                 {isBash ? `‘${fileName}’ saved [2512345/2512345]` : `DownloadFile :: Completed.`}
              </div>

              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-current border-opacity-20 rounded bg-white/5">
                 <div className="mb-4 opacity-70">Resume file is ready for viewing.</div>
                 <a 
                   href={resumeUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className={`flex items-center gap-3 px-6 py-3 rounded font-bold text-white transition-transform hover:scale-105 ${isBash ? 'bg-green-700 hover:bg-green-600' : 'bg-blue-700 hover:bg-blue-600'}`}
                 >
                    <Download size={20} />
                    <span>OPEN DOCUMENT</span>
                 </a>
              </div>
           </div>
         </AnimatedBlock>
      )}

    </div>
  );
};
