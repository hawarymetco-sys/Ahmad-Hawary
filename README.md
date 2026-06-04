<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NewsForge Studio

NewsForge Studio is a mobile-first AI content platform prototype for Arabic news creators. It turns the original AI Studio web interface into a modern installable PWA with:

- Offline-first project queue and automatic sync when the connection returns.
- Dark, midnight AI, and light-gray themes with per-user accent color presets.
- AI image-generation and fast editing workflow placeholders for prompts, styles, brand logo/watermark, background tools, upscaling, and 4K export.
- CapCut-style video workflow placeholders for timeline editing, captions, reels/shorts formats, voice-over, transitions, and high-resolution export.
- One-tap publishing hub for Facebook, Instagram, and TikTok personal/business pages.
- Arabic RTL mobile UX with responsive desktop dashboard layout.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key when wiring real Google AI generation endpoints.
3. Run the app:
   `npm run dev`
4. Build for production:
   `npm run build`

## PWA / Offline behavior

The app registers `public/sw.js`, caches the app shell, and stores queued creative/publishing actions in local storage. When the browser comes back online, queued items are marked as synced automatically.
