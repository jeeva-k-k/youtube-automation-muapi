export interface TtsRequest {
    text: string;
    voiceName?: string;
    style?: string;
}
export interface TtsResult {
    audioUrl: string;
    requestId: string;
    costUsd: number;
}
export interface StorageUploadRequest {
    filePath: string;
    fileName: string;
}
export interface StorageUploadResult {
    url: string;
}
export interface PublishRequest {
    accountId: number;
    mediaUrl: string;
    title: string;
    description: string;
    tags: string[];
    privacy: 'private' | 'public';
}
export interface PublishResult {
    requestId: string;
}
export interface PublishStatusResult {
    status: 'pending' | 'completed' | 'failed';
    youtubeUrl?: string;
    costUsd?: number;
    costCredits?: number;
    error?: string;
}
export declare class MuApiAdapter {
    private apiKey;
    private configPath;
    private getApiKey;
    private fetchApi;
    generateTts(req: TtsRequest): Promise<TtsResult>;
    uploadFile(req: StorageUploadRequest): Promise<StorageUploadResult>;
    publishYoutube(req: PublishRequest): Promise<PublishResult>;
    getPublishStatus(requestId: string): Promise<PublishStatusResult>;
}
