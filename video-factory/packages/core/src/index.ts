import Database from 'better-sqlite3';
import { z } from 'zod';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs/promises';

const execAsync = promisify(exec);

// ----------------------------------------------------
// 1. Logger Utility
// ----------------------------------------------------
export class Logger {
  static info(message: string, meta: Record<string, any> = {}) {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'INFO', message, ...meta }));
  }
  static error(message: string, error?: any, meta: Record<string, any> = {}) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...meta
    }));
  }
}

// ----------------------------------------------------
// 2. Project & Manifest Schemas
// ----------------------------------------------------
export const ProjectSchema = z.object({
  project_id: z.string(),
  topic: z.string(),
  audience: z.string().default('general'),
  language: z.string().default('en'),
  target_duration_seconds: z.number().optional(),
  generic: z.boolean().default(true),
  theme: z.string().default('blueprint'),
  footer_rail: z.array(z.string()).optional(),
  narration_text: z.string(),
  scenes: z.array(z.any()),
  captions: z.array(z.any()),
  format: z.object({
    preset: z.string().default('youtube-landscape'),
    width: z.number().default(1920),
    height: z.number().default(1080),
    fps: z.number().default(30),
    duration: z.number().optional(),
    crf: z.number().default(18)
  }),
  style_profile: z.string().default('cinematic-science'),
  brand_profile: z.string().default('default-science-brand'),
  caption_profile: z.string().default('keyword-highlight'),
  audio_profile: z.string().default('narration-web'),
  providers: z.object({
    tts: z.string().default('muapi'),
    image: z.string().default('muapi'),
    video: z.string().default('auto'),
    alignment: z.string().default('auto'),
    publishing: z.string().default('muapi')
  }).default({
    tts: 'muapi',
    image: 'muapi',
    video: 'auto',
    alignment: 'auto',
    publishing: 'muapi'
  }),
  publishing: z.object({
    platform: z.string().default('youtube'),
    privacy: z.string().default('private'),
    category_id: z.string().default('28'),
    language: z.string().default('en'),
    requires_human_approval: z.boolean().default(true)
  }).default({
    platform: 'youtube',
    privacy: 'private',
    category_id: '28',
    language: 'en',
    requires_human_approval: true
  }),
  limits: z.object({
    max_cost_usd: z.number().default(5.0),
    max_render_attempts: z.number().default(2),
    max_provider_attempts: z.number().default(3)
  }).default({
    max_cost_usd: 5.0,
    max_render_attempts: 2,
    max_provider_attempts: 3
  })
});

export type ProjectConfig = z.infer<typeof ProjectSchema>;

// ----------------------------------------------------
// 3. SQLite Database Ledger Setup
// ----------------------------------------------------
export class Ledger {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.init();
  }

  private init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        job_id TEXT PRIMARY KEY,
        project_id TEXT,
        content_hash TEXT,
        status TEXT,
        current_stage TEXT,
        created_at TEXT,
        updated_at TEXT,
        attempt_count INTEGER,
        error_code TEXT,
        error_message TEXT,
        provider_request_ids TEXT,
        render_id TEXT,
        publishing_video_id TEXT,
        cost_usd REAL,
        manifest_path TEXT
      )
    `);
  }

  public saveJob(job: any) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO jobs (
        job_id, project_id, content_hash, status, current_stage,
        created_at, updated_at, attempt_count, error_code, error_message,
        provider_request_ids, render_id, publishing_video_id, cost_usd, manifest_path
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
    stmt.run(
      job.job_id,
      job.project_id,
      job.content_hash,
      job.status,
      job.current_stage,
      job.created_at || new Date().toISOString(),
      new Date().toISOString(),
      job.attempt_count || 1,
      job.error_code || null,
      job.error_message || null,
      JSON.stringify(job.provider_request_ids || []),
      job.render_id || null,
      job.publishing_video_id || null,
      job.cost_usd || 0.0,
      job.manifest_path || null
    );
  }

  public getJob(jobId: string): any {
    const stmt = this.db.prepare('SELECT * FROM jobs WHERE job_id = ?');
    const row = stmt.get(jobId) as any;
    if (row) {
      row.provider_request_ids = JSON.parse(row.provider_request_ids || '[]');
    }
    return row;
  }
}

// ----------------------------------------------------
// 4. FFmpeg Command Execution Helper
// ----------------------------------------------------
export class FFmpegRunner {
  static async normalizeAudio(inputPath: string, outputPath: string, targetLufs = -16): Promise<void> {
    Logger.info('Normalizing audio with FFmpeg...', { inputPath, outputPath, targetLufs });
    // Perform standard loudness normalization (two-pass or standard filter)
    const cmd = `ffmpeg -y -i "${inputPath}" -af loudnorm=I=${targetLufs}:TP=-1.5:LRA=11 -ar 48000 -ac 1 "${outputPath}"`;
    await execAsync(cmd);
    Logger.info('Audio normalization completed.');
  }

  static async assembleVideo(
    framesPattern: string,
    audioPath: string,
    outputPath: string,
    fps = 30,
    crf = 18
  ): Promise<void> {
    Logger.info('Assembling frames and audio with FFmpeg...', { framesPattern, audioPath, outputPath, fps });
    // Assemble frames sequentially at visual-lossless quality with faststart
    const cmd = `ffmpeg -y -framerate ${fps} -i "${framesPattern}" -i "${audioPath}" -c:v libx264 -pix_fmt yuv420p -crf ${crf} -c:a aac -b:a 192k -movflags +faststart "${outputPath}"`;
    await execAsync(cmd);
    Logger.info('Video assembly completed.');
  }

  static async verifyVideo(videoPath: string): Promise<boolean> {
    Logger.info('Verifying video container with FFprobe & FFmpeg decode loop...', { videoPath });
    try {
      const probeCmd = `ffprobe -v error -show_format -show_streams -of json "${videoPath}"`;
      const { stdout } = await execAsync(probeCmd);
      const probeResult = JSON.parse(stdout);
      
      const decodeCmd = `ffmpeg -v error -i "${videoPath}" -f null -`;
      await execAsync(decodeCmd);

      Logger.info('Video validation passed.', { probeResult });
      return true;
    } catch (err) {
      Logger.error('Video validation failed.', err);
      return false;
    }
  }
}
