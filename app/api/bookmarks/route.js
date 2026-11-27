import { NextResponse } from "next/server";
import { getDb, getQuranData } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const { ayahMap, surahMap } = getQuranData();
    const rows = db
      .prepare("SELECT id, surah_number, ayah_number, collection, created_at FROM bookmarks ORDER BY created_at DESC")
      .all();

    const bookmarks = rows.map((b) => {
      const a = ayahMap.get(`${b.surah_number}:${b.ayah_number}`);
      const s = surahMap.get(b.surah_number);
      return {
        ...b,
        text_arabic: a?.text_arabic || "",
        text_english: a?.text_english || "",
        name_arabic: s?.name_arabic || "",
        name_english: s?.name_english || "",
      };
    });

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
