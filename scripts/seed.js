import { getDb, stripArabicDiacritics } from "../lib/db.js";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function seed() {
  const db = getDb();

  const existing = db
    .prepare("SELECT COUNT(*) as count FROM ayahs WHERE text_indonesian != '' AND text_tagalog != ''")
    .get();
  if (existing.count >= 6236) {
    console.log(`Database already seeded with ${existing.count} ayahs (Arabic, English, Indonesian, Tagalog).`);
    return;
  }

  console.log("Fetching Qur'an Arabic (Uthmani), English, Indonesian, and Tagalog...");
  const [arabicRes, englishRes, indonesianRes, tagalogRes] = await Promise.all([
    fetchJson("https://api.alquran.cloud/v1/quran/quran-uthmani"),
    fetchJson("https://api.alquran.cloud/v1/quran/en.sahih"),
    fetchJson("https://api.alquran.cloud/v1/quran/id.indonesian"),
    fetchJson("https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/fil-abdullatifeduar.json"),
  ]);

  const arabicSurahs = arabicRes?.data?.surahs;
  const englishSurahs = englishRes?.data?.surahs;
  const indonesianSurahs = indonesianRes?.data?.surahs;
  const tagalogAyahs = tagalogRes?.quran;

  if (
    !Array.isArray(arabicSurahs) ||
    !Array.isArray(englishSurahs) ||
    !Array.isArray(indonesianSurahs) ||
    !Array.isArray(tagalogAyahs)
  ) {
    throw new Error("Unexpected response format from Qur'an APIs");
  }

  const tagalogMap = new Map();
  for (const item of tagalogAyahs) {
    tagalogMap.set(`${item.chapter}:${item.verse}`, item.text || "");
  }

  const insertSurah = db.prepare(`
    INSERT INTO surahs (number, name_arabic, name_english, english_meaning, revelation_place, ayah_count)
    VALUES (@number, @name_arabic, @name_english, @english_meaning, @revelation_place, @ayah_count)
    ON CONFLICT(number) DO UPDATE SET
      name_arabic = excluded.name_arabic,
      name_english = excluded.name_english,
      english_meaning = excluded.english_meaning,
      revelation_place = excluded.revelation_place,
      ayah_count = excluded.ayah_count
  `);

  const insertAyah = db.prepare(`
    INSERT INTO ayahs (surah_number, ayah_number, text_arabic, text_clean, text_english, text_indonesian, text_tagalog, juz, page)
    VALUES (@surah_number, @ayah_number, @text_arabic, @text_clean, @text_english, @text_indonesian, @text_tagalog, @juz, @page)
    ON CONFLICT(surah_number, ayah_number) DO UPDATE SET
      text_arabic = excluded.text_arabic,
      text_clean = excluded.text_clean,
      text_english = excluded.text_english,
      text_indonesian = excluded.text_indonesian,
      text_tagalog = excluded.text_tagalog,
      juz = excluded.juz,
      page = excluded.page
  `);

  const seedTransaction = db.transaction(() => {
    for (let i = 0; i < arabicSurahs.length; i++) {
      const arSurah = arabicSurahs[i];
      const enSurah = englishSurahs[i];
      const idSurah = indonesianSurahs[i];

      insertSurah.run({
        number: arSurah.number,
        name_arabic: arSurah.name,
        name_english: arSurah.englishName,
        english_meaning: arSurah.englishNameTranslation,
        revelation_place: arSurah.revelationType,
        ayah_count: arSurah.ayahs.length,
      });

      for (let j = 0; j < arSurah.ayahs.length; j++) {
        const arAyah = arSurah.ayahs[j];
        const enAyah = enSurah?.ayahs?.[j];
        const idAyah = idSurah?.ayahs?.[j];
        const tlText = tagalogMap.get(`${arSurah.number}:${arAyah.numberInSurah}`) || "";

        insertAyah.run({
          surah_number: arSurah.number,
          ayah_number: arAyah.numberInSurah,
          text_arabic: arAyah.text,
          text_clean: stripArabicDiacritics(arAyah.text),
          text_english: enAyah?.text || "",
          text_indonesian: idAyah?.text || "",
          text_tagalog: tlText,
          juz: arAyah.juz || 1,
          page: arAyah.page || 1,
        });
      }
    }

    db.prepare(`
      INSERT OR IGNORE INTO reading_progress (id, surah_number, ayah_number)
      VALUES (1, 1, 1)
    `).run();
  });

  seedTransaction();

  const counts = {
    surahs: db.prepare("SELECT COUNT(*) as c FROM surahs").get().c,
    ayahs: db.prepare("SELECT COUNT(*) as c FROM ayahs WHERE text_tagalog != ''").get().c,
  };
  console.log(`Seeded ${counts.surahs} surahs and ${counts.ayahs} ayahs (Arabic + English + Indonesian + Tagalog) into data/quran.db.`);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
