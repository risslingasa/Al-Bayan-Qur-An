import Link from "next/link";
import {
  BookOpen,
  Search,
  Volume2,
  Bookmark,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Mail,
} from "lucide-react";

const FEATURED_SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "ٱلْفَاتِحَة", meaning: "The Opening", ayahs: 7 },
  { number: 18, name: "Al-Kahf", arabic: "ٱلْكَهْف", meaning: "The Cave", ayahs: 110 },
  { number: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya Sin", ayahs: 83 },
  { number: 55, name: "Ar-Rahman", arabic: "ٱلرَّحْمَٰن", meaning: "The Beneficent", ayahs: 78 },
  { number: 67, name: "Al-Mulk", arabic: "ٱلْمُلْك", meaning: "The Sovereignty", ayahs: 30 },
  { number: 112, name: "Al-Ikhlas", arabic: "ٱلْإِخْلَاص", meaning: "The Sincerity", ayahs: 4 },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Uthmani Script & Themes",
    description:
      "Crisp Amiri Arabic typography with adjustable font sizes, Light, Sepia, and Dark modes for comfortable reading.",
  },
  {
    icon: Volume2,
    title: "Recitation & Hifz Loop",
    description:
      "Listen verse-by-verse with renowned Qaris, adjust playback speed, and loop any Ayah to aid memorization.",
  },
  {
    icon: Search,
    title: "Arabic-Aware Search",
    description:
      "Search across all 6,236 Ayahs in English or plain Arabic—diacritics are normalized automatically.",
  },
  {
    icon: Bookmark,
    title: "Notes, Bookmarks & Hifz",
    description:
      "Save favorite verses, write personal reflection notes, mark your last-read position, and track Hifz progress.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-arabic text-lg shadow-sm">
              ق
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight block leading-none">
                Al-Bayan
              </span>
              <span className="text-xs text-stone-500">Qur&apos;an Study Workspace</span>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-stone-600">
            <a href="#features" className="hover:text-emerald-700 transition">
              Features
            </a>
            <a href="#surahs" className="hover:text-emerald-700 transition">
              Featured Surahs
            </a>
            <a href="#contact" className="hover:text-emerald-700 transition">
              Contact Us
            </a>
          </nav>

          <Link
            href="/read"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition shadow-xs"
          >
            Open Reader
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-stone-200/70 bg-gradient-to-b from-emerald-950/[0.03] via-stone-50 to-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>114 Surahs • 6,236 Ayahs • Full-Stack Study Workspace</span>
          </div>

          <p
            dir="rtl"
            className="font-arabic text-3xl sm:text-4xl text-emerald-800 mb-5"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 max-w-3xl mx-auto leading-[1.12]">
            Read, Reflect, and Memorize the Noble Qur&apos;an
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            A distraction-free Qur&apos;an reader with Uthmani Arabic script, Sahih
            International translation, synchronized audio recitation, instant
            Arabic &amp; English search, and personal study notes.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/read"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 text-white font-medium text-base hover:bg-emerald-800 transition shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              Start Reading
            </Link>
            <Link
              href="/read?surah=18"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-medium text-base hover:border-emerald-600 hover:text-emerald-800 transition"
            >
              Read Surah Al-Kahf
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Offline-ready local SQLite database
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              4 Qari recitations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Light, Sepia &amp; Dark themes
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Built for Focused Daily Study
          </h2>
          <p className="mt-2.5 text-stone-600">
            Everything you need to read, listen, search, and track your memorization in one place.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-stone-200 bg-white p-6 hover:border-emerald-300 transition shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Surahs Quick-Jump */}
      <section id="surahs" className="border-t border-stone-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Jump Directly to a Surah
              </h2>
              <p className="mt-2 text-stone-600">
                Start with frequently recited Surahs or browse all 114 inside the reader.
              </p>
            </div>
            <Link
              href="/read"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all 114 Surahs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_SURAHS.map((surah) => (
              <Link
                key={surah.number}
                href={`/read?surah=${surah.number}`}
                className="group rounded-2xl border border-stone-200 bg-stone-50/70 p-5 flex items-center justify-between gap-4 hover:bg-emerald-50/40 hover:border-emerald-400 transition"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-emerald-700/10 text-emerald-800 font-semibold text-sm flex items-center justify-center">
                    {surah.number}
                  </span>
                  <div>
                    <div className="font-semibold text-stone-900 group-hover:text-emerald-800 transition">
                      {surah.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      {surah.meaning} • {surah.ayahs} Ayahs
                    </div>
                  </div>
                </div>
                <div className="font-arabic text-2xl text-emerald-800">
                  {surah.arabic}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="border-t border-stone-200/80 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Contact Us
          </h2>
          <p className="mt-2.5 text-stone-600 max-w-xl mx-auto">
            Have feedback, suggestions, or questions about Al-Bayan? Reach out directly via email or Facebook.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 text-left">
            <a
              href="mailto:risslingasa@gmail.com"
              className="group rounded-2xl border border-stone-200 bg-white p-5 flex items-center gap-4 hover:border-emerald-400 hover:bg-emerald-50/30 transition shadow-2xs"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-stone-500">Email</div>
                <div className="font-semibold text-stone-900 group-hover:text-emerald-800 truncate">
                  risslingasa@gmail.com
                </div>
              </div>
            </a>

            <a
              href="https://www.facebook.com/norelriss.lingasa"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-stone-200 bg-white p-5 flex items-center gap-4 hover:border-emerald-400 hover:bg-emerald-50/30 transition shadow-2xs"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-stone-500">Facebook Page</div>
                <div className="font-semibold text-stone-900 group-hover:text-emerald-800 truncate">
                  facebook.com/norelriss.lingasa
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA & Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-stone-100/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm text-stone-600">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Al-Bayan — Full-Stack Qur&apos;an Reader &amp; Hifz Workspace</span>
          </div>
          <Link
            href="/read"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
          >
            Launch Reader <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
