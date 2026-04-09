import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { StreamStatus, SystemStatus, TranscriptItem } from "../types";

export function useStreaming() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<StreamStatus | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string>("Detecting...");

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    let mockInterval: NodeJS.Timeout | null = null;

    newSocket.on("stream-status", (data: StreamStatus) => {
      setStatus(data);
    });

    newSocket.on("stream-ready", () => {
      setStatus({ step: "Live", progress: 100 });
      
      if (mockInterval) clearInterval(mockInterval);
      
      let cycle = 0;
      const languages = ["English", "Arabic", "Persian"];
      
      mockInterval = setInterval(() => {
        const currentLang = languages[cycle % languages.length];
        setDetectedLanguage(`${currentLang} (Auto)`);
        
        const speakers = ["Speaker A", "Speaker B"];
        const speaker = speakers[Math.floor(Math.random() * speakers.length)];
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const mocks: Record<string, { original: string; translated: string }[]> = {
          "English": [
            { original: "The system is analyzing the audio stream.", translated: "النظام يقوم بتحليل تدفق الصوت." },
            { original: "Real-time dubbing is now active.", translated: "الدبلجة الفورية نشطة الآن." }
          ],
          "Arabic": [
            { original: "مرحباً بكم في هذا البث المباشر المتقدم.", translated: "Welcome to this advanced live broadcast." },
            { original: "نحن نستخدم أحدث تقنيات الذكاء الاصطناعي.", translated: "We are using the latest AI technologies." }
          ],
          "Persian": [
            { original: "این یک نمایش از ترجمه همزمان است.", translated: "This is a demonstration of simultaneous translation." },
            { original: "امیدواریم از این تجربه لذت ببرید.", translated: "We hope you enjoy this experience." }
          ]
        };

        const currentMocks = mocks[currentLang];
        const mock = currentMocks[Math.floor(Math.random() * currentMocks.length)];
        
        setTranscripts(prev => [...prev, {
          timestamp,
          speaker,
          original: mock.original,
          translated: mock.translated
        }]);

        cycle++;
      }, 4000);
    });

    newSocket.on("stream-stopped", () => {
      setIsStreaming(false);
      setStatus(null);
      setDetectedLanguage("Standby");
      if (mockInterval) {
        clearInterval(mockInterval);
        mockInterval = null;
      }
    });

    // Fetch initial system status
    fetch("/api/system/status")
      .then((res) => res.json())
      .then((data) => setSystemStatus(data))
      .catch(err => console.error("Failed to fetch system status", err));

    return () => {
      if (mockInterval) clearInterval(mockInterval);
      newSocket.close();
    };
  }, []);

  const startStream = useCallback((url: string) => {
    if (socket) {
      socket.emit("start-stream", { url });
      setIsStreaming(true);
      setTranscripts([]);
      setDetectedLanguage("Detecting...");
    }
  }, [socket]);

  const stopStream = useCallback(() => {
    if (socket) {
      socket.emit("stop-stream");
    }
  }, [socket]);

  return {
    isStreaming,
    status,
    systemStatus,
    transcripts,
    detectedLanguage,
    startStream,
    stopStream,
  };
}
