import { NextResponse } from "next/server";
import { getDb, stripArabicDiacritics } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const db = getDb();
    const cleanArabicQuery = stripArabicDiacritics(q);
    const likePattern = `%${q}%`;
    const arabicPattern = `%${cleanArabicQuery || q}%`;

    const results = db
      .prepare(`
        SELECT
          a.surah_number,
          a.ayah_number,
          a.text_arabic,
          a.text_english,
          a.text_indonesian,
          a.text_tagalog,
          a.juz,
          a.page,
          s.name_arabic,
          s.name_english
        FROM ayahs a
        JOIN surahs s ON s.number = a.surah_number
        WHERE a.text_clean LIKE ? OR a.text_english LIKE ? OR a.text_indonesian LIKE ? OR a.text_tagalog LIKE ?
        ORDER BY a.surah_number ASC, a.ayah_number ASC
        LIMIT 50
      `)
      .all(arabicPattern, likePattern, likePattern, likePattern);

    return NextResponse.json({ results, query: q });
  } catch (err) {
    console.error("GET /api/search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
