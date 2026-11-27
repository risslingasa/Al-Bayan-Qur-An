# Al-Bayan — Full-Stack Qur'an Reader & Study Workspace

A full-stack Qur'an web application built with **Next.js (JavaScript)**, **Tailwind CSS**, and **SQLite (`better-sqlite3`)**.

## Features
- **Landing Page (`/`)**: Quick-jump Surah cards, features overview, and Contact Us section.
- **Qur'an Reader (`/read`)**: All 114 Surahs and 6,236 Ayahs in Uthmani Arabic script with **English (Sahih International)**, **Tagalog**, and **Indonesian (Kemenag)** translations.
- **Interactive Audio & Read Guide**: 8 Qari recitations, playback speed (`0.75x`–`1.5x`), Ayah loop mode, progressive word-by-word highlighting, and click-any-word-to-play.
- **Study Workspace**: Bookmarks, personal reflection notes, last-read progress tracking, and Hifz memorization status.
- **Arabic-Aware Search**: Search across Arabic (diacritic-normalized), Tagalog, Indonesian, and English.

## Getting Started

```bash
npm install
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
