import mime from 'mime';

const ADDITIONAL_MIME_TYPES: Record<string, string> = {
    "image/x-png": "png",
    "image/x-webp": "webp",
    "text/markdown": "md",
    "application/cdr": "cdr",
    "application/vnd.corel-draw": "cdr",
};

export function extension(mimeType: null | undefined): undefined;
export function extension(mimeType: string): string;
export function extension(mimeType: string | null | undefined): string | undefined;
export function extension(mimeType: string | null | undefined): string | undefined {
    if (mimeType == null) {
        return undefined;
    }
    const ext = mime.getExtension(mimeType);
    return ext ?? ADDITIONAL_MIME_TYPES[mimeType] ?? (mimeType.startsWith("text/") ? "txt" : "bin");
}
