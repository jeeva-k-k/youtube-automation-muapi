"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFmpegRunner = exports.Ledger = exports.ProjectSchema = exports.Logger = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const zod_1 = require("zod");
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const execAsync = (0, node_util_1.promisify)(node_child_process_1.exec);
// ----------------------------------------------------
// 1. Logger Utility
// ----------------------------------------------------
class Logger {
    static info(message, meta = {}) {
        console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'INFO', message, ...meta }));
    }
    static error(message, error, meta = {}) {
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
exports.Logger = Logger;
// ----------------------------------------------------
// 2. Project & Manifest Schemas
// ----------------------------------------------------
exports.ProjectSchema = zod_1.z.object({
    project_id: zod_1.z.string(),
    topic: zod_1.z.string(),
    audience: zod_1.z.string().default('general'),
    language: zod_1.z.string().default('en'),
    target_duration_seconds: zod_1.z.number().optional(),
    generic: zod_1.z.boolean().default(true),
    theme: zod_1.z.string().default('blueprint'),
    footer_rail: zod_1.z.array(zod_1.z.string()).optional(),
    narration_text: zod_1.z.string(),
    scenes: zod_1.z.array(zod_1.z.any()),
    captions: zod_1.z.array(zod_1.z.any()),
    format: zod_1.z.object({
        preset: zod_1.z.string().default('youtube-landscape'),
        width: zod_1.z.number().default(1920),
        height: zod_1.z.number().default(1080),
        fps: zod_1.z.number().default(30),
        duration: zod_1.z.number().optional(),
        crf: zod_1.z.number().default(18)
    }),
    style_profile: zod_1.z.string().default('cinematic-science'),
    brand_profile: zod_1.z.string().default('default-science-brand'),
    caption_profile: zod_1.z.string().default('keyword-highlight'),
    audio_profile: zod_1.z.string().default('narration-web'),
    providers: zod_1.z.object({
        tts: zod_1.z.string().default('muapi'),
        image: zod_1.z.string().default('muapi'),
        video: zod_1.z.string().default('auto'),
        alignment: zod_1.z.string().default('auto'),
        publishing: zod_1.z.string().default('muapi')
    }).default({
        tts: 'muapi',
        image: 'muapi',
        video: 'auto',
        alignment: 'auto',
        publishing: 'muapi'
    }),
    publishing: zod_1.z.object({
        platform: zod_1.z.string().default('youtube'),
        privacy: zod_1.z.string().default('private'),
        category_id: zod_1.z.string().default('28'),
        language: zod_1.z.string().default('en'),
        requires_human_approval: zod_1.z.boolean().default(true)
    }).default({
        platform: 'youtube',
        privacy: 'private',
        category_id: '28',
        language: 'en',
        requires_human_approval: true
    }),
    limits: zod_1.z.object({
        max_cost_usd: zod_1.z.number().default(5.0),
        max_render_attempts: zod_1.z.number().default(2),
        max_provider_attempts: zod_1.z.number().default(3)
    }).default({
        max_cost_usd: 5.0,
        max_render_attempts: 2,
        max_provider_attempts: 3
    })
});
// ----------------------------------------------------
// 3. SQLite Database Ledger Setup
// ----------------------------------------------------
class Ledger {
    db;
    constructor(dbPath) {
        this.db = new better_sqlite3_1.default(dbPath);
        this.init();
    }
    init() {
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
    saveJob(job) {
        const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO jobs (
        job_id, project_id, content_hash, status, current_stage,
        created_at, updated_at, attempt_count, error_code, error_message,
        provider_request_ids, render_id, publishing_video_id, cost_usd, manifest_path
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
        stmt.run(job.job_id, job.project_id, job.content_hash, job.status, job.current_stage, job.created_at || new Date().toISOString(), new Date().toISOString(), job.attempt_count || 1, job.error_code || null, job.error_message || null, JSON.stringify(job.provider_request_ids || []), job.render_id || null, job.publishing_video_id || null, job.cost_usd || 0.0, job.manifest_path || null);
    }
    getJob(jobId) {
        const stmt = this.db.prepare('SELECT * FROM jobs WHERE job_id = ?');
        const row = stmt.get(jobId);
        if (row) {
            row.provider_request_ids = JSON.parse(row.provider_request_ids || '[]');
        }
        return row;
    }
}
exports.Ledger = Ledger;
// ----------------------------------------------------
// 4. FFmpeg Command Execution Helper
// ----------------------------------------------------
class FFmpegRunner {
    static async normalizeAudio(inputPath, outputPath, targetLufs = -16) {
        Logger.info('Normalizing audio with FFmpeg...', { inputPath, outputPath, targetLufs });
        // Perform standard loudness normalization (two-pass or standard filter)
        const cmd = `ffmpeg -y -i "${inputPath}" -af loudnorm=I=${targetLufs}:TP=-1.5:LRA=11 -ar 48000 -ac 1 "${outputPath}"`;
        await execAsync(cmd);
        Logger.info('Audio normalization completed.');
    }
    static async assembleVideo(framesPattern, audioPath, outputPath, fps = 30, crf = 18) {
        Logger.info('Assembling frames and audio with FFmpeg...', { framesPattern, audioPath, outputPath, fps });
        // Assemble frames sequentially at visual-lossless quality with faststart
        const cmd = `ffmpeg -y -framerate ${fps} -i "${framesPattern}" -i "${audioPath}" -c:v libx264 -pix_fmt yuv420p -crf ${crf} -c:a aac -b:a 192k -movflags +faststart "${outputPath}"`;
        await execAsync(cmd);
        Logger.info('Video assembly completed.');
    }
    static async verifyVideo(videoPath) {
        Logger.info('Verifying video container with FFprobe & FFmpeg decode loop...', { videoPath });
        try {
            const probeCmd = `ffprobe -v error -show_format -show_streams -of json "${videoPath}"`;
            const { stdout } = await execAsync(probeCmd);
            const probeResult = JSON.parse(stdout);
            const decodeCmd = `ffmpeg -v error -i "${videoPath}" -f null -`;
            await execAsync(decodeCmd);
            Logger.info('Video validation passed.', { probeResult });
            return true;
        }
        catch (err) {
            Logger.error('Video validation failed.', err);
            return false;
        }
    }
}
exports.FFmpegRunner = FFmpegRunner;
