import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Brush,
  Camera,
  ChevronRight,
  Cloud,
  CloudOff,
  Download,
  Facebook,
  Film,
  ImagePlus,
  Instagram,
  LayoutDashboard,
  Menu,
  Moon,
  Palette,
  Radio,
  Rocket,
  Save,
  Scissors,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  UploadCloud,
  WandSparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "./lib/utils";
import { queueOfflineAction, readSyncQueue, syncOfflineQueue, SyncItem } from "./lib/offlineSync";

type ThemeName = "dark" | "light-gray" | "midnight";

type PalettePreset = {
  name: string;
  value: string;
  gradient: string;
};

const palettePresets: PalettePreset[] = [
  { name: "أزرق احترافي", value: "#3b82f6", gradient: "from-blue-500 to-cyan-400" },
  { name: "بنفسجي AI", value: "#8b5cf6", gradient: "from-violet-500 to-fuchsia-400" },
  { name: "أخضر منصات", value: "#10b981", gradient: "from-emerald-500 to-teal-400" },
  { name: "برتقالي أخبار", value: "#f97316", gradient: "from-orange-500 to-amber-300" },
];

const smartModules = [
  {
    title: "مولّد صور احترافية",
    subtitle: "Prompts عربية، Styles جاهزة، Logo placement، إزالة الخلفية، upscale ونسخ مخصصة لكل منصة.",
    icon: ImagePlus,
    chips: ["Gemini/Imagen", "Brand Kit", "4K Export"],
  },
  {
    title: "محرر فيديو مثل CapCut",
    subtitle: "Timeline سريع، قص تلقائي، كابشن ذكي، انتقالات، موسيقى، إزالة ضوضاء وتصدير Reel/Short/TikTok.",
    icon: Film,
    chips: ["Veo-ready", "Auto Captions", "9:16 / 16:9"],
  },
  {
    title: "منصة أخبار ذكية",
    subtitle: "جمع مصادر، تلخيص، تدقيق لهجة، اقتراح عناوين، جدولة ونشر مباشر لصفحاتك الشخصية والعملية.",
    icon: Radio,
    chips: ["Fact-check", "SEO", "One-click Publish"],
  },
];

const editorTools = [
  "تحسين جودة الصورة",
  "إزالة/تبديل الخلفية",
  "توليد صور من نص أو صورة",
  "إضافة لوجو وWatermark",
  "قص تلقائي للريلز",
  "كابشن وترجمة فورية",
  "Voice-over بالذكاء الاصطناعي",
  "قوالب أخبار عاجلة",
  "جدولة النشر",
  "تحليل أداء المحتوى",
];

const platforms = [
  { name: "Facebook", icon: Facebook, tone: "text-blue-500" },
  { name: "Instagram", icon: Instagram, tone: "text-pink-500" },
  { name: "TikTok", icon: MusicNote, tone: "text-cyan-400" },
];

