import React from 'react';
import { useAppContext } from '../App';
import { ShellMode, ThemeMode } from '../types';
import { BASH_PROMPT, PS_PROMPT, BASH_ACCENT, PS_ACCENT } from '../constants';
import { Terminal } from 'lucide-react';

const SectionHeader: React.FC<{ 
  bashCmd: string; 
  psCmd: string; 
}> = ({ bashCmd, psCmd }) => {
  const { shellMode, themeMode } = useAppContext();
  const isBash = shellMode === ShellMode.BASH;
  const isDark = themeMode === ThemeMode.DARK;

  const prompt = isBash ? BASH_PROMPT : PS_PROMPT;
  const command = isBash ? bashCmd : psCmd;
  
  // Highlighting colors
  const promptColor = isBash 
    ? (isDark ? 'text-green-500' : 'text-green-700')
    : (isDark ? 'text-white' : 'text-blue-700');
    
  const cmdColor = isBash
    ? (isDark ? 'text-yellow-200' : 'text-yellow-700')
    : (isDark ? 'text-yellow-400' : 'text-blue-900');

  return (
    <div className="mb-6 font-bold text-sm md:text-base break-all">
      <span className={`${promptColor} mr-2 select-none`}>{prompt}</span>
      <span className={`${cmdColor}`}>{command}</span>
      <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-current align-middle"></span>
    </div>
  );
};

export const ContentArea: React.FC = () => {
  const { shellMode, themeMode } = useAppContext();
  const isBash = shellMode === ShellMode.BASH;
  const isDark = themeMode === ThemeMode.DARK;

  const cardBg = isDark ? 'bg-white/5' : 'bg-black/5';
  const accentColor = isBash ? BASH_ACCENT : PS_ACCENT;

  return (
    <div className="max-w-4xl mx-auto space-y-24">
      
      {/* HEADER SECTION */}
      <section className="min-h-[50vh] flex flex-col justify-center animate-fade-in-up">
         <div className="mb-4">
            <span className={`text-xs uppercase tracking-widest opacity-60`}>Initializing Session...</span>
         </div>
         <h1 className="text-4xl md:text-6xl font-bold mb-4">
           Bhashkar <span className={`${accentColor}`}>Gupta</span>
         </h1>
         <h2 className="text-xl md:text-2xl opacity-90 mb-6">
           System Administrator | Blue Team Aspirant | OS Developer
         </h2>
         <p className="text-lg opacity-70 border-l-4 border-current pl-4 italic">
           "Bridging the gap between Operations and Security."
         </p>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="scroll-mt-24">
        <SectionHeader bashCmd="cat ./whoami" psCmd="Get-Content .\WhoAmI" />
        <div className={`p-6 rounded-lg border border-current border-opacity-20 ${cardBg}`}>
          <p className="leading-relaxed text-lg">
            System Administrator with 4 years of experience managing hybrid infrastructure (Windows/Linux). 
            Proponent of the 'Inverted-T' engineering model. Currently pursuing MSc in Information Security 
            and building stateless privacy tools.
          </p>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="scroll-mt-24">
        <SectionHeader bashCmd="./history | grep 'Work'" psCmd="Get-History | Select-String 'Work'" />
        
        <div className="space-y-8 relative border-l border-current border-opacity-20 ml-3 pl-8">
           {/* Job 1 */}
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

           {/* Job 2 */}
           <div className="relative">
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
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="scroll-mt-24">
        <SectionHeader bashCmd="ls -la ./repos" psCmd="Get-ChildItem .\Repos" />
        
        <div className="grid md:grid-cols-2 gap-6">
           {/* Project 1 */}
           <div className={`p-6 rounded border border-current border-opacity-20 hover:border-opacity-50 transition-all ${cardBg}`}>
              <div className="flex items-center gap-2 mb-4">
                 <Terminal size={20} className={accentColor} />
                 <h3 className="font-bold text-xl">ForgetMe</h3>
              </div>
              <p className="text-sm font-bold opacity-80 mb-2">Stateless Password Manager</p>
              <p className="opacity-70 text-sm mb-4">
                Zero-Knowledge tool using Argon2id hashing & Web Crypto API. Eliminates DB breach risks.
              </p>
              <div className="flex gap-2">
                 <span className="px-2 py-1 text-xs border border-current border-opacity-30 rounded">CryptoAPI</span>
                 <span className="px-2 py-1 text-xs border border-current border-opacity-30 rounded">React</span>
              </div>
           </div>

           {/* Project 2 */}
           <div className={`p-6 rounded border border-current border-opacity-20 hover:border-opacity-50 transition-all ${cardBg}`}>
              <div className="flex items-center gap-2 mb-4">
                 <Terminal size={20} className={accentColor} />
                 <h3 className="font-bold text-xl">Config-Encryptor</h3>
              </div>
              <p className="text-sm font-bold opacity-80 mb-2">Browser Extension</p>
              <p className="opacity-70 text-sm mb-4">
                Extension for secure, local-only configuration export using DOM manipulation directly in the browser.
              </p>
              <div className="flex gap-2">
                 <span className="px-2 py-1 text-xs border border-current border-opacity-30 rounded">JS</span>
                 <span className="px-2 py-1 text-xs border border-current border-opacity-30 rounded">DOM</span>
              </div>
           </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="scroll-mt-24">
        <SectionHeader bashCmd="printenv | grep SKILLS" psCmd="Get-Variable -Name Skills" />
        
        <div className={`grid md:grid-cols-3 gap-4`}>
           <div className={`p-4 rounded border border-current border-opacity-20 ${cardBg}`}>
              <h4 className={`font-bold mb-3 ${accentColor} border-b border-current border-opacity-20 pb-2`}>INFRASTRUCTURE</h4>
              <ul className="space-y-2 text-sm">
                <li>Windows Server</li>
                <li>Linux (Kali/Debian)</li>
                <li>Azure AD</li>
                <li>Intune</li>
              </ul>
           </div>

           <div className={`p-4 rounded border border-current border-opacity-20 ${cardBg}`}>
              <h4 className={`font-bold mb-3 ${accentColor} border-b border-current border-opacity-20 pb-2`}>SECURITY</h4>
              <ul className="space-y-2 text-sm">
                <li>IAM Principles</li>
                <li>BeyondTrust</li>
                <li>Varonis</li>
                <li>Argon2id Hashing</li>
              </ul>
           </div>

           <div className={`p-4 rounded border border-current border-opacity-20 ${cardBg}`}>
              <h4 className={`font-bold mb-3 ${accentColor} border-b border-current border-opacity-20 pb-2`}>CODE</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="opacity-50">$</span> Bash Scripting</li>
                <li><span className="opacity-50">.py</span> Python</li>
                <li><span className="opacity-50">.js</span> JavaScript</li>
                <li><span className="opacity-50">.ps1</span> PowerShell</li>
              </ul>
           </div>
        </div>
      </section>

      {/* CONTACT (Extra, kept simple) */}
      <section id="contact" className="scroll-mt-24 mb-12">
        <SectionHeader bashCmd="./contact.sh --message" psCmd="Send-MailMessage -To 'Me'" />
        <div className={`p-6 border border-dashed border-current border-opacity-30 rounded text-center`}>
           <p className="mb-4 text-lg">Open to opportunities in Security Operations and DevSecOps.</p>
           <button className={`px-6 py-3 font-bold rounded ${isBash ? 'bg-green-600 hover:bg-green-700 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-colors`}>
             Initiate Handshake
           </button>
        </div>
      </section>

    </div>
  );
};