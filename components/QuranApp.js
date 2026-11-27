"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  StickyNote,
  Search,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  Eye,
  Sun,
  Moon,
  Coffee,
  Menu,
  X,
  CheckCircle2,
  Award,
  SlidersHorizontal,
  ArrowRight,
  Trash2,
} from "lucide-react";

const RECITERS = [
  { id: "Alafasy_128kbps", name: "Mishary Rashid Alafasy" },
  { id: "Abdurrahmaan_As-Sudais_192kbps", name: "Abdurrahman As-Sudais" },
  { id: "Ghamadi_40kbps", name: "Saad Al-Ghamdi" },
  { id: "MaherAlMuaiqly128kbps", name: "Maher Al-Muaiqly" },
  { id: "Yasser_Ad-Dussary_128kbps", name: "Yasser Al-Dosari" },
  { id: "Husary_128kbps", name: "Mahmoud Khalil Al-Husary" },
  { id: "Minshawy_Murattal_128kbps", name: "Mohamed Siddiq Al-Minshawi" },
  { id: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit (Murattal)" },
];

const THEME_STYLES = {
  light: {
    page: "bg-stone-50 text-stone-900",
    surface: "bg-white border-stone-200",
    surfaceAlt: "bg-stone-100/80 border-stone-200",
    muted: "text-stone-500",
    accent: "text-emerald-700",
    accentBg: "bg-emerald-700 text-white hover:bg-emerald-800",
    accentSoft: "bg-emerald-50 text-emerald-800 border-emerald-200",
    activeAyah: "ring-2 ring-emerald-500 bg-emerald-50/50",
  },
  sepia: {
    page: "bg-[#f6efe2] text-[#3a2e21]",
    surface: "bg-[#fbf6ec] border-[#e4d7c1]",
    surfaceAlt: "bg-[#efe5d2] border-[#e0d2b8]",
    muted: "text-[#7a6855]",
    accent: "text-emerald-800",
    accentBg: "bg-emerald-800 text-white hover:bg-emerald-900",
    accentSoft: "bg-emerald-900/10 text-emerald-900 border-emerald-800/20",
    activeAyah: "ring-2 ring-emerald-700 bg-emerald-900/5",
  },
  dark: {
    page: "bg-zinc-950 text-zinc-100",
    surface: "bg-zinc-900 border-zinc-800",
    surfaceAlt: "bg-zinc-800/70 border-zinc-700",
    muted: "text-zinc-400",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-600 text-white hover:bg-emerald-500",
    accentSoft: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    activeAyah: "ring-2 ring-emerald-500 bg-emerald-950/40",
  },
};

export default function QuranApp() {
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("surahs"); // surahs | bookmarks | notes | hifz
  const [surahFilter, setSurahFilter] = useState("");

  const [surahs, setSurahs] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loadingSurah, setLoadingSurah] = useState(true);

  const [progress, setProgress] = useState(null);
  const [bookmarksList, setBookmarksList] = useState([]);
  const [notesList, setNotesList] = useState([]);
  const [hifzList, setHifzList] = useState([]);

  // Reader settings
  const [arabicSize, setArabicSize] = useState(32);
  const [translationLang, setTranslationLang] = useState("en_tl"); // en_tl | tagalog | english | en_id | indonesian | off
  const [showSettings, setShowSettings] = useState(false);
  const [reciter, setReciter] = useState("Alafasy_128kbps");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Inline note editor state
  const [editingNoteAyah, setEditingNoteAyah] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Audio player state
  const audioRef = useRef(null);
  const pendingSeekRatioRef = useRef(null);
  const [playingAyahNumber, setPlayingAyahNumber] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopAyah, setLoopAyah] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [readGuide, setReadGuide] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);

  const ayahRefs = useRef({});
  const t = THEME_STYLES[theme];

  const loadSurahsAndProgress = useCallback(async () => {
    const res = await fetch("/api/surahs");
    const data = await res.json();
    if (data.surahs) setSurahs(data.surahs);
    if (data.progress) setProgress(data.progress);
    return data.progress;
  }, []);

  const loadStudyLists = useCallback(async () => {
    const [bRes, nRes, hRes] = await Promise.all([
      fetch("/api/bookmarks"),
      fetch("/api/notes"),
      fetch("/api/hifz"),
    ]);
    const [bData, nData, hData] = await Promise.all([
      bRes.json(),
      nRes.json(),
      hRes.json(),
    ]);
    if (bData.bookmarks) setBookmarksList(bData.bookmarks);
    if (nData.notes) setNotesList(nData.notes);
    if (hData.goals) setHifzList(hData.goals);
  }, []);

  const loadSurah = useCallback(
    async (surahNumber, targetAyah = null, reciterId = reciter) => {
      setLoadingSurah(true);
      setPlayingAyahNumber(null);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      try {
        const res = await fetch(`/api/surahs/${surahNumber}?reciter=${reciterId}`);
        const data = await res.json();
        if (data.surah) setCurrentSurah(data.surah);
        if (data.ayahs) setAyahs(data.ayahs);
        setSidebarOpen(false);

        if (targetAyah) {
          setTimeout(() => {
            const el = ayahRefs.current[targetAyah];
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 120);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } finally {
        setLoadingSurah(false);
      }
    },
    [reciter]
  );

  // Initial load (supports ?surah=18&ayah=10 from landing page links)
  useEffect(() => {
    (async () => {
      const prog = await loadSurahsAndProgress();
      await loadStudyLists();
      const params = new URLSearchParams(window.location.search);
      const paramSurah = Number(params.get("surah"));
      const paramAyah = Number(params.get("ayah"));
      const initialSurah =
        Number.isInteger(paramSurah) && paramSurah >= 1 && paramSurah <= 114
          ? paramSurah
          : prog?.surah_number || 1;
      const initialAyah =
        Number.isInteger(paramAyah) && paramAyah >= 1
          ? paramAyah
          : !paramSurah
            ? prog?.ayah_number || null
            : null;
      await loadSurah(initialSurah, initialAyah);
    })();
  }, [loadSurahsAndProgress, loadStudyLists, loadSurah]);

  // Reload audio URLs when reciter changes
  const handleReciterChange = async (newReciter) => {
    setReciter(newReciter);
    if (currentSurah) {
      const res = await fetch(`/api/surahs/${currentSurah.number}?reciter=${newReciter}`);
      const data = await res.json();
      if (data.ayahs) setAyahs(data.ayahs);
    }
  };

  // Search handler (debounced)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Audio playback logic
  const playAyah = useCallback(
    (ayahNumber) => {
      const ayah = ayahs.find((a) => a.ayah_number === ayahNumber);
      if (!ayah || !audioRef.current) return;

      if (playingAyahNumber === ayahNumber && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      if (playingAyahNumber !== ayahNumber) {
        audioRef.current.src = ayah.audio_url;
        setPlayingAyahNumber(ayahNumber);
        setAudioProgress(0);
      }
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);

      const el = ayahRefs.current[ayahNumber];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [ayahs, playingAyahNumber, isPlaying, playbackRate]
  );

  const playFromWord = useCallback(
    (ayahNumber, wordIndex, totalWords) => {
      const ayah = ayahs.find((a) => a.ayah_number === ayahNumber);
      const el = audioRef.current;
      if (!ayah || !el) return;

      const ratio = totalWords > 0 ? Math.min(0.98, Math.max(0, wordIndex / totalWords)) : 0;

      if (playingAyahNumber === ayahNumber && el.duration && !Number.isNaN(el.duration)) {
        el.currentTime = ratio * el.duration;
        setAudioProgress(ratio);
        el.playbackRate = playbackRate;
        el.play().catch(() => {});
        setIsPlaying(true);
        return;
      }

      pendingSeekRatioRef.current = ratio;
      el.src = ayah.audio_url;
      setPlayingAyahNumber(ayahNumber);
      setAudioProgress(ratio);
      el.playbackRate = playbackRate;
      el.play().catch(() => {});
      setIsPlaying(true);
    },
    [ayahs, playingAyahNumber, playbackRate]
  );

  const handleLoadedMetadata = () => {
    const el = audioRef.current;
    if (!el || pendingSeekRatioRef.current === null) return;
    if (el.duration && !Number.isNaN(el.duration)) {
      el.currentTime = pendingSeekRatioRef.current * el.duration;
      setAudioProgress(pendingSeekRatioRef.current);
    }
    pendingSeekRatioRef.current = null;
  };

  const handleTimeUpdate = () => {
    const el = audioRef.current;
    if (!el || !el.duration || Number.isNaN(el.duration)) return;
    setAudioProgress(Math.min(1, Math.max(0, el.currentTime / el.duration)));
  };

  const handleAudioEnded = () => {
    setAudioProgress(0);
    if (loopAyah && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    if (playingAyahNumber && playingAyahNumber < ayahs.length) {
      playAyah(playingAyahNumber + 1);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Bookmark toggle
  const toggleBookmark = async (surahNumber, ayahNumber) => {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surahNumber, ayahNumber }),
    });
    const data = await res.json();
    setAyahs((prev) =>
      prev.map((a) =>
        a.ayah_number === ayahNumber ? { ...a, is_bookmarked: data.bookmarked } : a
      )
    );
    loadStudyLists();
  };

  // Save / delete note
  const saveNote = async (surahNumber, ayahNumber, content) => {
    setSavingNote(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surahNumber, ayahNumber, content }),
      });
      const data = await res.json();
      setAyahs((prev) =>
        prev.map((a) =>
          a.ayah_number === ayahNumber ? { ...a, note: data.content || null } : a
        )
      );
      setEditingNoteAyah(null);
      loadStudyLists();
    } finally {
      setSavingNote(false);
    }
  };

  // Update reading progress
  const markLastRead = async (surahNumber, ayahNumber) => {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surahNumber, ayahNumber }),
    });
    await loadSurahsAndProgress();
  };

  // Update Hifz status
  const updateHifz = async (surahNumber, status) => {
    await fetch("/api/hifz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surahNumber, status, confidence: status === "memorized" ? 5 : 3 }),
    });
    setCurrentSurah((prev) => (prev ? { ...prev, hifz_status: status } : prev));
    loadSurahsAndProgress();
    loadStudyLists();
  };

  const filteredSurahs = surahs.filter((s) => {
    const q = surahFilter.trim().toLowerCase();
    if (!q) return true;
    return (
      String(s.number) === q ||
      s.name_english.toLowerCase().includes(q) ||
      s.english_meaning.toLowerCase().includes(q) ||
      s.name_arabic.includes(q)
    );
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${t.page}`}>
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* Top Header */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${t.surface}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg border border-current/15 hover:opacity-80"
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-85 transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-arabic text-lg shadow-sm">
                ق
              </div>
              <div>
                <h1 className="font-semibold text-base leading-tight">Al-Bayan</h1>
                <p className={`text-xs ${t.muted}`}>Qur&apos;an Reader &amp; Study</p>
              </div>
            </Link>
          </div>

          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex-1 max-w-md flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-sm transition ${t.surfaceAlt}`}
          >
            <Search className={`w-4 h-4 ${t.muted}`} />
            <span className={`truncate ${t.muted}`}>
              Search Ayahs in Arabic or English...
            </span>
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {progress && (
              <button
                onClick={() => loadSurah(progress.surah_number, progress.ayah_number)}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${t.accentSoft}`}
                title="Jump to last read position"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {progress.name_english} {progress.surah_number}:{progress.ayah_number}
                </span>
              </button>
            )}

            {/* Theme switcher */}
            <div className={`hidden sm:flex items-center p-1 rounded-lg border ${t.surfaceAlt}`}>
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md ${theme === "light" ? "bg-white text-stone-900 shadow-xs" : t.muted}`}
                title="Light theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme("sepia")}
                className={`p-1.5 rounded-md ${theme === "sepia" ? "bg-[#fbf6ec] text-[#3a2e21] shadow-xs" : t.muted}`}
                title="Sepia theme"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md ${theme === "dark" ? "bg-zinc-900 text-zinc-100 shadow-xs" : t.muted}`}
                title="Dark theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setShowSettings((v) => !v)}
              className={`p-2 rounded-lg border ${t.surfaceAlt}`}
              title="Reader settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings Bar */}
        {showSettings && (
          <div className={`border-t px-4 py-3 ${t.surfaceAlt}`}>
            <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-6 text-sm">
              <label className="flex items-center gap-2.5">
                <span className={t.muted}>Arabic Size:</span>
                <input
                  type="range"
                  min={22}
                  max={48}
                  value={arabicSize}
                  onChange={(e) => setArabicSize(Number(e.target.value))}
                  className="accent-emerald-700"
                />
                <span className="font-mono text-xs">{arabicSize}px</span>
              </label>

              <label className="flex items-center gap-2">
                <span className={t.muted}>Translation:</span>
                <select
                  value={translationLang}
                  onChange={(e) => setTranslationLang(e.target.value)}
                  className={`px-2.5 py-1 rounded-lg border text-xs ${t.surface}`}
                >
                  <option value="en_tl">English &amp; Tagalog</option>
                  <option value="tagalog">Tagalog</option>
                  <option value="english">English (Sahih)</option>
                  <option value="en_id">English &amp; Indonesian</option>
                  <option value="indonesian">Indonesian (Kemenag)</option>
                  <option value="off">Hidden</option>
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span className={t.muted}>Reciter:</span>
                <select
                  value={reciter}
                  onChange={(e) => handleReciterChange(e.target.value)}
                  className={`px-2.5 py-1 rounded-lg border text-xs ${t.surface}`}
                >
                  {RECITERS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex gap-6 px-4 py-6 pb-28">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "fixed inset-y-0 left-0 z-40 w-80 p-4 shadow-2xl" : "hidden"
          } lg:block lg:static lg:w-80 lg:shrink-0 lg:p-0 lg:shadow-none ${t.page}`}
        >
          <div className={`rounded-2xl border overflow-hidden flex flex-col h-[calc(100vh-8rem)] sticky top-22 ${t.surface}`}>
            {/* Sidebar Tabs */}
            <div className={`grid grid-cols-4 border-b text-xs font-medium ${t.surfaceAlt}`}>
              {[
                { id: "surahs", label: "Surahs", icon: BookOpen },
                { id: "bookmarks", label: "Saved", icon: Bookmark },
                { id: "notes", label: "Notes", icon: StickyNote },
                { id: "hifz", label: "Hifz", icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = sidebarTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSidebarTab(tab.id)}
                    className={`flex flex-col items-center gap-1 py-2.5 border-b-2 transition ${
                      active
                        ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                        : `border-transparent ${t.muted}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sidebarTab === "surahs" && (
                <>
                  <input
                    type="text"
                    value={surahFilter}
                    onChange={(e) => setSurahFilter(e.target.value)}
                    placeholder="Filter 114 Surahs..."
                    className={`w-full px-3 py-2 rounded-xl border text-sm outline-none ${t.surfaceAlt}`}
                  />
                  <div className="space-y-1 pt-1">
                    {filteredSurahs.map((s) => {
                      const active = currentSurah?.number === s.number;
                      return (
                        <button
                          key={s.number}
                          onClick={() => loadSurah(s.number)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 transition ${
                            active
                              ? t.accentSoft + " border"
                              : "hover:bg-current/5 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center shrink-0">
                              {s.number}
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {s.name_english}
                              </div>
                              <div className={`text-xs truncate ${t.muted}`}>
                                {s.english_meaning} • {s.ayah_count} Ayahs
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-arabic text-base leading-none">
                              {s.name_arabic}
                            </div>
                            {s.hifz_status === "memorized" && (
                              <span className="text-[10px] text-emerald-600 font-medium">
                                Memorized
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {sidebarTab === "bookmarks" && (
                <div className="space-y-2">
                  {bookmarksList.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${t.muted}`}>
                      No bookmarks yet. Click the bookmark icon on any Ayah.
                    </p>
                  ) : (
                    bookmarksList.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => loadSurah(b.surah_number, b.ayah_number)}
                        className={`w-full text-left p-3 rounded-xl border transition hover:border-emerald-500 ${t.surfaceAlt}`}
                      >
                        <div className="flex items-center justify-between text-xs font-medium mb-1">
                          <span className={t.accent}>
                            {b.name_english} ({b.surah_number}:{b.ayah_number})
                          </span>
                          <span className="font-arabic">{b.name_arabic}</span>
                        </div>
                        <p className={`text-xs line-clamp-2 ${t.muted}`}>{b.text_english}</p>
                      </button>
                    ))
                  )}
                </div>
              )}

              {sidebarTab === "notes" && (
                <div className="space-y-2">
                  {notesList.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${t.muted}`}>
                      No reflection notes yet. Add a note to any Ayah while reading.
                    </p>
                  ) : (
                    notesList.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => loadSurah(n.surah_number, n.ayah_number)}
                        className={`w-full text-left p-3 rounded-xl border transition hover:border-emerald-500 ${t.surfaceAlt}`}
                      >
                        <div className="text-xs font-semibold mb-1 text-emerald-700 dark:text-emerald-400">
                          {n.name_english} {n.surah_number}:{n.ayah_number}
                        </div>
                        <p className="text-xs line-clamp-3">{n.content}</p>
                      </button>
                    ))
                  )}
                </div>
              )}

              {sidebarTab === "hifz" && (
                <div className="space-y-2">
                  {hifzList.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${t.muted}`}>
                      Mark Surahs as &ldquo;In Progress&rdquo; or &ldquo;Memorized&rdquo; from the Surah header.
                    </p>
                  ) : (
                    hifzList.map((h) => (
                      <button
                        key={h.surah_number}
                        onClick={() => loadSurah(h.surah_number)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between ${t.surfaceAlt}`}
                      >
                        <div>
                          <div className="text-sm font-medium">{h.name_english}</div>
                          <div className={`text-xs ${t.muted}`}>{h.ayah_count} Ayahs</div>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            h.status === "memorized"
                              ? "bg-emerald-600/15 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {h.status === "memorized" ? "Memorized" : "In Progress"}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Reader */}
        <main className="flex-1 min-w-0 space-y-5">
          {loadingSurah || !currentSurah ? (
            <div className={`rounded-2xl border p-12 text-center ${t.surface}`}>
              <p className={t.muted}>Loading Surah...</p>
            </div>
          ) : (
            <>
              {/* Surah Header Card */}
              <div className={`rounded-2xl border p-6 ${t.surface}`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <span>Surah {currentSurah.number}</span>
                      <span>•</span>
                      <span>{currentSurah.revelation_place}</span>
                      <span>•</span>
                      <span>{currentSurah.ayah_count} Ayahs</span>
                    </div>
                    <h2 className="text-2xl font-bold mt-1">
                      {currentSurah.name_english}{" "}
                      <span className={`font-normal text-lg ${t.muted}`}>
                        ({currentSurah.english_meaning})
                      </span>
                    </h2>
                  </div>

                  <div className="font-arabic text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                    {currentSurah.name_arabic}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-current/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playAyah(1)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${t.accentBg}`}
                    >
                      <Play className="w-4 h-4" />
                      Play Surah
                    </button>

                    {currentSurah.number > 1 && (
                      <button
                        onClick={() => loadSurah(currentSurah.number - 1)}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium ${t.surfaceAlt}`}
                      >
                        Prev Surah
                      </button>
                    )}
                    {currentSurah.number < 114 && (
                      <button
                        onClick={() => loadSurah(currentSurah.number + 1)}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium ${t.surfaceAlt}`}
                      >
                        Next Surah
                      </button>
                    )}
                  </div>

                  {/* Hifz Status Selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className={t.muted}>Hifz:</span>
                    <select
                      value={currentSurah.hifz_status || "not_started"}
                      onChange={(e) => updateHifz(currentSurah.number, e.target.value)}
                      className={`px-2.5 py-1.5 rounded-lg border font-medium ${t.surfaceAlt}`}
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="memorized">Memorized</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bismillah Banner (Surahs 2..114 except 9) */}
              {currentSurah.number !== 1 && currentSurah.number !== 9 && (
                <div className={`rounded-2xl border py-5 px-4 text-center ${t.surface}`}>
                  <p className="font-arabic text-2xl sm:text-3xl">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              )}

              {/* Ayahs List */}
              <div className="space-y-4">
                {ayahs.map((ayah) => {
                  const isActive = playingAyahNumber === ayah.ayah_number;
                  const isLastRead =
                    progress?.surah_number === currentSurah.number &&
                    progress?.ayah_number === ayah.ayah_number;

                  return (
                    <article
                      key={ayah.id}
                      ref={(el) => {
                        ayahRefs.current[ayah.ayah_number] = el;
                      }}
                      className={`rounded-2xl border p-5 sm:p-6 transition ${t.surface} ${
                        isActive ? t.activeAyah : ""
                      }`}
                    >
                      {/* Ayah Top Bar */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${t.accentSoft}`}>
                            {currentSurah.number}:{ayah.ayah_number}
                          </span>
                          <span className={`text-xs ${t.muted}`}>
                            Juz {ayah.juz} • Page {ayah.page}
                          </span>
                          {isLastRead && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Last Read
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => playAyah(ayah.ayah_number)}
                            className={`p-2 rounded-lg hover:bg-current/5 ${
                              isActive && isPlaying ? t.accent : t.muted
                            }`}
                            title="Play Ayah"
                          >
                            {isActive && isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => toggleBookmark(currentSurah.number, ayah.ayah_number)}
                            className={`p-2 rounded-lg hover:bg-current/5 ${
                              ayah.is_bookmarked ? "text-amber-500" : t.muted
                            }`}
                            title="Bookmark Ayah"
                          >
                            <Bookmark
                              className="w-4 h-4"
                              fill={ayah.is_bookmarked ? "currentColor" : "none"}
                            />
                          </button>

                          <button
                            onClick={() => {
                              setEditingNoteAyah(
                                editingNoteAyah === ayah.ayah_number ? null : ayah.ayah_number
                              );
                              setNoteDraft(ayah.note || "");
                            }}
                            className={`p-2 rounded-lg hover:bg-current/5 ${
                              ayah.note ? t.accent : t.muted
                            }`}
                            title="Add / Edit Reflection Note"
                          >
                            <StickyNote className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => markLastRead(currentSurah.number, ayah.ayah_number)}
                            className={`p-2 rounded-lg hover:bg-current/5 ${
                              isLastRead ? t.accent : t.muted
                            }`}
                            title="Mark as Last Read"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Arabic Text (click any word to play from there) */}
                      {(() => {
                        const showGuide = isActive && readGuide;
                        const words = ayah.text_arabic.trim().split(/\s+/);
                        const activeWordIdx =
                          showGuide && isPlaying && words.length > 0
                            ? Math.min(words.length - 1, Math.floor(audioProgress * words.length))
                            : -1;

                        return (
                          <p
                            dir="rtl"
                            style={{ fontSize: `${arabicSize}px` }}
                            className="font-arabic text-right leading-[2.3] mb-4 select-text"
                          >
                            {words.map((word, idx) => (
                              <span
                                key={idx}
                                onClick={() => playFromWord(ayah.ayah_number, idx, words.length)}
                                title="Click to play from this word"
                                className={`inline-block cursor-pointer transition-colors duration-150 mx-[2px] rounded-md px-0.5 hover:bg-emerald-500/15 ${
                                  idx === activeWordIdx
                                    ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-1"
                                    : showGuide && idx < activeWordIdx
                                      ? "opacity-65"
                                      : ""
                                }`}
                              >
                                {word}
                              </span>
                            ))}
                          </p>
                        );
                      })()}

                      {/* Translations */}
                      {(translationLang === "tagalog" || translationLang === "en_tl") &&
                        ayah.text_tagalog && (
                          <p className={`text-base leading-relaxed mb-2 ${t.muted}`}>
                            {ayah.text_tagalog}
                          </p>
                        )}
                      {(translationLang === "indonesian" || translationLang === "en_id") &&
                        ayah.text_indonesian && (
                          <p className={`text-base leading-relaxed mb-2 ${t.muted}`}>
                            {ayah.text_indonesian}
                          </p>
                        )}
                      {(translationLang === "english" ||
                        translationLang === "en_tl" ||
                        translationLang === "en_id") && (
                        <p className={`text-sm leading-relaxed opacity-85 ${t.muted}`}>
                          {ayah.text_english}
                        </p>
                      )}

                      {/* Existing Note Display */}
                      {ayah.note && editingNoteAyah !== ayah.ayah_number && (
                        <div className={`mt-4 p-3 rounded-xl border text-sm ${t.surfaceAlt}`}>
                          <div className="text-xs font-semibold mb-1 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                            <StickyNote className="w-3.5 h-3.5" /> Personal Note
                          </div>
                          <p>{ayah.note}</p>
                        </div>
                      )}

                      {/* Inline Note Editor */}
                      {editingNoteAyah === ayah.ayah_number && (
                        <div className={`mt-4 p-3 rounded-xl border space-y-2 ${t.surfaceAlt}`}>
                          <textarea
                            rows={3}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Write your reflection or study note for this Ayah..."
                            className={`w-full p-2.5 rounded-lg border text-sm outline-none ${t.surface}`}
                          />
                          <div className="flex items-center justify-end gap-2">
                            {ayah.note && (
                              <button
                                onClick={() => saveNote(currentSurah.number, ayah.ayah_number, "")}
                                disabled={savingNote}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-600 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            )}
                            <button
                              onClick={() => setEditingNoteAyah(null)}
                              className="px-3 py-1.5 rounded-lg text-xs border border-current/15"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                saveNote(currentSurah.number, ayah.ayah_number, noteDraft)
                              }
                              disabled={savingNote}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium ${t.accentBg}`}
                            >
                              {savingNote ? "Saving..." : "Save Note"}
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Sticky Audio Player */}
      {currentSurah && ayahs.length > 0 && (
        <div className={`fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-md ${t.surface}`}>
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Volume2 className={`w-5 h-5 shrink-0 ${t.accent}`} />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {currentSurah.name_english}{" "}
                  {playingAyahNumber ? `• Ayah ${playingAyahNumber}` : ""}
                </div>
                <div className={`text-xs truncate ${t.muted}`}>
                  {RECITERS.find((r) => r.id === reciter)?.name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  playAyah(Math.max(1, (playingAyahNumber || 1) - 1))
                }
                className="p-2 rounded-lg hover:bg-current/5"
                title="Previous Ayah"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => playAyah(playingAyahNumber || 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${t.accentBg}`}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() =>
                  playAyah(Math.min(ayahs.length, (playingAyahNumber || 1) + 1))
                }
                className="p-2 rounded-lg hover:bg-current/5"
                title="Next Ayah"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setReadGuide((v) => !v)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                  readGuide ? t.accentSoft : t.surfaceAlt
                }`}
                title="Highlight words progressively while playing"
              >
                <Eye className="w-3.5 h-3.5" />
                Read Guide
              </button>

              <button
                onClick={() => setLoopAyah((v) => !v)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                  loopAyah ? t.accentSoft : t.surfaceAlt
                }`}
                title="Repeat current Ayah (Hifz mode)"
              >
                <Repeat className="w-3.5 h-3.5" />
                Loop
              </button>

              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(Number(e.target.value))}
                className={`px-2 py-1.5 rounded-lg border text-xs font-mono ${t.surfaceAlt}`}
                title="Playback speed"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center p-4 pt-16"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${t.surface}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-current/10 flex items-center gap-3">
              <Search className={`w-5 h-5 ${t.muted}`} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Arabic, Tagalog, Indonesian, or English..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className={`p-1 rounded-lg ${t.muted}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
              {searching && (
                <p className={`text-sm text-center py-6 ${t.muted}`}>Searching...</p>
              )}
              {!searching && searchQuery.trim().length < 2 && (
                <p className={`text-sm text-center py-6 ${t.muted}`}>
                  Type at least 2 characters to search across all 6,236 Ayahs.
                </p>
              )}
              {!searching &&
                searchQuery.trim().length >= 2 &&
                searchResults.length === 0 && (
                  <p className={`text-sm text-center py-6 ${t.muted}`}>
                    No matching Ayahs found.
                  </p>
                )}
              {searchResults.map((r) => (
                <button
                  key={`${r.surah_number}:${r.ayah_number}`}
                  onClick={() => {
                    setSearchOpen(false);
                    loadSurah(r.surah_number, r.ayah_number);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition hover:border-emerald-500 ${t.surfaceAlt}`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className={t.accent}>
                      {r.name_english} ({r.surah_number}:{r.ayah_number})
                    </span>
                    <span className="inline-flex items-center gap-1 opacity-70">
                      Jump <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                  <p dir="rtl" className="font-arabic text-xl text-right mb-1.5">
                    {r.text_arabic}
                  </p>
                  <p className={`text-xs ${t.muted}`}>{r.text_english}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
