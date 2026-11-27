"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  Search,
  Volume2,
  Bookmark,
  Award,
  ArrowRight,
  CheckCircle2,
  Mail,
  Star,
  Users,
  Clock,
  Globe,
  ChevronRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TOPIC_PILLS = [
  "Tajweed",
  "Quran Reading",
  "Tafseer",
  "Quran Recitation",
  "Noorani Qaida",
  "Arabic Basics",
  "Hifz (Memorization)",
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Uthmani Script & Beautiful Themes",
    description:
      "Crisp Amiri Arabic typography with adjustable font sizes. Light, Sepia, and Dark reading modes for comfortable study sessions.",
  },
  {
    icon: Volume2,
    title: "Audio Recitation & Hifz Loop",
    description:
      "Listen verse-by-verse from 8 world-renowned Qaris. Adjust speed, loop any Ayah, and click words to play from that position.",
  },
  {
    icon: Search,
    title: "Arabic-Aware Smart Search",
    description:
      "Search all 6,236 Ayahs in Arabic (diacritics normalized automatically), Tagalog, Indonesian, and English simultaneously.",
  },
  {
    icon: Bookmark,
    title: "Notes, Bookmarks & Progress",
    description:
      "Save favorite verses, write personal reflection notes, track your last-read position, and monitor Hifz memorization progress.",
  },
];

const STATS = [
  { value: "114", label: "Surahs", suffix: "" },
  { value: "6,236", label: "Ayahs", suffix: "" },
  { value: "8", label: "Reciters", suffix: "+" },
  { value: "4", label: "Languages", suffix: "" },
];

const STEPS = [
  {
    step: "01",
    title: "Open the Reader",
    description: "Launch Al-Bayan and browse all 114 Surahs in the sidebar. Pick any Surah to begin reading.",
  },
  {
    step: "02",
    title: "Pick Your Language & Qari",
    description:
      "Choose from English, Tagalog, or Indonesian translations. Select your preferred reciter from 8 renowned Qaris.",
  },
  {
    step: "03",
    title: "Read, Listen & Memorize",
    description:
      "Follow the word-by-word Read Guide, loop Ayahs for Hifz practice, bookmark verses, and add personal notes.",
  },
];

