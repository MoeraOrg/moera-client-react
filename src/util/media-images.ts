import { MediaFilePreviewInfo, PrivateMediaFileInfo } from "api";
import { urlWithParameters } from "util/url";
import { isNumber } from "util/misc";

function toInt(s: number | string | null | undefined): number {
    if (s == null) {
        return 0;
    }
    if (isNumber(s)) {
        return s;
    }
    const val = parseInt(s);
    return isFinite(val) ? val : 0;
}

// For backward compatibility with padded media file IDs
export const mediaHashStrip = (hash: string): string => hash.endsWith("=") ? hash.substring(0, hash.length - 1) : hash;

export const mediaImagePreview = (location: string, width: number): string => urlWithParameters(location, {width});

export function mediaImageFindLargerPreview(previews: MediaFilePreviewInfo[] | null | undefined,
                                            width: number): MediaFilePreviewInfo | null {
    if (previews == null) {
        return null;
    }
    let larger: MediaFilePreviewInfo | null = null;
    previews.forEach(preview => {
        if (preview.targetWidth >= width && (larger == null || larger.targetWidth > preview.targetWidth)) {
            larger = preview;
        }
    });
    return larger;
}

export function mediaSources(location: string, previews: MediaFilePreviewInfo[] | null | undefined): string {
    if (previews == null) {
        return "";
    }
    return previews.map(preview => {
        const url = preview.original ? location : mediaImagePreview(location, preview.targetWidth);
        return `${url} ${preview.width}w`;
    }).join(",");
}

export function mediaSizes(previews: MediaFilePreviewInfo[] | null | undefined): string {
    const mobile = Math.min(350, mediaImageFindLargerPreview(previews, 350)?.width ?? 350);
    const regular = Math.min(900, mediaImageFindLargerPreview(previews, 900)?.width ?? 900);
    return `(max-width: 400px) ${mobile}px, ${regular}px`;
}

export function mediaImageSize(targetWidth: number,
                               width: number | string | null | undefined,
                               height: number | string | null | undefined,
                               mediaFile: PrivateMediaFileInfo,
                               enlarge: boolean = true): number[] {
    const iwidth = toInt(width);
    const iheight = toInt(height);
    const preview = mediaImageFindLargerPreview(mediaFile.previews, targetWidth);
    const sizeX = preview != null ? preview.width : mediaFile.width;
    const sizeY = preview != null ? preview.height : mediaFile.height;
    let scale: number;
    if (iwidth === 0 && iheight === 0) {
        scale = 1;
    } else {
        const scaleX = iwidth !== 0 ? iwidth / sizeX : 1;
        const scaleY = iheight !== 0 ? iheight / sizeY : 1;
        scale = Math.min(scaleX, scaleY);
    }
    if (!enlarge && scale > 1) {
        scale = 1;
    }

    return [Math.round(scale * sizeX), Math.round(scale * sizeY)];
}

const HASH_URI_PATTERN = /["' (]hash:([A-Za-z0-9_-]+={0,2})["' )]/g;

export function mediaHashesExtract(text: string): Set<string> {
    const result = new Set<string>();
    const matches = text.matchAll(HASH_URI_PATTERN);
    for (const match of matches) {
        result.add(match[1]);
    }
    return result;
}