export default function App() {
  const [theme, setTheme] = useState<ThemeName>("dark");
  const [palette, setPalette] = useState(palettePresets[0]);
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [queue, setQueue] = useState<SyncItem[]>([]);
  const [logoName, setLogoName] = useState("Ahmad News HD");
  const [prompt, setPrompt] = useState("صورة خبر عاجل عصرية عن التكنولوجيا في القاهرة بإضاءة سينمائية");
  const queuedCount = queue.filter((item) => item.status === "queued").length;

  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light-gray", "theme-midnight");
    document.body.classList.add(`theme-${theme}`);
    document.documentElement.style.setProperty("--accent", palette.value);
    document.documentElement.style.setProperty("--accent-muted", `${palette.value}22`);
    document.documentElement.style.setProperty("--accent-glow", `${palette.value}66`);
  }, [palette.value, theme]);

  useEffect(() => {
    const refreshQueue = () => setQueue(readSyncQueue());
    const goOnline = async () => {
      setOnline(true);
      await syncOfflineQueue();
      refreshQueue();
    };
    const goOffline = () => setOnline(false);

    refreshQueue();
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    window.addEventListener("offline-sync-updated", refreshQueue);
    if (navigator.onLine) syncOfflineQueue().then(refreshQueue);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("offline-sync-updated", refreshQueue);
    };
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  const previewStyles = useMemo(
    () => ["سينمائي", "واقعي", "Breaking News", "استديو", "Minimal", "3D"],
    [],
  );

  const addDemoJob = (type: SyncItem["type"], title: string) => {
    queueOfflineAction({
      type,
      title,
      payload: { prompt, logoName, palette: palette.name, theme },
    });
    if (navigator.onLine) syncOfflineQueue();
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-app-accent/20 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden border-x border-app-border bg-app-bg/80 shadow-2xl lg:max-w-6xl lg:grid lg:grid-cols-[88px_1fr]">
        <aside className="hidden border-r border-app-border bg-app-surface/70 p-4 lg:flex lg:flex-col lg:items-center lg:gap-6">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", palette.gradient)}>
            <Radio className="h-6 w-6" />
          </div>
          {[LayoutDashboard, WandSparkles, Film, Share2, Settings].map((Icon, index) => (
            <button
              key={index}
              className={cn(
                "rounded-2xl p-3 transition hover:bg-app-surface-hover",
                index === 0 ? "bg-app-accent/15 text-app-accent" : "text-app-text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </aside>

        <main className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-app-border bg-app-surface/85 px-4 py-3 backdrop-blur-xl lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button className="rounded-2xl border border-app-border p-2 lg:hidden">
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-app-text-muted">AI News Mobile</p>
                  <h1 className="text-lg font-black">NewsForge Studio</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill online={online} queuedCount={queuedCount} />
                <button className="rounded-2xl border border-app-border p-2 text-app-text-muted">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <section className="flex-1 space-y-5 overflow-y-auto p-4 pb-28 lg:p-8 lg:pb-10">
            <div className="overflow-hidden rounded-[2rem] border border-app-border bg-app-surface p-5 shadow-2xl lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:p-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-app-border bg-app-accent-muted px-3 py-1 text-xs font-bold text-app-accent">
                  <Sparkles className="h-4 w-4" />
                  Offline-first + Auto Sync + Google AI ready
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black leading-tight lg:text-5xl">استديو موبيل عالمي للأخبار والصور والفيديو بالذكاء الاصطناعي</h2>
                  <p className="text-sm leading-7 text-app-text-muted lg:text-base">
                    واجهة مطابقة لفكرة لوحة التحكم الحالية لكن Mobile-first: إنشاء محتوى، تعديل صور وفيديو، اختيار اللوجو، الحفظ أوفلاين، ثم مزامنة ونشر مباشر عند رجوع الإنترنت.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric value="4K" label="تصدير عالي" />
                  <Metric value="1 Tap" label="نشر مباشر" />
                  <Metric value="Offline" label="عمل بدون نت" />
                  <Metric value="RTL" label="عربي كامل" />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => addDemoJob("render", "توليد صورة احترافية")}
                    className="flex-1 rounded-2xl bg-app-accent px-4 py-3 text-sm font-black text-white shadow-lg shadow-app-accent/20 active:scale-95"
                  >
                    ابدأ مشروع AI
                  </button>
                  <button
                    onClick={() => addDemoJob("publish", "نشر منشور متعدد المنصات")}
                    className="rounded-2xl border border-app-border px-4 py-3 text-sm font-black active:scale-95"
                  >
                    نشر تجريبي
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-app-border bg-app-bg p-3 lg:mt-0">
                <div className="aspect-[9/12] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-slate-950 via-slate-900 to-app-accent/70 p-4 text-white shadow-inner">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest opacity-80">
                    <span>Breaking</span>
                    <span>{logoName}</span>
                  </div>
                  <div className="mt-24 space-y-3">
                    <div className="w-fit rounded-full bg-red-600 px-3 py-1 text-xs font-black">خبر عاجل</div>
                    <h3 className="text-3xl font-black leading-tight">محتوى احترافي جاهز لكل منصة</h3>
                    <p className="text-sm text-white/75">صور، Reels، Shorts، Captions، Brand Kit، وجدولة نشر بضغطة واحدة.</p>
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-2 pt-12">
                    {platforms.map(({ name, icon: Icon }) => (
                      <div key={name} className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                        <Icon className="mx-auto h-5 w-5" />
                        <p className="mt-1 text-[10px] font-bold">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {smartModules.map((module) => (
                <FeatureCard key={module.title} {...module} />
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
              <section className="rounded-[2rem] border border-app-border bg-app-surface p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-app-text-muted">AI Creative Lab</p>
                    <h3 className="text-xl font-black">أدوات الصور والفيديو السريعة والمتقدمة</h3>
                  </div>
                  <Brush className="h-6 w-6 text-app-accent" />
                </div>

                <label className="text-xs font-bold text-app-text-muted">Prompt توليد الصورة</label>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  className="mt-2 h-24 w-full resize-none rounded-2xl border border-app-border bg-app-bg p-4 text-sm outline-none focus:border-app-accent"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  {previewStyles.map((style) => (
                    <button key={style} className="rounded-full border border-app-border px-3 py-1 text-xs font-bold hover:border-app-accent hover:text-app-accent">
                      {style}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
                  {editorTools.map((tool) => (
                    <button key={tool} className="rounded-2xl border border-app-border bg-app-bg p-3 text-right text-xs font-bold leading-5 transition hover:-translate-y-1 hover:border-app-accent">
                      {tool}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <Panel title="تخصيص الهوية والألوان" icon={Palette}>
                  <label className="text-xs font-bold text-app-text-muted">اسم اللوجو على التصميم</label>
                  <input
                    value={logoName}
                    onChange={(event) => setLogoName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-app-border bg-app-bg px-4 py-3 text-sm outline-none focus:border-app-accent"
                  />
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {palettePresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setPalette(preset)}
                        className={cn("h-12 rounded-2xl border-2 transition", palette.name === preset.name ? "border-app-text" : "border-app-border")}
                        style={{ background: preset.value }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <ThemeButton active={theme === "dark"} onClick={() => setTheme("dark")} icon={Moon} label="Dark" />
                    <ThemeButton active={theme === "light-gray"} onClick={() => setTheme("light-gray")} icon={Sun} label="Gray" />
                    <ThemeButton active={theme === "midnight"} onClick={() => setTheme("midnight")} icon={Sparkles} label="AI" />
                  </div>
                </Panel>

                <Panel title="المزامنة والنشر" icon={UploadCloud}>
                  <div className="space-y-3">
                    <SyncRow icon={Save} label="حفظ أوفلاين" value="Indexed Queue" />
                    <SyncRow icon={Cloud} label="مزامنة تلقائية" value={online ? "متصل الآن" : "في الانتظار"} />
                    <SyncRow icon={ShieldCheck} label="صلاحيات الصفحات" value="Personal / Business" />
                    <SyncRow icon={Download} label="التصدير" value="PNG / MP4 / 4K" />
                  </div>
                </Panel>
              </section>
            </div>

            <section className="rounded-[2rem] border border-app-border bg-app-surface p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-app-text-muted">Publishing Hub</p>
                  <h3 className="text-xl font-black">نشر مباشر على صفحاتك بضغطة واحدة</h3>
                </div>
                <Rocket className="h-6 w-6 text-app-accent" />
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {platforms.map(({ name, icon: Icon, tone }) => (
                  <button key={name} onClick={() => addDemoJob("publish", `نشر على ${name}`)} className="flex items-center justify-between rounded-2xl border border-app-border bg-app-bg p-4 text-left transition hover:border-app-accent">
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-6 w-6", tone)} />
                      <div>
                        <p className="font-black">{name}</p>
                        <p className="text-xs text-app-text-muted">Posts, Stories, Reels</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-app-text-muted" />
                  </button>
                ))}
              </div>
            </section>
          </section>

          <BottomNav />
        </main>
      </div>
    </div>
  );
}

function StatusPill({ online, queuedCount }: { online: boolean; queuedCount: number }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black", online ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-amber-500/30 bg-amber-500/10 text-amber-400")}>
      {online ? <Cloud className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
      <span>{online ? "Online" : "Offline"}</span>
      <AnimatePresence>
        {queuedCount > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="rounded-full bg-app-text px-2 py-0.5 text-[10px] text-app-bg">
            {queuedCount}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-app-border bg-app-bg p-3 text-center">
      <p className="text-lg font-black text-app-accent">{value}</p>
      <p className="text-[10px] font-bold text-app-text-muted">{label}</p>
    </div>
  );
}

function FeatureCard({ title, subtitle, icon: Icon, chips }: { title: string; subtitle: string; icon: React.ElementType; chips: string[] }) {
  return (
    <article className="rounded-[1.5rem] border border-app-border bg-app-surface p-5 shadow-xl transition hover:-translate-y-1 hover:border-app-accent/60">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-app-accent-muted text-app-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-app-text-muted">{subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span key={chip} className="rounded-full bg-app-bg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-app-text-muted">
            {chip}
          </span>
        ))}
      </div>
    </article>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-app-border bg-app-surface p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black">{title}</h3>
        <Icon className="h-5 w-5 text-app-accent" />
      </div>
      {children}
    </div>
  );
}

function ThemeButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button onClick={onClick} className={cn("rounded-2xl border p-3 text-xs font-black", active ? "border-app-accent bg-app-accent-muted text-app-accent" : "border-app-border bg-app-bg text-app-text-muted")}>
      <Icon className="mx-auto mb-1 h-4 w-4" />
      {label}
    </button>
  );
}

function SyncRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-app-border bg-app-bg p-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-app-accent" />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <span className="text-xs font-bold text-app-text-muted">{value}</span>
    </div>
  );
}

function BottomNav() {
  const items = [
    { label: "الرئيسية", icon: LayoutDashboard, active: true },
    { label: "صور", icon: Camera },
    { label: "فيديو", icon: Scissors },
    { label: "نشر", icon: Share2 },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 grid w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 grid-cols-4 rounded-[1.5rem] border border-app-border bg-app-surface/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
      {items.map(({ label, icon: Icon, active }) => (
        <button key={label} className={cn("rounded-2xl px-2 py-2 text-[10px] font-black", active ? "bg-app-accent text-white" : "text-app-text-muted")}> 
          <Icon className="mx-auto mb-1 h-5 w-5" />
          {label}
        </button>
      ))}
    </nav>
  );
}

function MusicNote(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
