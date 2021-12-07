export type ProgressHandler = (loaded: number, total: number) => void;

export interface FetcherOptions {
    method?: string;
    headers?: HeadersInit;
    body?: string | Blob | null;
    signal?: AbortSignal | null;
    onProgress?: ProgressHandler;
}
