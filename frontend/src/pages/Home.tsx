import { useEffect, useState, useCallback } from 'react';
import { Shuffle, Loader2, Monitor, Smartphone, Sun, Moon, Layers } from 'lucide-react';
import wallbloomLogo from '../assets/wallbloom-logo.svg';
import { api, Pattern, Palette } from '../services/api';

const PATTERN_ICONS: Record<string, string> = {
  hills: '⛰', waves: '🌊', dunes: '🏜', mountains: '🗻', arcs: '🌈',
  scribble: '✏️', geometric: '🔷', noise: '🌫', gradient: '🎨', cellular: '🔲',
  spiral: '🌀', hexagon: '⬡', aurora: '🌌', mandala: '🪷', vortex: '💫',
  lightning: '⚡', bubbles: '🫧', diamond: '💎', lava: '🌋', circuit: '🔌',
  galaxy: '🌠', ripple: '💧', mosaic: '🪟',
  terraces: '🏔', tides: '🌬', sandstorm: '🌪', peaks: '⛰',
  rings: '🎯', brushstroke: '🖌', contour: '🗺', plaid: '🧣',
  starburst: '✨', weave: '🧺', pebbles: '🪨', chevron: '〽️', fractal: '🔺',
  cobweb: '🕸', origami: '📐', noodles: '🍜', crystals: '💠', smoke: '💨',
  labyrinth: '🌀', polka: '🔵', feathers: '🪶', scales: '🐟', crosshatch: '✖️',
};

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function fmt24(d: Date) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
}

/* ── Desktop clock overlay ── */
function DesktopOverlay({ now }: { now: Date }) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      <div className="absolute top-4 left-5">
        <p className="text-white font-semibold leading-none" style={{ fontSize: '1.4rem', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
          {fmt24(now)}
        </p>
        <p className="text-white/70 text-xs mt-1" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
          {fmtDate(now)}
        </p>
      </div>
    </div>
  );
}

