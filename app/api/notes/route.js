import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const notes = db
      .prepare(`
        SELECT
          n.id,
          n.surah_number,
          n.ayah_number,
          n.content,
          n.updated_at,
          a.text_arabic,
          a.text_english,
          s.name_arabic,
          s.name_english
        FROM notes n
        JOIN ayahs a
          ON a.surah_number = n.surah_number AND a.ayah_number = n.ayah_number
        JOIN surahs s ON s.number = n.surah_number
        ORDER BY n.updated_at DESC
      `)
      .all();

    return NextResponse.json({ notes });
  } catch (err) {
    console.error("GET /api/notes error:", err);
    return NextResponse.json({ error: "Failed to load notes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { surahNumber, ayahNumber, content = "" } = await request.json();
    const s = Number(surahNumber);
    const a = Number(ayahNumber);
    const trimmed = String(content).trim();

    if (!Number.isInteger(s) || !Number.isInteger(a)) {
      return NextResponse.json({ error: "Invalid surah or ayah number" }, { status: 400 });
    }

    const db = getDb();

    if (!trimmed) {
      db.prepare("DELETE FROM notes WHERE surah_number = ? AND ayah_number = ?").run(s, a);
      return NextResponse.json({ deleted: true, content: "" });
    }

    db.prepare(`
      INSERT INTO notes (surah_number, ayah_number, content, updated_at)
      VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(surah_number, ayah_number) DO UPDATE SET
        content = excluded.content,
        updated_at = datetime('now')
    `).run(s, a, trimmed);

    return NextResponse.json({ saved: true, content: trimmed });
  } catch (err) {
    console.error("POST /api/notes error:", err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
