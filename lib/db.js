import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "quran.db");

let dbInstance = null;

/**
 * Strip Arabic diacritics (tashkeel) and normalize alef/taa marbuta
 * so plain Arabic queries match vocalized Uthmani text.
 */
export function stripArabicDiacritics(text = "") {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

export function buildAudioUrl(surahNumber, ayahNumber, reciter = "Alafasy_128kbps") {
  const s = String(surahNumber).padStart(3, "0");
  const a = String(ayahNumber).padStart(3, "0");
  return `https://everyayah.com/data/${reciter}/${s}${a}.mp3`;
}

export const RECITERS = [
  { id: "Alafasy_128kbps", name: "Mishary Rashid Alafasy" },
  { id: "Abdurrahmaan_As-Sudais_192kbps", name: "Abdurrahman As-Sudais" },
  { id: "Ghamadi_40kbps", name: "Saad Al-Ghamdi" },
  { id: "MaherAlMuaiqly128kbps", name: "Maher Al-Muaiqly" },
  { id: "Yasser_Ad-Dussary_128kbps", name: "Yasser Al-Dosari" },
  { id: "Husary_128kbps", name: "Mahmoud Khalil Al-Husary" },
  { id: "Minshawy_Murattal_128kbps", name: "Mohamed Siddiq Al-Minshawi" },
  { id: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit (Murattal)" },
];

export function getDb() {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS surahs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number INTEGER UNIQUE NOT NULL,
      name_arabic TEXT NOT NULL,
      name_english TEXT NOT NULL,
      english_meaning TEXT NOT NULL,
      revelation_place TEXT NOT NULL,
      ayah_count INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ayahs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_number INTEGER NOT NULL,
      ayah_number INTEGER NOT NULL,
      text_arabic TEXT NOT NULL,
      text_clean TEXT NOT NULL,
      text_english TEXT NOT NULL,
      text_indonesian TEXT NOT NULL DEFAULT '',
      text_tagalog TEXT NOT NULL DEFAULT '',
      juz INTEGER DEFAULT 1,
      page INTEGER DEFAULT 1,
      UNIQUE(surah_number, ayah_number),
      FOREIGN KEY (surah_number) REFERENCES surahs(number) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_ayahs_surah ON ayahs(surah_number, ayah_number);
    CREATE INDEX IF NOT EXISTS idx_ayahs_clean ON ayahs(text_clean);

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_number INTEGER NOT NULL,
      ayah_number INTEGER NOT NULL,
      collection TEXT NOT NULL DEFAULT 'Favorites',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(surah_number, ayah_number)
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_number INTEGER NOT NULL,
      ayah_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(surah_number, ayah_number)
    );

    CREATE TABLE IF NOT EXISTS reading_progress (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      surah_number INTEGER NOT NULL,
      ayah_number INTEGER NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS hifz_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_number INTEGER UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress',
      confidence INTEGER NOT NULL DEFAULT 1,
      last_reviewed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Safe migration for existing databases missing text_indonesian / text_tagalog
  const cols = db.prepare("PRAGMA table_info(ayahs)").all();
  if (!cols.some((c) => c.name === "text_indonesian")) {
    db.exec("ALTER TABLE ayahs ADD COLUMN text_indonesian TEXT NOT NULL DEFAULT ''");
  }
  if (!cols.some((c) => c.name === "text_tagalog")) {
    db.exec("ALTER TABLE ayahs ADD COLUMN text_tagalog TEXT NOT NULL DEFAULT ''");
  }

  dbInstance = db;
  return db;
}
