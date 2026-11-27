import { NextResponse } from "next/server";
import { getDb, getQuranData } from "@/lib/db";

export async function GET(request) {
  try {
    const { surahs: allSurahs, surahMap } = getQuranData();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    const db = getDb();
    const hifzRows = db.prepare("SELECT surah_number, status, confidence FROM hifz_goals").all();
    const hifzMap = new Map(hifzRows.map((h) => [h.surah_number, h]));

    let surahs = allSurahs.map((s) => {
      const h = hifzMap.get(s.number);
      return {
        ...s,
        hifz_status: h?.status || null,
        hifz_confidence: h?.confidence || null,
      };
    });

    if (q) {
      surahs = surahs.filter(
        (s) =>
          String(s.number) === q ||
          s.name_english.toLowerCase().includes(q) ||
          s.english_meaning.toLowerCase().includes(q) ||
          s.name_arabic.includes(q)
      );
    }

    const rp = db
      .prepare("SELECT surah_number, ayah_number, updated_at FROM reading_progress WHERE id = 1")
      .get();
    const rpSurah = rp ? surahMap.get(rp.surah_number) : null;
    const progress =
      rp && rpSurah
        ? {
            ...rp,
            name_english: rpSurah.name_english,
            name_arabic: rpSurah.name_arabic,
          }
        : null;

    return NextResponse.json({ surahs, progress });
  } catch (err) {
    console.error("GET /api/surahs error:", err);
    return NextResponse.json({ error: "Failed to load surahs" }, { status: 500 });
  }
}
