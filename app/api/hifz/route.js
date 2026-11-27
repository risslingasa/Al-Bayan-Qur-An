import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const goals = db
      .prepare(`
        SELECT
          h.surah_number,
          h.status,
          h.confidence,
          h.last_reviewed_at,
          s.name_arabic,
          s.name_english,
          s.ayah_count
        FROM hifz_goals h
        JOIN surahs s ON s.number = h.surah_number
        ORDER BY h.last_reviewed_at DESC
      `)
      .all();

    return NextResponse.json({ goals });
  } catch (err) {
    console.error("GET /api/hifz error:", err);
    return NextResponse.json({ error: "Failed to load Hifz goals" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { surahNumber, status = "in_progress", confidence = 3 } = await request.json();
    const s = Number(surahNumber);
    const c = Math.min(5, Math.max(1, Number(confidence) || 1));

    if (!Number.isInteger(s) || s < 1 || s > 114) {
      return NextResponse.json({ error: "Invalid surah number" }, { status: 400 });
    }

    const db = getDb();
    if (status === "not_started") {
      db.prepare("DELETE FROM hifz_goals WHERE surah_number = ?").run(s);
      return NextResponse.json({ deleted: true });
    }

    db.prepare(`
      INSERT INTO hifz_goals (surah_number, status, confidence, last_reviewed_at)
      VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(surah_number) DO UPDATE SET
        status = excluded.status,
        confidence = excluded.confidence,
        last_reviewed_at = datetime('now')
    `).run(s, status, c);

    return NextResponse.json({ saved: true, surahNumber: s, status, confidence: c });
  } catch (err) {
    console.error("POST /api/hifz error:", err);
    return NextResponse.json({ error: "Failed to save Hifz goal" }, { status: 500 });
  }
}
