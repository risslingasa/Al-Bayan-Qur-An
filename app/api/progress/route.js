import { NextResponse } from "next/server";
import { getDb, getQuranData } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const { surahMap } = getQuranData();
    const rp = db
      .prepare("SELECT surah_number, ayah_number, updated_at FROM reading_progress WHERE id = 1")
      .get();

    const s = rp ? surahMap.get(rp.surah_number) : null;
    const progress =
      rp && s
        ? {
            ...rp,
            name_english: s.name_english,
            name_arabic: s.name_arabic,
          }
        : null;

    return NextResponse.json({ progress });
  } catch (err) {
    console.error("GET /api/progress error:", err);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { surahNumber, ayahNumber } = await request.json();
    const s = Number(surahNumber);
    const a = Number(ayahNumber);

    if (!Number.isInteger(s) || !Number.isInteger(a)) {
      return NextResponse.json({ error: "Invalid surah or ayah number" }, { status: 400 });
    }

    const db = getDb();
    db.prepare(`
      INSERT INTO reading_progress (id, surah_number, ayah_number, updated_at)
      VALUES (1, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        surah_number = excluded.surah_number,
        ayah_number = excluded.ayah_number,
        updated_at = datetime('now')
    `).run(s, a);

    return NextResponse.json({ saved: true, surahNumber: s, ayahNumber: a });
  } catch (err) {
    console.error("POST /api/progress error:", err);
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}
