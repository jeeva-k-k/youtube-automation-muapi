"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuApiAdapter = void 0;
const core_1 = require("core");
const promises_1 = require("node:fs/promises");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class MuApiAdapter {
    apiKey = '';
    configPath = '/Users/jeeva/Documents/Codex/2026-07-16/https-muapi-ai-docs-mcp/.codex/config.toml';
    async getApiKey() {
        if (this.apiKey)
            return this.apiKey;
        if (process.env.MUAPI_API_KEY) {
            this.apiKey = process.env.MUAPI_API_KEY;
            return this.apiKey;
        }
        try {
            const config = await (0, promises_1.readFile)(this.configPath, 'utf8');
            const key = config.match(/Authorization\s*=\s*"Bearer\s+([^"]+)"/)?.[1];
            if (key) {
                this.apiKey = key;
                return this.apiKey;
            }
        }
        catch (e) {
            // Ignored, fallback to missing
        }
        throw new Error('MuAPI API key missing. Set MUAPI_API_KEY or configure config.toml.');
    }
    async fetchApi(endpoint, options = {}) {
        const key = await this.getApiKey();
        const response = await fetch(`https://api.muapi.ai/api/v1${endpoint}`, {
            ...options,
            headers: {
                'x-api-key': key,
                ...(options.body && !(options.body instanceof FormData) ? { 'content-type': 'application/json' } : {}),
                ...options.headers
            }
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(`MuAPI HTTP ${response.status}: ${JSON.stringify(body)}`);
        }
        return body;
    }
    // ----------------------------------------------------
    // TTS Generation Adapter
    // ----------------------------------------------------
    async generateTts(req) {
        core_1.Logger.info('MuAPI TTS request started...', { textLength: req.text.length });
        const payload = {
            speakers: [{
                    speaker_id: 'Speaker 1',
                    voice_name: req.voiceName || 'Charon',
                    accent: 'Neutral',
                    style: req.style || 'Newscaster',
                    pace: 'Natural',
                    audio_profile: 'A warm, curious, intelligent science narrator; cinematic but conversational'
                }],
            dialogue_turns: [{ speaker_id: 'Speaker 1', text: req.text }],
            scene: 'Clean studio narration for a premium visual-science documentary short',
            sample_context: 'Precise, intriguing, calm documentary narration with subtle wonder; never exaggerated',
            temperature: 0.7
        };
        const submitted = await this.fetchApi('/gemini-3-1-flash-tts', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const requestId = submitted.request_id || submitted.id;
        if (!requestId) {
            throw new Error('TTS submission returned no request ID.');
        }
        core_1.Logger.info('TTS request submitted.', { requestId });
        // Poll for status
        let result = null;
        for (let attempt = 0; attempt < 90; attempt += 1) {
            const body = await this.fetchApi(`/predictions/${requestId}/result`);
            result = body.detail || body;
            if (result.status === 'completed')
                break;
            if (result.status === 'failed') {
                throw new Error(result.error || 'TTS generation failed.');
            }
            await sleep(4000);
        }
        if (!result || result.status !== 'completed') {
            throw new Error('TTS generation timed out.');
        }
        const output = result.output || result.outputs?.[0] || {};
        const audioUrl = typeof output === 'string' ? output : output.audio_url || output.audio || result.audio_url;
        if (!audioUrl) {
            throw new Error('Completed TTS output returned no audio URL.');
        }
        return {
            audioUrl,
            requestId,
            costUsd: result.cost?.amount_usd ?? 0.012
        };
    }
    // ----------------------------------------------------
    // Storage Upload Adapter
    // ----------------------------------------------------
    async uploadFile(req) {
        core_1.Logger.info('Uploading file to MuAPI storage...', { fileName: req.fileName });
        const key = await this.getApiKey();
        const bytes = await (0, promises_1.readFile)(req.filePath);
        const form = new FormData();
        form.append('file', new Blob([bytes], { type: 'video/mp4' }), req.fileName);
        const response = await fetch('https://api.muapi.ai/api/v1/upload_file', {
            method: 'POST',
            headers: { 'x-api-key': key },
            body: form
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !body.url) {
            throw new Error(`Upload failed (HTTP ${response.status}): ${JSON.stringify(body)}`);
        }
        core_1.Logger.info('Upload complete.', { url: body.url });
        return { url: body.url };
    }
    // ----------------------------------------------------
    // Publishing Adapter
    // ----------------------------------------------------
    async publishYoutube(req) {
        core_1.Logger.info('Submitting YouTube publish request...', { title: req.title });
        const payload = {
            account_id: req.accountId,
            media_url: req.mediaUrl,
            title: req.title,
            description: req.description,
            tags: req.tags,
            privacy: req.privacy,
            category_id: '28', // Science & Technology
            made_for_kids: false
        };
        const submitted = await this.fetchApi('/youtube-publish', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const requestId = submitted.request_id || submitted.id;
        if (!requestId) {
            throw new Error('Publish submission returned no request ID.');
        }
        core_1.Logger.info('YouTube publish request submitted.', { requestId });
        return { requestId };
    }
    async getPublishStatus(requestId) {
        const body = await this.fetchApi(`/predictions/${requestId}/result`);
        const result = body.detail || body;
        if (result.status === 'completed') {
            const outputs = result.outputs || result.output || [];
            const youtubeUrl = typeof outputs[0] === 'string' ? outputs[0] : outputs[0]?.url;
            return {
                status: 'completed',
                youtubeUrl,
                costUsd: result.cost?.amount_usd ?? 0.01,
                costCredits: result.cost?.amount_credits ?? 1
            };
        }
        else if (result.status === 'failed') {
            return {
                status: 'failed',
                error: result.error || 'Publish failed.'
            };
        }
        return { status: 'pending' };
    }
}
exports.MuApiAdapter = MuApiAdapter;
