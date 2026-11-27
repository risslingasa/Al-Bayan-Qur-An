import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const QURAN_JSON_PATH = path.join(DATA_DIR, "quran.json");

let quranCache = null;
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

/**
 * Load immutable Qur'an data (114 Surahs, 6,236 Ayahs) from data/quran.json
 * and cache indexed maps in memory. Works on Vercel's read-only filesystem.
 */
export function getQuranData() {
  if (quranCache) return quranCache;

  const raw = fs.readFileSync(QURAN_JSON_PATH, "utf-8");
  const { surahs, ayahs } = JSON.parse(raw);

  const surahMap = new Map();
  for (const s of surahs) {
    surahMap.set(s.number, s);
  }

  const ayahsBySurah = new Map();
  const ayahMap = new Map();
  for (const a of ayahs) {
    if (!ayahsBySurah.has(a.surah_number)) {
      ayahsBySurah.set(a.surah_number, []);
    }
    ayahsBySurah.get(a.surah_number).push(a);
    ayahMap.set(`${a.surah_number}:${a.ayah_number}`, a);
  }

  quranCache = { surahs, ayahs, surahMap, ayahsBySurah, ayahMap };
  return quranCache;
}

/**
 * Open writable SQLite DB for study state (bookmarks, notes, progress, hifz).
 * Uses /tmp/study.db on Vercel (where /var/task is read-only) and data/study.db locally.
 */
export function getDb() {
  if (dbInstance) return dbInstance;

  const useTmp = Boolean(process.env.VERCEL);
  const dbPath = useTmp
    ? path.join("/tmp", "study.db")
    : path.join(DATA_DIR, "study.db");

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
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

    INSERT OR IGNORE INTO reading_progress (id, surah_number, ayah_number)
    VALUES (1, 1, 1);
  `);

  dbInstance = db;
  return db;
}
