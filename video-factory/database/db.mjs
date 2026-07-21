import { readFile, writeFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

const dbDir = '/Users/jeeva/Documents/MUAPI/video-factory/database';
const dbPath = path.join(dbDir, 'tracker.json');

const initialDb = {
  version: '1.0.0',
  updated_at: new Date().toISOString(),
  topics: [],
  videos: [],
  schedules: []
};

export async function loadDb() {
  if (!fs.existsSync(dbDir)) {
    await fs.promises.mkdir(dbDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    await fs.promises.writeFile(dbPath, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }
  try {
    const raw = await readFile(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return initialDb;
  }
}

export async function saveDb(dbData) {
  dbData.updated_at = new Date().toISOString();
  await writeFile(dbPath, JSON.stringify(dbData, null, 2));
}

// Normalize strings for fuzzy title de-duplication
export function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

export async function isTopicDuplicate(workingTitle, conceptKeywords = []) {
  const db = await loadDb();
  const normalizedInput = normalizeTitle(workingTitle);

  for (const t of db.topics) {
    const existingNorm = normalizeTitle(t.working_title);
    if (existingNorm === normalizedInput) {
      return { isDuplicate: true, match: t, reason: 'Exact normalized title match' };
    }

    // Check keyword overlap
    if (conceptKeywords.length > 0) {
      const matchCount = conceptKeywords.filter(kw => existingNorm.includes(kw.toLowerCase())).length;
      if (matchCount >= 3) {
        return { isDuplicate: true, match: t, reason: `High keyword overlap (${matchCount} matching keywords)` };
      }
    }
  }

  return { isDuplicate: false };
}

export async function recordTopic(topicObj) {
  const db = await loadDb();
  const norm = normalizeTitle(topicObj.working_title);

  const existingIdx = db.topics.findIndex(t => normalizeTitle(t.working_title) === norm || t.code === topicObj.code);
  if (existingIdx >= 0) {
    db.topics[existingIdx] = { ...db.topics[existingIdx], ...topicObj, updated_at: new Date().toISOString() };
  } else {
    db.topics.push({
      ...topicObj,
      normalized_title: norm,
      created_at: new Date().toISOString()
    });
  }
  await saveDb(db);
}

export async function recordVideo(videoObj) {
  const db = await loadDb();
  const existingIdx = db.videos.findIndex(v => v.project_id === videoObj.project_id);
  if (existingIdx >= 0) {
    db.videos[existingIdx] = { ...db.videos[existingIdx], ...videoObj, updated_at: new Date().toISOString() };
  } else {
    db.videos.push({ ...videoObj, created_at: new Date().toISOString() });
  }
  await saveDb(db);
}

export async function recordSchedule(scheduleObj) {
  const db = await loadDb();
  const existingIdx = db.schedules.findIndex(s => s.youtube_id === scheduleObj.youtube_id);
  if (existingIdx >= 0) {
    db.schedules[existingIdx] = { ...db.schedules[existingIdx], ...scheduleObj, updated_at: new Date().toISOString() };
  } else {
    db.schedules.push({ ...scheduleObj, created_at: new Date().toISOString() });
  }
  await saveDb(db);
}

// Populate database from existing Project Ledgers
export async function seedFromLedgers() {
  const db = await loadDb();
  console.log('Seeding Database from Upload Ledgers...');

  const ledgerFiles = [
    '/Users/jeeva/Documents/MUAPI/video-factory/projects/upload-ledger-masterplan-1.json',
    '/Users/jeeva/Documents/MUAPI/video-factory/projects/upload-ledger-masterplan-2.json',
    '/Users/jeeva/Documents/MUAPI/video-factory/projects/upload-ledger-remaining-40.json'
  ];

  for (const file of ledgerFiles) {
    if (fs.existsSync(file)) {
      try {
        const ledger = JSON.parse(await readFile(file, 'utf8'));
        if (ledger.entries) {
          ledger.entries.forEach(e => {
            const norm = normalizeTitle(e.title);
            if (!db.topics.some(t => t.normalized_title === norm || t.working_title === e.title)) {
              db.topics.push({
                code: e.project_id,
                category: 'Science',
                working_title: e.title,
                normalized_title: norm,
                created_at: e.timestamp || new Date().toISOString()
              });
            }
          });
        }
      } catch (err) {
        console.error(`Error reading ${file}:`, err.message);
      }
    }
  }

  // Read Schedule Ledger
  try {
    const schedData = JSON.parse(await readFile('/Users/jeeva/Documents/MUAPI/video-factory/projects/schedule-ledger-30min.json', 'utf8'));
    if (schedData.entries) {
      schedData.entries.forEach(s => {
        if (!db.schedules.some(existing => existing.youtube_id === s.id)) {
          db.schedules.push({
            youtube_id: s.id,
            title: s.title,
            scheduled_for_utc: s.scheduled_for_utc,
            scheduled_for_ist: s.scheduled_for_ist,
            youtube_url: s.youtube_url,
            status: 'scheduled',
            created_at: new Date().toISOString()
          });
        }
      });
    }
  } catch (e) {
    // Optional schedule seed
  }

  await saveDb(db);
  console.log(`Database Seed Complete! Total Topics: ${db.topics.length}, Total Schedules: ${db.schedules.length}`);
}
