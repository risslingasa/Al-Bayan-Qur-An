import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    let surahs = db
      .prepare(`
        SELECT s.*, h.status AS hifz_status, h.confidence AS hifz_confidence
        FROM surahs s
        LEFT JOIN hifz_goals h ON h.surah_number = s.number
        ORDER BY s.number ASC
      `)
      .all();

    if (q) {
      surahs = surahs.filter(
        (s) =>
          String(s.number) === q ||
          s.name_english.toLowerCase().includes(q) ||
          s.english_meaning.toLowerCase().includes(q) ||
          s.name_arabic.includes(q)
      );
    }

    const progress = db
      .prepare(`
        SELECT rp.surah_number, rp.ayah_number, rp.updated_at, s.name_english, s.name_arabic
        FROM reading_progress rp
        JOIN surahs s ON s.number = rp.surah_number
        WHERE rp.id = 1
      `)
      .get();

    return NextResponse.json({ surahs, progress });
  } catch (err) {
    console.error("GET /api/surahs error:", err);
    return NextResponse.json({ error: "Failed to load surahs" }, { status: 500 });
  }
}
