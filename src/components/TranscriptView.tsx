import React, { useEffect, useRef, useState } from "react";
import { FileText, Download, Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranscriptItem } from "../types";

interface TranscriptViewProps {
  transcripts: TranscriptItem[];
  isStreaming: boolean;
}

export function TranscriptView({ transcripts, isStreaming }: TranscriptViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [transcripts, isUserScrolling]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 100;
    
    if (!isAtBottom) {
      setIsUserScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 3000); // Increased to 3s for better UX
    } else {
      setIsUserScrolling(false);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    }
  };

  const handleExport = () => {
    const text = transcripts.map(t => `[${t.timestamp}] ${t.speaker}:\nOriginal: ${t.original}\nTranslated: ${t.translated}\n`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neural-transcript.txt";
    a.click();
  };

  return (
    <div className="flex flex-col h-full relative bg-app-surface border border-app-border rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-app-border bg-app-surface/50 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-app-accent/10 flex items-center justify-center border border-app-accent/20">
            <FileText className="w-4 h-4 text-app-accent" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-app-text">Neural Console</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-mono text-app-text-muted uppercase tracking-widest">Live Feed Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleExport}
          disabled={transcripts.length === 0}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-app-accent hover:bg-app-accent/10 px-3 py-2 rounded-lg border border-app-accent/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
      </div>

      {/* Content Area - Cohesive Console Layout */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-app-bg/20 min-h-0"
      >
        <div className="space-y-6 pb-4">
          <AnimatePresence initial={false}>
            {transcripts.length === 0 ? (
              <div className="h-full py-32 flex flex-col items-center justify-center text-app-text-muted opacity-30 space-y-4">
                <div className="relative">
                  <Clock className="w-12 h-12 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-0 bg-app-accent/20 blur-xl rounded-full" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Awaiting Neural Data...</p>
              </div>
            ) : (
              transcripts.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative pl-4 border-l-2 border-app-border hover:border-app-accent transition-colors"
                >
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-app-border group-hover:bg-app-accent transition-colors" />
                  
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[9px] font-black text-app-accent uppercase tracking-widest bg-app-accent/10 px-2 py-0.5 rounded border border-app-accent/20">
                      {item.speaker}
                    </span>
                    <span className="text-[8px] font-mono text-app-text-muted opacity-60">
                      {item.timestamp}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-app-text-muted leading-relaxed font-mono opacity-80">
                      {item.original}
                    </p>
                    <p className="text-xs font-bold text-app-text leading-snug tracking-tight">
                      {item.translated}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          
          {isStreaming && transcripts.length > 0 && (
            <div className="flex items-center gap-3 py-4 border-t border-app-border/20">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-app-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-app-accent rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <span className="w-1.5 h-1.5 bg-app-accent rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-app-accent opacity-80">Processing Neural Stream</span>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button overlay */}
      <AnimatePresence>
        {isUserScrolling && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => {
              setIsUserScrolling(false);
              scrollToBottom();
            }}
            className="absolute bottom-6 right-6 bg-app-accent text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 border-4 border-app-surface"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
