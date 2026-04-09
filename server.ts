import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // CORS Configuration for Cloud Run / Iframe
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (origin.endsWith('.run.app') || origin.includes('localhost'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Mock Dependency Installer Status
  app.get("/api/system/status", (req, res) => {
    res.json({
      ffmpeg: true,
      ytDlp: true,
      whisper: true,
      edgeTts: true,
      gpu: false,
      latencyMode: "balanced",
    });
  });

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    let streamInterval: NodeJS.Timeout | null = null;

    socket.on("start-stream", (data) => {
      console.log("Starting stream processing for:", data.url);
      if (streamInterval) clearInterval(streamInterval);

      // Simulate processing steps
      let progress = 0;
      const steps = ["Detecting stream", "Extracting audio", "Detecting language", "Transcribing", "Translating", "Dubbing"];
      
      streamInterval = setInterval(() => {
        if (progress < steps.length) {
          socket.emit("stream-status", { step: steps[progress], progress: (progress + 1) / steps.length * 100 });
          progress++;
        } else {
          if (streamInterval) clearInterval(streamInterval);
          streamInterval = null;
          socket.emit("stream-ready", { audioUrl: "/mock-dub.mp3", subtitles: [] });
        }
      }, 1000);
    });

    socket.on("stop-stream", () => {
      console.log("Stopping stream processing");
      if (streamInterval) {
        clearInterval(streamInterval);
        streamInterval = null;
      }
      socket.emit("stream-stopped");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      if (streamInterval) clearInterval(streamInterval);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