const FEATURED_SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "ٱلْفَاتِحَة", meaning: "The Opening", ayahs: 7 },
  { number: 18, name: "Al-Kahf", arabic: "ٱلْكَهْف", meaning: "The Cave", ayahs: 110 },
  { number: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya Sin", ayahs: 83 },
  { number: 55, name: "Ar-Rahman", arabic: "ٱلرَّحْمَٰن", meaning: "The Beneficent", ayahs: 78 },
  { number: 67, name: "Al-Mulk", arabic: "ٱلْمُلْك", meaning: "The Sovereignty", ayahs: 30 },
  { number: 112, name: "Al-Ikhlas", arabic: "ٱلْإِخْلَاص", meaning: "The Sincerity", ayahs: 4 },
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const quoteRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const surahsRef = useRef(null);
  const ctaRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Helper: animate elements into view on scroll
      const revealOnScroll = (selector, triggerEl, vars = {}) => {
        const defaults = {
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          ...vars,
        };
        const { y, x, scale, duration, ease, stagger, delay } = defaults;

        // Set initial hidden state
        gsap.set(selector, {
          opacity: 0,
          y: y || 0,
          x: x || 0,
          scale: scale || 1,
          visibility: "visible",
        });

        // Animate to final state
        gsap.to(selector, {
          scrollTrigger: {
            trigger: triggerEl,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration,
          ease,
          stagger,
          delay: delay || 0,
        });
      };

      // --- Hero Section (immediate timeline, no scroll trigger) ---
      gsap.set(
        [
          ".hero-nav",
          ".hero-badge",
          ".hero-title span",
          ".hero-bismillah",
          ".hero-desc",
          ".hero-cta",
          ".hero-pill",
        ],
        { opacity: 0, y: 30, visibility: "visible" }
      );

      const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
      heroTl
        .to(".hero-nav", { y: 0, opacity: 1, duration: 0.6 })
        .to(".hero-badge", { y: 0, opacity: 1, scale: 1 }, 0.15)
        .to(".hero-title span", { y: 0, opacity: 1, stagger: 0.1 }, 0.25)
        .to(".hero-bismillah", { y: 0, opacity: 1 }, 0.55)
        .to(".hero-desc", { y: 0, opacity: 1 }, 0.65)
        .to(".hero-cta", { y: 0, opacity: 1, stagger: 0.1 }, 0.8)
        .to(".hero-pill", { y: 0, opacity: 1, stagger: 0.05 }, 0.85);

      // --- Stats Section ---
      revealOnScroll(".stat-card", statsRef.current, {
        y: 40,
        scale: 0.9,
        stagger: 0.1,
        ease: "back.out(1.5)",
      });

      // --- Quote Section ---
      revealOnScroll(".quote-line", quoteRef.current, {
        y: 35,
        stagger: 0.12,
        duration: 0.9,
      });
      revealOnScroll(".quote-source", quoteRef.current, {
        y: 20,
        delay: 0.4,
        duration: 0.6,
      });

      // --- Features Section ---
      revealOnScroll(".feature-heading", featuresRef.current, { y: 35 });
      revealOnScroll(".feature-card", featuresRef.current, {
        y: 50,
        stagger: 0.1,
        delay: 0.15,
      });

      // --- Steps Section ---
      revealOnScroll(".steps-heading", stepsRef.current, { y: 35 });
      revealOnScroll(".step-card", stepsRef.current, {
        x: -50,
        y: 0,
        stagger: 0.12,
        delay: 0.15,
      });

      // --- Surahs Section ---
      revealOnScroll(".surahs-heading", surahsRef.current, { y: 35 });
      revealOnScroll(".surah-card", surahsRef.current, {
        y: 40,
        scale: 0.95,
        stagger: 0.07,
        ease: "back.out(1.3)",
        delay: 0.15,
      });

      // --- CTA Section ---
      revealOnScroll(".cta-content", ctaRef.current, {
        y: 40,
        scale: 0.97,
        duration: 0.9,
      });

      // --- Contact Section ---
      revealOnScroll(".contact-heading", contactRef.current, { y: 35 });
      revealOnScroll(".contact-card", contactRef.current, {
        y: 35,
        stagger: 0.1,
        delay: 0.15,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917] overflow-x-hidden">
      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="relative bg-[#FAF7F2] text-[#1C1917] overflow-hidden border-b border-[#E8E1D5]">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230F5132' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Top Navbar */}
        <header className="hero-nav relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-arabic text-xl shadow-md shadow-[#0F5132]/20 group-hover:scale-105 transition-transform">
                ق
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block leading-none text-[#1C1917]">
                  Al-Bayan
                </span>
                <span className="text-[11px] text-[#57534E] tracking-wider uppercase">
                  Qur&apos;an Study
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm text-[#57534E]">
              {["Home", "Features", "How It Works", "Surahs", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-[#0F5132] transition-colors relative group"
                >
                  {item === "Home" ? (
                    <span className="text-[#0F5132] font-semibold">HOME</span>
                  ) : (
                    item
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0F5132] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            <Link
              href="/read"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F5132] text-white text-sm font-semibold hover:bg-[#0c4128] transition-all shadow-md shadow-[#0F5132]/20 hover:scale-[1.03]"
            >
              Start Reading
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 sm:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div>
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8E1D5] text-xs font-medium text-[#57534E] mb-8 shadow-2xs">
                <Star className="w-3.5 h-3.5 text-[#C59B27]" />
                Free Qur&apos;an Reader &amp; Study Workspace
              </div>

              <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
                <span className="block text-[#1C1917]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  QUR&apos;AN
                </span>
                <span
                  className="block text-[#C59B27]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}
                >
                  Learning
                </span>
              </h1>

              <p
                dir="rtl"
                className="hero-bismillah font-arabic text-2xl sm:text-3xl text-[#C59B27] mb-6"
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>

              <p className="hero-desc text-base sm:text-lg text-[#57534E] max-w-lg leading-relaxed mb-8">
                Master Qur&apos;an reading and recitation with our free study workspace.
                Whether for kids or adults, Al-Bayan makes studying the Qur&apos;an simple,
                flexible, and effective.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-10">
                <Link
                  href="/read"
                  className="hero-cta inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0F5132] text-white font-semibold text-sm hover:bg-[#0c4128] transition-all shadow-lg shadow-[#0F5132]/25 hover:scale-[1.03]"
                >
                  <BookOpen className="w-4 h-4" />
                  Start Reading Now
                </Link>
                <Link
                  href="/read?surah=18"
                  className="hero-cta inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-[#E8E1D5] text-[#1C1917] font-semibold text-sm hover:border-[#0F5132] hover:text-[#0F5132] transition-all"
                >
                  Read Surah Al-Kahf
                </Link>
              </div>
            </div>

            {/* Right Column - Topic Pills Card */}
            <div className="relative">
              <div className="relative bg-white border border-[#E8E1D5] rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#E8E1D5]/50">
                {/* Rotating badge */}
                <div className="absolute -top-6 -right-3 sm:-right-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0F5132] border-4 border-[#FAF7F2] flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="font-arabic text-[#C59B27] text-xl sm:text-2xl leading-none">
                      ق
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-white/80 uppercase tracking-widest mt-0.5">
                      Al-Bayan
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {TOPIC_PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="hero-pill inline-flex items-center px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E8E1D5] text-[#1C1917] text-sm font-medium hover:bg-white hover:border-[#0F5132] hover:text-[#0F5132] transition-all cursor-default shadow-2xs"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5]">
                  <p className="text-[#57534E] text-sm leading-relaxed">
                    Read all <strong className="text-[#1C1917]">114 Surahs</strong> and{" "}
                    <strong className="text-[#1C1917]">6,236 Ayahs</strong> with Uthmani
                    script, synchronized audio from{" "}
                    <strong className="text-[#1C1917]">8 renowned Qaris</strong>, and
                    translations in English, Tagalog &amp; Indonesian.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section ref={statsRef} className="relative z-10 -mt-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="stat-card flex flex-col items-center py-6 px-4 rounded-2xl bg-white border border-[#E8E1D5] shadow-lg shadow-[#E8E1D5]/40"
            >
              <span className="text-3xl sm:text-4xl font-bold text-[#0F5132]">
                {stat.value}
                <span className="text-[#C59B27]">{stat.suffix}</span>
              </span>
              <span className="text-sm text-[#57534E] mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========== HADITH QUOTE ========== */}
      <section
        ref={quoteRef}
        id="home"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center"
      >
        <div className="relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl text-[#C59B27]/30 font-serif select-none">
            &ldquo;
          </div>
          <blockquote
            className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-snug text-[#1C1917] italic"
          >
            <span className="quote-line block">
              &ldquo;Recite the Quran, for on the Day of
            </span>
            <span className="quote-line block">
              Resurrection it will come as an
            </span>
            <span className="quote-line block">
              intercessor for its reciters.&rdquo;
            </span>
          </blockquote>
          <p className="quote-source mt-6 text-base text-[#57534E] font-medium tracking-wide">
            (Sahih Muslim)
          </p>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section
        ref={featuresRef}
        id="features"
        className="bg-[#FAF7F2] border-y border-[#E8E1D5]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="feature-heading text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#0F5132] bg-white border border-[#E8E1D5] px-3 py-1 rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
              Dedicated to Teaching
              <br />
              the{" "}
              <span className="text-[#0F5132]">
                Words of Allah
              </span>
            </h2>
            <p className="mt-4 text-[#57534E] text-lg">
              Everything you need to read, listen, search, and memorize in one clean workspace.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="feature-card group rounded-2xl border border-[#E8E1D5] bg-white p-6 hover:border-[#0F5132]/40 hover:shadow-xl hover:shadow-[#E8E1D5]/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-[#0F5132] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base mb-2.5 text-[#1C1917] group-hover:text-[#0F5132] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS (3 Steps) ========== */}
      <section ref={stepsRef} id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="steps-heading text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#0F5132] bg-white border border-[#E8E1D5] px-3 py-1 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
            Start Your Qur&apos;an Journey in
            <br />
            <span className="text-[#C59B27]">
              3 Easy Steps
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="step-card relative rounded-2xl border border-[#E8E1D5] bg-white p-7 hover:shadow-xl hover:shadow-[#E8E1D5]/50 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-bold text-[#C59B27]/40 group-hover:text-[#C59B27] transition-colors select-none">
                  {step.step}
                </span>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#C59B27]/50 z-10" />
                )}
              </div>
              <h3 className="font-bold text-lg mb-2 text-[#1C1917] group-hover:text-[#0F5132] transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURED SURAHS ========== */}
      <section
        ref={surahsRef}
        id="surahs"
        className="bg-[#FAF7F2] border-y border-[#E8E1D5]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="surahs-heading flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#0F5132] bg-white border border-[#E8E1D5] px-3 py-1 rounded-full mb-4">
                Featured Surahs
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
                Jump Directly to a Surah
              </h2>
              <p className="mt-2 text-[#57534E]">
                Start with frequently recited Surahs or browse all 114 inside the reader.
              </p>
            </div>
            <Link
              href="/read"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F5132] hover:text-[#0c4128] group"
            >
              View all 114 Surahs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_SURAHS.map((surah) => (
              <Link
                key={surah.number}
                href={`/read?surah=${surah.number}`}
                className="surah-card group rounded-2xl border border-[#E8E1D5] bg-white p-5 flex items-center justify-between gap-4 hover:border-[#0F5132] hover:shadow-lg hover:shadow-[#E8E1D5]/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-11 h-11 rounded-xl bg-[#0F5132] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {surah.number}
                  </span>
                  <div>
                    <div className="font-bold text-[#1C1917] group-hover:text-[#0F5132] transition-colors">
                      {surah.name}
                    </div>
                    <div className="text-xs text-[#57534E]">
                      {surah.meaning} &bull; {surah.ayahs} Ayahs
                    </div>
                  </div>
                </div>
                <div className="font-arabic text-2xl text-[#C59B27] group-hover:text-[#0F5132] transition-colors">
                  {surah.arabic}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section ref={ctaRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="cta-content relative overflow-hidden rounded-3xl bg-[#0F5132] text-white px-8 sm:px-14 py-14 sm:py-16 text-center shadow-2xl shadow-[#0F5132]/25">
          <div className="absolute inset-0 opacity-[0.05]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zm0-9.9l11.9-11.9 1.41 1.41L1.41 30H0v-1.31zM0 20v-1.41l20-20 1.41 1.41L1.41 20H0zm18.59 20l20-20v1.41L20 40h-1.41zM40 1.41l-1.41-1.41-20 20v1.41L40 0v1.41z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          <div className="relative z-10">
            <p dir="rtl" className="font-arabic text-2xl text-[#C59B27] mb-4">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Begin Your Qur&apos;an Journey Today
            </h2>
            <p className="text-white/75 max-w-xl mx-auto mb-8 text-lg">
              Free, open-source, and built with love. Read, listen, and study the Noble Qur&apos;an
              with a clean, distraction-free workspace.
            </p>
            <Link
              href="/read"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C59B27] text-[#1C1917] font-semibold text-base hover:bg-[#d4aa32] transition-all shadow-lg hover:scale-[1.03]"
            >
              <BookOpen className="w-5 h-5" />
              Open Al-Bayan Reader
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CONTACT US ========== */}
      <section
        ref={contactRef}
        id="contact"
        className="border-t border-[#E8E1D5] bg-[#FAF7F2]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="contact-heading">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#0F5132] bg-white border border-[#E8E1D5] px-3 py-1 rounded-full mb-4">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917]">
              Contact Us
            </h2>
            <p className="mt-2.5 text-[#57534E] max-w-xl mx-auto">
              Have feedback, suggestions, or questions about Al-Bayan? Reach out directly.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 text-left">
            <a
              href="mailto:risslingasa@gmail.com"
              className="contact-card group rounded-2xl border border-[#E8E1D5] bg-white p-6 flex items-center gap-4 hover:border-[#0F5132] hover:shadow-xl hover:shadow-[#E8E1D5]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-[#0F5132] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-[#57534E]">Email</div>
                <div className="font-bold text-[#1C1917] group-hover:text-[#0F5132] truncate transition-colors">
                  risslingasa@gmail.com
                </div>
              </div>
            </a>

            <a
              href="https://www.facebook.com/norelriss.lingasa"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group rounded-2xl border border-[#E8E1D5] bg-white p-6 flex items-center gap-4 hover:border-[#0F5132] hover:shadow-xl hover:shadow-[#E8E1D5]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-[#0F5132] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-[#57534E]">Facebook</div>
                <div className="font-bold text-[#1C1917] group-hover:text-[#0F5132] truncate transition-colors">
                  facebook.com/norelriss.lingasa
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-[#E8E1D5] bg-[#0F5132] text-white/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm">
            <Award className="w-4 h-4 text-[#C59B27]" />
            <span>Al-Bayan — Full-Stack Qur&apos;an Reader &amp; Study Workspace</span>
          </div>
          <Link
            href="/read"
            className="text-sm font-medium text-[#C59B27] hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            Launch Reader <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
