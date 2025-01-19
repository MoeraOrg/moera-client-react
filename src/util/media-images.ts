import { MediaFilePreviewInfo, PrivateMediaFileInfo } from "api";
import {
    isFigureImageElement,
    isImageElement,
    isScriptureBlock,
    isScriptureElement,
    isScriptureVoidBlock,
    Scripture
} from "ui/control/richtexteditor/visual/scripture";
import { urlWithParameters } from "util/url";
import { isNumber } from "util/misc";
import MEDIA_IMAGE_EXTENSIONS from "util/media-image-extensions.json";

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

export function mediaSources(
    originalLocation: string, mediaPrefix: string, previews: MediaFilePreviewInfo[] | null | undefined
): string {
    if (previews == null) {
        return "";
    }
    return previews.map(preview => {
        const url = preview.original
            ? originalLocation
            : preview.directPath
                ? mediaPrefix + preview.directPath
                : mediaImagePreview(originalLocation, preview.targetWidth);
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

export interface MediaImageTagAttributes {
    src: string;
    srcSet: string;
    sizes: string;
    width: number;
    height: number;
}

export function mediaImageTagAttributes(
    rootPage: string | null, mediaFile: PrivateMediaFileInfo, carte: string | null,
    targetWidth: number, width?: string | number | null, height?: string | number | null
): MediaImageTagAttributes {
    const isPublic = (mediaFile.operations?.view ?? "public") === "public";
    const mediaPrefix = rootPage + "/media/";
    let mediaLocation: string;
    let src: string;
    if (mediaFile.directPath) {
        mediaLocation = mediaPrefix + mediaFile.directPath;
        const preview = mediaImageFindLargerPreview(mediaFile.previews, targetWidth);
        src = rootPage + "/media/" + (preview?.directPath ?? mediaFile.directPath);
    } else {
        const auth = !isPublic && carte != null ? "carte:" + carte : null;
        mediaLocation = urlWithParameters(mediaPrefix + mediaFile.path, {auth});
        src = mediaImagePreview(mediaLocation, targetWidth);
    }
    const srcSet = mediaSources(mediaLocation, mediaPrefix, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? []);
    const [imageWidth, imageHeight] = mediaImageSize(targetWidth, width, height, mediaFile, false);

    return {src, srcSet, sizes, width: imageWidth, height: imageHeight};
}

const HASH_URI_PATTERN = /["' (]hash:([A-Za-z0-9_-]+={0,2})["' )]/g;

export function mediaHashesExtract(text: string | Scripture): Set<string> {
    const result = new Set<string>();
    if (typeof text === "string") {
        const matches = text.matchAll(HASH_URI_PATTERN);
        for (const match of matches) {
            result.add(match[1]);
        }
    } else {
        scriptureMediaHashesExtract(text, result);
    }
    return result;
}

function scriptureMediaHashesExtract(scripture: Scripture, hashes: Set<string>): void {
    scripture.forEach(node => {
        if ((isImageElement(node) || isFigureImageElement(node)) && node.mediaFile?.hash != null) {
            hashes.add(node.mediaFile.hash);
        } else if (isScriptureElement(node) && isScriptureBlock(node) && !isScriptureVoidBlock(node)) {
            scriptureMediaHashesExtract(node.children as Scripture, hashes);
        }
    });
}

export function mediaImageExtensions(mimeType: string | null | undefined): string[] {
    return mimeType != null && mimeType in MEDIA_IMAGE_EXTENSIONS ? MEDIA_IMAGE_EXTENSIONS[mimeType] : [];
}
