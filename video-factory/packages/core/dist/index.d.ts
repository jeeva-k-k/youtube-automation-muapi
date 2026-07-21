import { z } from 'zod';
export declare class Logger {
    static info(message: string, meta?: Record<string, any>): void;
    static error(message: string, error?: any, meta?: Record<string, any>): void;
}
export declare const ProjectSchema: z.ZodObject<{
    project_id: z.ZodString;
    topic: z.ZodString;
    audience: z.ZodDefault<z.ZodString>;
    language: z.ZodDefault<z.ZodString>;
    target_duration_seconds: z.ZodOptional<z.ZodNumber>;
    generic: z.ZodDefault<z.ZodBoolean>;
    theme: z.ZodDefault<z.ZodString>;
    footer_rail: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    narration_text: z.ZodString;
    scenes: z.ZodArray<z.ZodAny, "many">;
    captions: z.ZodArray<z.ZodAny, "many">;
    format: z.ZodObject<{
        preset: z.ZodDefault<z.ZodString>;
        width: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
        fps: z.ZodDefault<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodNumber>;
        crf: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        preset: string;
        width: number;
        height: number;
        fps: number;
        crf: number;
        duration?: number | undefined;
    }, {
        preset?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        fps?: number | undefined;
        duration?: number | undefined;
        crf?: number | undefined;
    }>;
    style_profile: z.ZodDefault<z.ZodString>;
    brand_profile: z.ZodDefault<z.ZodString>;
    caption_profile: z.ZodDefault<z.ZodString>;
    audio_profile: z.ZodDefault<z.ZodString>;
    providers: z.ZodDefault<z.ZodObject<{
        tts: z.ZodDefault<z.ZodString>;
        image: z.ZodDefault<z.ZodString>;
        video: z.ZodDefault<z.ZodString>;
        alignment: z.ZodDefault<z.ZodString>;
        publishing: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tts: string;
        image: string;
        video: string;
        alignment: string;
        publishing: string;
    }, {
        tts?: string | undefined;
        image?: string | undefined;
        video?: string | undefined;
        alignment?: string | undefined;
        publishing?: string | undefined;
    }>>;
    publishing: z.ZodDefault<z.ZodObject<{
        platform: z.ZodDefault<z.ZodString>;
        privacy: z.ZodDefault<z.ZodString>;
        category_id: z.ZodDefault<z.ZodString>;
        language: z.ZodDefault<z.ZodString>;
        requires_human_approval: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        platform: string;
        privacy: string;
        category_id: string;
        requires_human_approval: boolean;
    }, {
        language?: string | undefined;
        platform?: string | undefined;
        privacy?: string | undefined;
        category_id?: string | undefined;
        requires_human_approval?: boolean | undefined;
    }>>;
    limits: z.ZodDefault<z.ZodObject<{
        max_cost_usd: z.ZodDefault<z.ZodNumber>;
        max_render_attempts: z.ZodDefault<z.ZodNumber>;
        max_provider_attempts: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max_cost_usd: number;
        max_render_attempts: number;
        max_provider_attempts: number;
    }, {
        max_cost_usd?: number | undefined;
        max_render_attempts?: number | undefined;
        max_provider_attempts?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    project_id: string;
    topic: string;
    audience: string;
    language: string;
    generic: boolean;
    theme: string;
    narration_text: string;
    scenes: any[];
    captions: any[];
    format: {
        preset: string;
        width: number;
        height: number;
        fps: number;
        crf: number;
        duration?: number | undefined;
    };
    style_profile: string;
    brand_profile: string;
    caption_profile: string;
    audio_profile: string;
    publishing: {
        language: string;
        platform: string;
        privacy: string;
        category_id: string;
        requires_human_approval: boolean;
    };
    providers: {
        tts: string;
        image: string;
        video: string;
        alignment: string;
        publishing: string;
    };
    limits: {
        max_cost_usd: number;
        max_render_attempts: number;
        max_provider_attempts: number;
    };
    target_duration_seconds?: number | undefined;
    footer_rail?: string[] | undefined;
}, {
    project_id: string;
    topic: string;
    narration_text: string;
    scenes: any[];
    captions: any[];
    format: {
        preset?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        fps?: number | undefined;
        duration?: number | undefined;
        crf?: number | undefined;
    };
    audience?: string | undefined;
    language?: string | undefined;
    target_duration_seconds?: number | undefined;
    generic?: boolean | undefined;
    theme?: string | undefined;
    footer_rail?: string[] | undefined;
    style_profile?: string | undefined;
    brand_profile?: string | undefined;
    caption_profile?: string | undefined;
    audio_profile?: string | undefined;
    publishing?: {
        language?: string | undefined;
        platform?: string | undefined;
        privacy?: string | undefined;
        category_id?: string | undefined;
        requires_human_approval?: boolean | undefined;
    } | undefined;
    providers?: {
        tts?: string | undefined;
        image?: string | undefined;
        video?: string | undefined;
        alignment?: string | undefined;
        publishing?: string | undefined;
    } | undefined;
    limits?: {
        max_cost_usd?: number | undefined;
        max_render_attempts?: number | undefined;
        max_provider_attempts?: number | undefined;
    } | undefined;
}>;
export type ProjectConfig = z.infer<typeof ProjectSchema>;
export declare class Ledger {
    private db;
    constructor(dbPath: string);
    private init;
    saveJob(job: any): void;
    getJob(jobId: string): any;
}
export declare class FFmpegRunner {
    static normalizeAudio(inputPath: string, outputPath: string, targetLufs?: number): Promise<void>;
    static assembleVideo(framesPattern: string, audioPath: string, outputPath: string, fps?: number, crf?: number): Promise<void>;
    static verifyVideo(videoPath: string): Promise<boolean>;
}
