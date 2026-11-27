import { NextResponse } from "next/server";
import { getDb, buildAudioUrl } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { number } = await params;
    const surahNumber = Number(number);

    if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json({ error: "Invalid surah number" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const reciter = searchParams.get("reciter") || "Alafasy_128kbps";

    const db = getDb();
    const surah = db
      .prepare(`
        SELECT s.*, h.status AS hifz_status, h.confidence AS hifz_confidence
        FROM surahs s
        LEFT JOIN hifz_goals h ON h.surah_number = s.number
        WHERE s.number = ?
      `)
      .get(surahNumber);

    if (!surah) {
      return NextResponse.json({ error: "Surah not found" }, { status: 404 });
    }

    const ayahs = db
      .prepare(`
        SELECT
          a.id,
          a.surah_number,
          a.ayah_number,
          a.text_arabic,
          a.text_english,
          a.text_indonesian,
          a.text_tagalog,
          a.juz,
          a.page,
          CASE WHEN b.id IS NOT NULL THEN 1 ELSE 0 END AS is_bookmarked,
          b.collection AS bookmark_collection,
          n.content AS note
        FROM ayahs a
        LEFT JOIN bookmarks b
          ON b.surah_number = a.surah_number AND b.ayah_number = a.ayah_number
        LEFT JOIN notes n
          ON n.surah_number = a.surah_number AND n.ayah_number = a.ayah_number
        WHERE a.surah_number = ?
        ORDER BY a.ayah_number ASC
      `)
      .all(surahNumber)
      .map((ayah) => ({
        ...ayah,
        is_bookmarked: Boolean(ayah.is_bookmarked),
        audio_url: buildAudioUrl(ayah.surah_number, ayah.ayah_number, reciter),
      }));

    return NextResponse.json({ surah, ayahs });
  } catch (err) {
    console.error("GET /api/surahs/[number] error:", err);
    return NextResponse.json({ error: "Failed to load surah" }, { status: 500 });
  }
}
