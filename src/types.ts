export type Language = "Arabic" | "English" | "Persian";
export type VoiceGender = "Auto" | "Male" | "Female";
export type VoiceStyle = "Neutral" | "Broadcast" | "Cinema" | "Narration" | "Documentary";
export type LatencyMode = "Ultra Low" | "Balanced" | "Studio";
export type Theme = "light" | "dark" | "blue-grey" | "cinema" | "cyber";

export interface StreamStatus {
  step: string;
  progress: number;
}

export interface SystemStatus {
  ffmpeg: boolean;
  ytDlp: boolean;
  whisper: boolean;
  edgeTts: boolean;
  gpu: boolean;
  latencyMode: string;
}

export interface TranscriptItem {
  timestamp: string;
  speaker: string;
  original: string;
  translated: string;
}
