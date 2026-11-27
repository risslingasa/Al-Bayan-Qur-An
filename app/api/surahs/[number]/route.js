import { NextResponse } from "next/server";
import { getDb, getQuranData, buildAudioUrl } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { number } = await params;
    const surahNumber = Number(number);

    if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json({ error: "Invalid surah number" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const reciter = searchParams.get("reciter") || "Alafasy_128kbps";

    const { surahMap, ayahsBySurah } = getQuranData();
    const baseSurah = surahMap.get(surahNumber);

    if (!baseSurah) {
      return NextResponse.json({ error: "Surah not found" }, { status: 404 });
    }

    const db = getDb();
    const hifz = db
      .prepare("SELECT status, confidence FROM hifz_goals WHERE surah_number = ?")
      .get(surahNumber);
    const bookmarkRows = db
      .prepare("SELECT ayah_number, collection FROM bookmarks WHERE surah_number = ?")
      .all(surahNumber);
    const noteRows = db
      .prepare("SELECT ayah_number, content FROM notes WHERE surah_number = ?")
      .all(surahNumber);

    const bookmarkMap = new Map(bookmarkRows.map((b) => [b.ayah_number, b.collection]));
    const noteMap = new Map(noteRows.map((n) => [n.ayah_number, n.content]));

    const surah = {
      ...baseSurah,
      hifz_status: hifz?.status || null,
      hifz_confidence: hifz?.confidence || null,
    };

    const rawAyahs = ayahsBySurah.get(surahNumber) || [];
    const ayahs = rawAyahs.map((ayah) => ({
      id: ayah.id,
      surah_number: ayah.surah_number,
      ayah_number: ayah.ayah_number,
      text_arabic: ayah.text_arabic,
      text_english: ayah.text_english,
      text_indonesian: ayah.text_indonesian,
      text_tagalog: ayah.text_tagalog,
      juz: ayah.juz,
      page: ayah.page,
      is_bookmarked: bookmarkMap.has(ayah.ayah_number),
      bookmark_collection: bookmarkMap.get(ayah.ayah_number) || null,
      note: noteMap.get(ayah.ayah_number) || null,
      audio_url: buildAudioUrl(ayah.surah_number, ayah.ayah_number, reciter),
    }));

    return NextResponse.json({ surah, ayahs });
  } catch (err) {
    console.error("GET /api/surahs/[number] error:", err);
    return NextResponse.json({ error: "Failed to load surah" }, { status: 500 });
  }
}
