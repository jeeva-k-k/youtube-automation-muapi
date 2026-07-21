import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dbDir = '/Users/jeeva/Documents/MUAPI/video-factory/database';
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'tracker.db');
const db = new DatabaseSync(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    working_title TEXT NOT NULL,
    normalized_title TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT UNIQUE NOT NULL,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    duration REAL NOT NULL,
    render_path TEXT NOT NULL,
    muapi_url TEXT,
    youtube_id TEXT,
    youtube_url TEXT,
    upload_cost_usd REAL DEFAULT 0.01,
    status TEXT DEFAULT 'compiled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (code) REFERENCES topics(code)
  );

  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    youtube_id TEXT UNIQUE NOT NULL,
    project_id TEXT NOT NULL,
    privacy_status TEXT DEFAULT 'private',
    scheduled_for_utc TEXT NOT NULL,
    scheduled_for_ist TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log(`Database initialized successfully at: ${dbPath}`);
