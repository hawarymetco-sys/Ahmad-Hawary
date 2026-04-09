import React, { useState, useEffect } from "react";
import { 
  Radio, Settings, LayoutDashboard, History, 
  Search, Bell, User, LogOut, PlayCircle, 
  Video, Mic, Globe, Cpu, Download, Save
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoPlayer } from "./components/VideoPlayer";
import { ControlPanel } from "./components/ControlPanel";
import { TranscriptView } from "./components/TranscriptView";
import { useStreaming } from "./hooks/useStreaming";
import { Language, VoiceGender, VoiceStyle, LatencyMode, Theme } from "./types";
import { cn } from "./lib/utils";

export default function App() {
  const { 
    isStreaming, status, systemStatus, transcripts, 
    detectedLanguage, startStream, stopStream 
  } = useStreaming();

  const [url, setUrl] = useState("");
  const [targetLang, setTargetLang] = useState<Language>("Arabic");
  const [voiceGender, setVoiceGender] = useState<VoiceGender>("Auto");
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>("Cinema");
  const [latencyMode, setLatencyMode] = useState<LatencyMode>("Balanced");
  const [theme, setTheme] = useState<Theme>("cinema");

  const handleStart = () => {
    if (!url) return;
    startStream(url);
  };

  useEffect(() => {
    // Apply theme class to body for global variable overrides
    const body = document.body;
    body.classList.remove("theme-dark", "theme-blue-grey", "theme-light", "theme-cyber");
    if (theme !== "cinema") {
      body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return (
    <div className="h-screen w-screen flex flex-col bg-app-bg text-app-text overflow-hidden transition-colors duration-500">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 flex flex-col items-center py-6 bg-black/20 backdrop-blur-lg border-r border-app-border z-40">
        <div className="w-10 h-10 bg-app-accent rounded-xl flex items-center justify-center mb-10 shadow-lg shadow-app-accent/20">
          <Radio className="w-6 h-6 text-white" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-6">
          <NavIcon icon={<LayoutDashboard />} active />
          <NavIcon icon={<Video />} />
          <NavIcon icon={<Mic />} />
          <NavIcon icon={<Globe />} />
          <NavIcon icon={<History />} />
        </nav>

        <div className="flex flex-col gap-6">
          <NavIcon icon={<Settings />} />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-app-accent to-blue-600 border border-app-border" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-16 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-app-border bg-app-surface/50 backdrop-blur-md shrink-0 z-30">
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <h1 className="text-sm md:text-lg font-black uppercase tracking-[0.2em] truncate">Neural Dub Studio</h1>
            <div className="hidden md:block h-4 w-px bg-app-border" />
            <div className="hidden sm:flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", isStreaming ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-app-text-muted")} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-app-text-muted truncate">
                {isStreaming ? "Live Processing" : "System Standby"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-app-text-muted" />
              <input 
                type="text" 
                placeholder="Stream URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-app-surface border border-app-border rounded-full pl-8 md:pl-10 pr-4 py-1.5 text-xs md:text-sm w-40 md:w-80 focus:outline-none focus:border-app-accent/50 transition-all font-mono"
              />
            </div>
            
            <button 
              onClick={isStreaming ? stopStream : handleStart}
              className={cn(
                "px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl whitespace-nowrap active:scale-95",
                isStreaming 
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20" 
                  : "bg-app-accent text-white hover:opacity-90 shadow-app-accent/20"
              )}
            >
              {isStreaming ? "Terminate" : "Initialize"}
            </button>
          </div>
        </header>

        {/* Content Grid */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 overflow-hidden min-h-0">
          {/* Left Column: Player & Status */}
          <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6 overflow-hidden h-full min-h-0">
            <div className="flex-1 min-h-0 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-app-accent/20 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative h-full bg-app-surface rounded-xl border border-app-border overflow-hidden shadow-2xl">
                <VideoPlayer isStreaming={isStreaming} onStop={stopStream} streamUrl={url} />
              </div>
            </div>
            
            {/* Status & Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 shrink-0">
              <div className="sm:col-span-2 bg-app-surface rounded-xl border border-app-border p-4 md:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-app-accent/50 to-transparent" />
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-app-text-muted">Pipeline Progress</span>
                  <span className="text-[10px] md:text-xs font-mono text-app-accent">{status?.progress.toFixed(0) || 0}%</span>
                </div>
                <div className="h-2.5 md:h-3 w-full bg-app-bg rounded-full overflow-hidden border border-app-border relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${status?.progress || 0}%` }}
                    className="h-full bg-gradient-to-r from-app-accent via-blue-400 to-app-accent shadow-[0_0_20px_rgba(59,130,246,0.8)] relative"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                    
                    {/* Segmented Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[length:10px_100%] bg-[linear-gradient(90deg,transparent_0%,transparent_80%,rgba(0,0,0,0.5)_80%,rgba(0,0,0,0.5)_100%)]" />
                  </motion.div>
                </div>
                <div className="mt-2 md:mt-4 flex items-center gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-app-accent rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]" />
                  <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-app-text truncate">{status?.step || "System Ready"}</span>
                </div>
              </div>

              <div className="bg-app-surface rounded-xl border border-app-border p-4 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-4 shadow-xl group hover:border-app-accent/30 transition-colors">
                <button 
                  className="w-full flex items-center justify-center gap-2 md:gap-3 bg-app-bg hover:bg-app-surface-hover border border-app-border py-2 md:py-3 rounded-lg text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
                  onClick={() => alert("Recording last 60 seconds...")}
                >
                  <Save className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                  Buffer Save
                </button>
                <p className="text-[8px] md:text-[9px] text-app-text-muted text-center font-mono uppercase tracking-widest opacity-60">Auto-clean (60s)</p>
              </div>
            </div>
          </div>

          {/* Right Column: Controls & Transcript */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 overflow-hidden h-full">
            <div className="flex-1 min-h-0 overflow-hidden">
              <TranscriptView transcripts={transcripts} isStreaming={isStreaming} />
            </div>

            <div className="h-[250px] md:h-[380px] bg-app-surface rounded-2xl border-2 border-app-border p-4 md:p-6 overflow-y-auto custom-scrollbar shadow-xl shrink-0">
              <ControlPanel 
                sourceLang={detectedLanguage}
                targetLang={targetLang}
                setTargetLang={setTargetLang}
                voiceGender={voiceGender}
                setVoiceGender={setVoiceGender}
                voiceStyle={voiceStyle}
                setVoiceStyle={setVoiceStyle}
                latencyMode={latencyMode}
                setLatencyMode={setLatencyMode}
                systemStatus={systemStatus}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Theme Switcher Floating */}
      <div className="fixed bottom-8 left-24 flex gap-3 bg-app-surface/90 backdrop-blur-xl p-2 rounded-full border-2 border-app-border z-50 shadow-2xl">
        {(["cinema", "dark", "blue-grey", "light", "cyber"] as Theme[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={cn(
              "w-8 h-8 rounded-full border-2 border-app-border transition-all hover:scale-125 hover:rotate-12",
              t === "cinema" && "bg-black",
              t === "dark" && "bg-neutral-900",
              t === "blue-grey" && "bg-slate-800",
              t === "light" && "bg-[#f5f5dc]",
              t === "cyber" && "bg-cyan-900",
              theme === t && "ring-4 ring-app-accent ring-offset-4 ring-offset-app-bg"
            )}
            title={`${t} theme`}
          />
        ))}
      </div>
    </div>
  );
}

function NavIcon({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={cn(
      "p-2 rounded-xl transition-all",
      active ? "bg-app-accent/10 text-app-accent" : "text-app-text-muted hover:text-app-text hover:bg-app-surface-hover"
    )}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" }) : icon}
    </button>
  );
}
