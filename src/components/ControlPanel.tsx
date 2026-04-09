import React from "react";
import { 
  Settings2, Mic2, Languages, Volume2, 
  Zap, Cpu, Activity, ShieldCheck, AlertCircle
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Language, VoiceGender, VoiceStyle, LatencyMode, SystemStatus } from "../types";

interface ControlPanelProps {
  sourceLang: string;
  targetLang: Language;
  setTargetLang: (l: Language) => void;
  voiceGender: VoiceGender;
  setVoiceGender: (g: VoiceGender) => void;
  voiceStyle: VoiceStyle;
  setVoiceStyle: (s: VoiceStyle) => void;
  latencyMode: LatencyMode;
  setLatencyMode: (m: LatencyMode) => void;
  systemStatus: SystemStatus | null;
}

export function ControlPanel({
  sourceLang,
  targetLang,
  setTargetLang,
  voiceGender,
  setVoiceGender,
  voiceStyle,
  setVoiceStyle,
  latencyMode,
  setLatencyMode,
  systemStatus
}: ControlPanelProps) {
  return (
    <div className="space-y-8">
      {/* Language Detection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-app-text-muted">
          <Languages className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Language Engine</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-app-bg/50 p-3 rounded-lg border border-app-border group hover:border-app-accent/30 transition-colors">
            <p className="text-[9px] text-app-text-muted uppercase tracking-widest mb-1.5 opacity-60">Source (Auto)</p>
            <p className="text-xs font-mono font-bold text-app-accent">{sourceLang}</p>
          </div>
          <div className="bg-app-bg/50 p-3 rounded-lg border border-app-border group hover:border-app-accent/30 transition-colors">
            <p className="text-[9px] text-app-text-muted uppercase tracking-widest mb-1.5 opacity-60">Target Output</p>
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as Language)}
              className="bg-transparent text-xs font-mono font-bold w-full outline-none cursor-pointer text-app-text"
            >
              <option value="Arabic">Arabic (AR)</option>
              <option value="English">English (US)</option>
              <option value="Persian">Persian (FA)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Voice Controls */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-app-text-muted">
          <Volume2 className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Dubbing Processor</h3>
        </div>
        <div className="space-y-5 bg-app-bg/30 p-4 rounded-xl border border-app-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-app-accent/20" />
          
          <div className="space-y-3">
            <label className="text-[9px] text-app-text-muted uppercase tracking-widest opacity-60">Voice Profile</label>
            <div className="flex bg-app-surface p-1 rounded-lg border border-app-border">
              {(["Auto", "Male", "Female"] as VoiceGender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setVoiceGender(g)}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                    voiceGender === g ? "bg-app-accent text-white shadow-lg" : "text-app-text-muted hover:text-app-text"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] text-app-text-muted uppercase tracking-widest opacity-60">Acoustic Style</label>
            <select 
              value={voiceStyle}
              onChange={(e) => setVoiceStyle(e.target.value as VoiceStyle)}
              className="w-full bg-app-surface border border-app-border rounded-lg p-2.5 text-[10px] font-mono uppercase tracking-widest outline-none focus:border-app-accent/50 transition-all"
            >
              <option value="Neutral">Neutral / Flat</option>
              <option value="Broadcast">Broadcast / News</option>
              <option value="Cinema">Cinema / Dramatic</option>
              <option value="Narration">Narration / Soft</option>
              <option value="Documentary">Documentary / Informative</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[9px] text-app-text-muted uppercase tracking-widest opacity-60">Tempo</label>
                <span className="text-[9px] font-mono text-app-accent">1.0x</span>
              </div>
              <input type="range" min="0.75" max="1.5" step="0.05" defaultValue="1.0" className="w-full h-1 bg-app-surface rounded-lg appearance-none cursor-pointer accent-app-accent" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[9px] text-app-text-muted uppercase tracking-widest opacity-60">Emotion</label>
                <span className="text-[9px] font-mono text-app-accent">50%</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="50" className="w-full h-1 bg-app-surface rounded-lg appearance-none cursor-pointer accent-app-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* System Diagnostics */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-app-text-muted">
          <Activity className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">System Diagnostics</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatusItem label="FFmpeg" active={systemStatus?.ffmpeg} />
          <StatusItem label="yt-dlp" active={systemStatus?.ytDlp} />
          <StatusItem label="Whisper" active={systemStatus?.whisper} />
          <StatusItem label="Edge-TTS" active={systemStatus?.edgeTts} />
        </div>
        
        <div className="mt-6 p-4 bg-app-accent/5 border border-app-accent/20 rounded-xl flex items-center justify-between group hover:bg-app-accent/10 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-app-accent/10 flex items-center justify-center border border-app-accent/20">
              <Zap className="w-4 h-4 text-app-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-app-accent">Latency Mode</span>
              <span className="text-[8px] font-mono text-app-text-muted opacity-60 uppercase">Real-time Priority</span>
            </div>
          </div>
          <select 
            value={latencyMode}
            onChange={(e) => setLatencyMode(e.target.value as LatencyMode)}
            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-app-accent outline-none cursor-pointer"
          >
            <option value="Ultra Low">Ultra Low</option>
            <option value="Balanced">Balanced</option>
            <option value="Studio">Studio</option>
          </select>
        </div>
      </section>
    </div>
  );
}

function StatusItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-app-bg/50 px-3 py-2.5 rounded-lg border border-app-border group hover:border-app-accent/20 transition-colors">
      <span className="text-[9px] font-mono text-app-text-muted uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn("text-[8px] font-mono uppercase", active ? "text-emerald-500" : "text-red-500")}>
          {active ? "OK" : "ERR"}
        </span>
        <div className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]")} />
      </div>
    </div>
  );
}