/* ── Mobile lock-screen overlay — clean screensaver style ── */
function MobileOverlay({ now }: { now: Date }) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none flex flex-col">

      {/* clock + date — positioned in upper-center area */}
      <div className="flex flex-col items-center" style={{ marginTop: '18%' }}>
        <p
          className="text-white font-thin leading-none tracking-widest"
          style={{ fontSize: '42px', textShadow: '0 4px 24px rgba(0,0,0,0.85)', letterSpacing: '0.06em' }}
        >
          {fmt24(now)}
        </p>
        <p
          className="text-white/75 font-light mt-2"
          style={{ fontSize: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.85)', letterSpacing: '0.12em' }}
        >
          {fmtDate(now).toUpperCase()}
        </p>
      </div>

      {/* spacer pushes indicator to bottom */}
      <div className="flex-1" />

      {/* home indicator only */}
      <div className="pb-3 flex justify-center">
        <div className="w-10 h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.45)' }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [selectedPattern, setSelectedPattern] = useState('hills');
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [inverted, setInverted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [blendMode, setBlendMode] = useState(false);
  const [blendPattern, setBlendPattern] = useState('waves');
  const [blendRatio, setBlendRatio] = useState(0.5);
  const [desktopUrl, setDesktopUrl] = useState('');
  const [mobileUrl, setMobileUrl] = useState('');
  const [desktopLoading, setDesktopLoading] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [downloadingDesktop, setDownloadingDesktop] = useState(false);
  const [downloadingMobile, setDownloadingMobile] = useState(false);
  const now = useClock();

  useEffect(() => {
    Promise.all([api.getPatterns(), api.getPalettes()]).then(([p, pal]) => {
      setPatterns(p);
      setPalettes(pal);
    });
  }, []);

  const buildUrls = useCallback(() => {
    setDesktopLoading(true);
    setMobileLoading(true);
    const p2 = blendMode ? blendPattern : undefined;
    const br = blendMode ? blendRatio : undefined;
    setDesktopUrl(api.getPreviewUrl(selectedPattern, selectedPalette, seed, inverted, 1280, 720, p2, br));
    setMobileUrl(api.getPreviewUrl(selectedPattern, selectedPalette, seed, inverted, 390, 844, p2, br));
  }, [selectedPattern, selectedPalette, seed, inverted, blendMode, blendPattern, blendRatio]);

  useEffect(() => { buildUrls(); }, [buildUrls]);

  const handleShuffle = () => setSeed(Math.floor(Math.random() * 1000000));

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleDownloadDesktop = async () => {
    setDownloadingDesktop(true);
    try {
      const p2 = blendMode ? blendPattern : undefined;
      const br = blendMode ? blendRatio : undefined;
      const blob = await api.downloadDesktop(selectedPattern, selectedPalette, seed, inverted, p2, br);
      triggerDownload(blob, `wallbloom_desktop_${seed}.png`);
    } finally { setDownloadingDesktop(false); }
  };

  const handleDownloadMobile = async () => {
    setDownloadingMobile(true);
    try {
      const p2 = blendMode ? blendPattern : undefined;
      const br = blendMode ? blendRatio : undefined;
      const blob = await api.downloadMobile(selectedPattern, selectedPalette, seed, inverted, p2, br);
      triggerDownload(blob, `wallbloom_mobile_${seed}.png`);
    } finally { setDownloadingMobile(false); }
  };

  const selectedPaletteName = palettes[selectedPalette]?.name ?? '';
  const selectedPatternName = patterns.find(p => p.type === selectedPattern)?.name ?? selectedPattern;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#080b14] text-white' : 'bg-[#f0f2f8] text-slate-900'}`}>

      {/* ── HEADER ── */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${darkMode ? 'glass border-white/[0.06]' : 'bg-white/80 backdrop-blur border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={wallbloomLogo} alt="WallBloom" className="w-10 h-10 rounded-xl flex-shrink-0" style={{ display: 'block' }} />
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-bold leading-tight">WallBloom</h1>
              <p className={`text-[10px] leading-tight ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Wallpaper Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-medium rounded-lg transition-all ${
                darkMode
                  ? 'border-white/[0.08] text-slate-400 hover:text-white glass-hover'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 flex-shrink-0" /> : <Moon className="w-3.5 h-3.5 flex-shrink-0" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* ── PREVIEW ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{PATTERN_ICONS[selectedPattern] ?? '🎨'}</span>
            <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedPatternName}</h2>
            <span className={darkMode ? 'text-slate-600' : 'text-slate-400'}>·</span>
            <div className="flex gap-0.5 rounded overflow-hidden h-4 w-10">
              {palettes[selectedPalette]?.colors.slice(0, 4).map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{selectedPaletteName}</span>
            <span className={`ml-auto text-[10px] italic ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>Preview only — downloads are clean</span>
          </div>

          <div className="flex gap-6 items-end">

            {/* ── Desktop preview ── */}
            <div className="flex-1 min-w-0">
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black" style={{ aspectRatio: '16/9' }}>
                {desktopLoading && <div className="absolute inset-0 shimmer z-10" />}
                {desktopUrl && (
                  <img
                    src={desktopUrl}
                    alt="Desktop Preview"
                    className={`w-full h-full object-cover preview-img ${desktopLoading ? 'loading' : ''}`}
                    onLoad={() => setDesktopLoading(false)}
                    onLoadStart={() => setDesktopLoading(true)}
                  />
                )}
                {desktopLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
                  </div>
                )}
                {/* Clock overlay — preview only, not in download */}
                {!desktopLoading && <DesktopOverlay now={now} />}
              </div>
              <div className="flex justify-center mt-1"><div className="w-12 h-2 bg-slate-700 rounded-b" /></div>
              <div className="flex justify-center"><div className="w-20 h-1 bg-slate-600 rounded-full" /></div>
              <p className={`text-center text-[11px] mt-1.5 flex items-center justify-center gap-1 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                <Monitor className="w-3 h-3" /> Desktop · 3840×2160 · 4K
              </p>
            </div>

            {/* ── Mobile preview ── */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div
                className="relative rounded-[1.75rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-black"
                style={{ width: '160px', aspectRatio: '9/19.5' }}
              >
                {/* punch-hole camera */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black rounded-full z-40" />
                {mobileLoading && <div className="absolute inset-0 shimmer z-10" />}
                {mobileUrl && (
                  <img
                    src={mobileUrl}
                    alt="Mobile Preview"
                    className={`w-full h-full object-cover preview-img ${mobileLoading ? 'loading' : ''}`}
                    onLoad={() => setMobileLoading(false)}
                    onLoadStart={() => setMobileLoading(true)}
                  />
                )}
                {mobileLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  </div>
                )}
                {/* Lock screen overlay — preview only, not in download */}
                {!mobileLoading && <MobileOverlay now={now} />}
              </div>
              <p className={`text-[11px] mt-2 flex items-center gap-1 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                <Smartphone className="w-3 h-3" /> Mobile
              </p>
            </div>

          </div>
        </section>

        {/* ── PATTERNS ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Patterns</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all glow-indigo-sm"
              >
                <Shuffle className="w-3 h-3" /> Shuffle Patterns
              </button>
              <button
                onClick={() => setBlendMode(!blendMode)}
                className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-medium rounded-lg transition-all ${
                  blendMode
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400'
                    : darkMode
                      ? 'border-white/[0.08] text-slate-400 hover:text-white glass-hover'
                      : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3 h-3" /> Blend Two Patterns
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {patterns.map(p => (
              <button
                key={p.type}
                onClick={() => setSelectedPattern(p.type)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all ${
                  selectedPattern === p.type
                    ? 'border-indigo-500 bg-indigo-600/10'
                    : darkMode ? 'border-white/[0.06] hover:border-white/20 hover:bg-white/5' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <span className="text-xl leading-none">{PATTERN_ICONS[p.type] ?? '🎨'}</span>
                <span className={`text-[10px] font-medium text-center leading-tight ${
                  selectedPattern === p.type ? 'text-indigo-500' : darkMode ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>

          {/* ── BLEND CONTROLS ── */}
          {blendMode && (
            <div className="mt-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
              <p className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                <Layers className="w-3.5 h-3.5" /> Blend with second pattern
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {patterns.map(p => (
                  <button
                    key={p.type}
                    onClick={() => setBlendPattern(p.type)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all ${
                      blendPattern === p.type
                        ? 'border-purple-500 bg-purple-600/10'
                        : darkMode ? 'border-white/[0.06] hover:border-white/20 hover:bg-white/5' : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <span className="text-xl leading-none">{PATTERN_ICONS[p.type] ?? '🎨'}</span>
                    <span className={`text-[10px] font-medium text-center leading-tight ${
                      blendPattern === p.type ? 'text-purple-500' : darkMode ? 'text-slate-400' : 'text-slate-700'
                    }`}>
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs w-20 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{PATTERN_ICONS[selectedPattern]} {Math.round((1 - blendRatio) * 100)}%</span>
                <input
                  type="range" min={0} max={1} step={0.01}
                  value={blendRatio}
                  onChange={e => setBlendRatio(parseFloat(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className={`text-xs w-20 text-right ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{Math.round(blendRatio * 100)}% {PATTERN_ICONS[blendPattern]}</span>
              </div>
            </div>
          )}
        </section>

        {/* ── PALETTES ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Color Palettes</h2>
            <button
              onClick={() => setInverted(!inverted)}
              className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-medium rounded-lg transition-all ${
                inverted
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-500'
                  : darkMode
                    ? 'border-white/[0.08] text-slate-400 hover:text-white glass-hover'
                    : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {inverted ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />} Invert Colors
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
            {palettes.map((pal, idx) => (
              <button
                key={pal.id}
                onClick={() => setSelectedPalette(idx)}
                className={`p-2.5 rounded-xl border transition-all ${
                  selectedPalette === idx
                    ? 'palette-selected border-indigo-500 bg-indigo-600/10'
                    : darkMode ? 'border-white/[0.06] glass-hover' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex gap-0.5 rounded-md overflow-hidden h-6 mb-2">
                  {pal.colors.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <p className={`text-[10px] font-medium text-center truncate ${
                  selectedPalette === idx ? 'text-indigo-300' : darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {pal.name}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ── DOWNLOAD ── */}
        <section className="pb-10">
          <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Download</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleDownloadDesktop}
              disabled={downloadingDesktop}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all glow-indigo"
            >
              {downloadingDesktop
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating 4K...</>
                : <><Monitor className="w-4 h-4" /> Desktop 4K <span className="text-indigo-300 font-normal text-xs ml-1">3840×2160</span></>
              }
            </button>
            <button
              onClick={handleDownloadMobile}
              disabled={downloadingMobile}
              className={`flex items-center gap-2 px-6 py-3 border disabled:opacity-50 text-sm font-semibold rounded-xl transition-all ${
                darkMode
                  ? 'glass glass-hover border-white/10 hover:border-indigo-500/40 text-white'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-100 text-slate-900'
              }`}
            >
              {downloadingMobile
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                : <><Smartphone className="w-4 h-4" /> Mobile <span className={`font-normal text-xs ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>1290×2796</span></>
              }
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
