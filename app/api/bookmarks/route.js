import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const bookmarks = db
      .prepare(`
        SELECT
          b.id,
          b.surah_number,
          b.ayah_number,
          b.collection,
          b.created_at,
          a.text_arabic,
          a.text_english,
          s.name_arabic,
          s.name_english
        FROM bookmarks b
        JOIN ayahs a
          ON a.surah_number = b.surah_number AND a.ayah_number = b.ayah_number
        JOIN surahs s ON s.number = b.surah_number
        ORDER BY b.created_at DESC
      `)
      .all();

    return NextResponse.json({ bookmarks });
  } catch (err) {
    console.error("GET /api/bookmarks error:", err);
    return NextResponse.json({ error: "Failed to load bookmarks" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { surahNumber, ayahNumber, collection = "Favorites" } = await request.json();
    const s = Number(surahNumber);
    const a = Number(ayahNumber);

    if (!Number.isInteger(s) || !Number.isInteger(a)) {
      return NextResponse.json({ error: "Invalid surah or ayah number" }, { status: 400 });
    }

    const db = getDb();
    const existing = db
      .prepare("SELECT id FROM bookmarks WHERE surah_number = ? AND ayah_number = ?")
      .get(s, a);

    if (existing) {
      db.prepare("DELETE FROM bookmarks WHERE id = ?").run(existing.id);
      return NextResponse.json({ bookmarked: false });
    }

    db.prepare(
      "INSERT INTO bookmarks (surah_number, ayah_number, collection) VALUES (?, ?, ?)"
    ).run(s, a, collection);

    return NextResponse.json({ bookmarked: true, collection });
  } catch (err) {
    console.error("POST /api/bookmarks error:", err);
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
  }
}
