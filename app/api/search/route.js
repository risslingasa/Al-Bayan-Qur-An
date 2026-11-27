import { NextResponse } from "next/server";
import { getQuranData, stripArabicDiacritics } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const { ayahs, surahMap } = getQuranData();
    const lowerQ = q.toLowerCase();
    const cleanArabicQuery = stripArabicDiacritics(q);

    const results = [];
    for (const a of ayahs) {
      const matchArabic = cleanArabicQuery && a.text_clean.includes(cleanArabicQuery);
      const matchEnglish = a.text_english.toLowerCase().includes(lowerQ);
      const matchIndonesian = a.text_indonesian.toLowerCase().includes(lowerQ);
      const matchTagalog = a.text_tagalog.toLowerCase().includes(lowerQ);

      if (matchArabic || matchEnglish || matchIndonesian || matchTagalog) {
        const s = surahMap.get(a.surah_number);
        results.push({
          surah_number: a.surah_number,
          ayah_number: a.ayah_number,
          text_arabic: a.text_arabic,
          text_english: a.text_english,
          text_indonesian: a.text_indonesian,
          text_tagalog: a.text_tagalog,
          juz: a.juz,
          page: a.page,
          name_arabic: s?.name_arabic || "",
          name_english: s?.name_english || "",
        });
        if (results.length >= 50) break;
      }
    }

    return NextResponse.json({ results, query: q });
  } catch (err) {
    console.error("GET /api/search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
