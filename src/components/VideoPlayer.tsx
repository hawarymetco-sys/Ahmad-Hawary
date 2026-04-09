import React, { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, Square, SkipBack, SkipForward, 
  Volume2, VolumeX, Maximize, Minimize, 
  Settings, Subtitles, AudioLines, ZoomIn, ZoomOut, RotateCcw,
  Monitor, Video
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface VideoPlayerProps {
  isStreaming: boolean;
  onStop: () => void;
  streamUrl?: string;
}

export function VideoPlayer({ isStreaming, onStop, streamUrl }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [dubEnabled, setDubEnabled] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && isStreaming) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && isStreaming) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isStreaming]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative group bg-black overflow-hidden rounded-xl border-2 border-app-border aspect-video flex items-center justify-center transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 rounded-none border-none"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && isStreaming && setShowControls(false)}
    >
      {/* Video Content */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-300 relative"
        style={{ transform: `scale(${zoom})` }}
      >
        {!isStreaming ? (
          <div className="text-center space-y-4 z-10">
            <div className="w-20 h-20 bg-app-surface rounded-full flex items-center justify-center mx-auto border-2 border-app-border shadow-xl">
              <Monitor className="w-10 h-10 text-app-text-muted" />
            </div>
            <p className="text-app-text-muted font-bold uppercase tracking-widest text-xs">Ready for Broadcast</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 relative overflow-hidden">
            {/* Actual Video if it's a direct link, otherwise visualizer */}
            {streamUrl && (streamUrl.endsWith('.mp4') || streamUrl.endsWith('.webm') || streamUrl.includes('mov_bbb')) ? (
              <video 
                ref={videoRef}
                src={streamUrl}
                className="w-full h-full object-contain"
                autoPlay
                muted={isMuted}
                loop
              />
            ) : (
              <>
                {/* Professional Signal Visualizer instead of cartoon */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-app-accent/30 via-transparent to-transparent animate-pulse" />
                  <div className="grid grid-cols-12 h-full w-full gap-1 p-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ["20%", "60%", "30%", "80%", "20%"] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                        className="bg-app-accent/40 w-full rounded-full self-center"
                      />
                    ))}
                  </div>
                </div>
                
                <div className="z-10 text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-app-accent/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                      <div className="w-20 h-20 rounded-full border-4 border-t-app-accent border-r-transparent border-b-transparent border-l-transparent" />
                    </div>
                    <Video className="w-10 h-10 text-app-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">Signal Locked</h2>
                    <p className="text-app-accent text-[10px] font-mono uppercase tracking-widest animate-pulse">Processing Neural Translation...</p>
                  </div>
                </div>
              </>
            )}

            {/* Scanning Line */}
            <motion.div 
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-px bg-app-accent/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
            />
          </div>
        )}

        {/* Live Overlay */}
        {isStreaming && (
          <div className="absolute top-6 left-6 z-40 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-md shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-400/30">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              <span className="text-[11px] font-black text-white uppercase tracking-widest">Live</span>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-[10px] font-mono text-white/80">
              00:42:15:08
            </div>
          </div>
        )}

        {/* Subtitles Overlay */}
        <AnimatePresence>
          {isStreaming && showSubtitles && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-[80%] text-center z-20"
            >
              <p className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-xl text-lg font-bold text-white shadow-2xl border border-white/20">
                "The AI is currently processing the live feed for real-time translation."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Overlay */}
      <AnimatePresence>
        {(showControls || !isPlaying || !isStreaming) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/40 to-transparent pt-24 z-30"
          >
            {/* Timeline - High Tech Style */}
            <div className="relative h-1.5 w-full bg-white/10 rounded-full mb-6 cursor-pointer group/timeline overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-app-accent via-blue-400 to-app-accent rounded-full w-[65%] shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
              </div>
              <div className="absolute top-1/2 left-[65%] -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-0 group-hover/timeline:scale-100 transition-transform z-10" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-app-accent transition-colors"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
                </button>
                <button 
                  onClick={onStop}
                  className="text-red-500 hover:scale-110 transition-transform"
                >
                  <Square className="w-6 h-6 fill-current" />
                </button>
                
                <div className="flex items-center gap-3 group/vol">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-white">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={volume} 
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-app-accent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/10">
                  <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 text-white hover:bg-white/10 rounded-full"><ZoomOut className="w-4 h-4" /></button>
                  <button onClick={() => setZoom(1)} className="p-1.5 text-white hover:bg-white/10 rounded-full"><RotateCcw className="w-4 h-4" /></button>
                  <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1.5 text-white hover:bg-white/10 rounded-full"><ZoomIn className="w-4 h-4" /></button>
                </div>

                <button 
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={cn(
                    "p-2.5 rounded-full transition-all border",
                    showSubtitles ? "bg-app-accent text-white border-app-accent shadow-lg shadow-app-accent/30" : "text-white/60 border-white/10 hover:bg-white/10"
                  )}
                >
                  <Subtitles className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setDubEnabled(!dubEnabled)}
                  className={cn(
                    "p-2.5 rounded-full transition-all border",
                    dubEnabled ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30" : "text-white/60 border-white/10 hover:bg-white/10"
                  )}
                >
                  <AudioLines className="w-5 h-5" />
                </button>
                <button onClick={toggleFullscreen} className="p-2.5 text-white hover:bg-white/10 rounded-full transition-colors border border-white/10">
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
