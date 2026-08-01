import mime from 'mime';

const ADDITIONAL_MIME_TYPES: Record<string, string> = {
    "image/x-png": "png",
    "image/x-webp": "webp",
    "text/markdown": "md",
    "application/cdr": "cdr",
    "application/vnd.corel-draw": "cdr",
    "application/vnd.ms-asf": "asf",
    "application/x-matroska": "mkv"
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

export const isImageType = (mimeType: string | null | undefined): boolean =>
    mimeType != null && mimeType.startsWith("image/");

const NON_STANDARD_VIDEO_MIME_TYPES = [
    "application/mp4",
    "application/ogg",
    "application/x-matroska",
    "application/vnd.rn-realmedia",
    "application/vnd.ms-asf"
];

export const isVideoType = (mimeType: string | null | undefined): boolean =>
    mimeType != null && (mimeType.startsWith("video/") || NON_STANDARD_VIDEO_MIME_TYPES.includes(mimeType));
