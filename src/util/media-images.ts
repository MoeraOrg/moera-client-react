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
import { resolveMediaUrl } from "util/media-url";
import { extension, isImageType } from "util/mime-type";
import { MediaWithCaption } from "util/media-with-caption";
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

function mediaImageFindLargerPreview(
    previews: MediaFilePreviewInfo[] | null | undefined, width: number, isImage: boolean
): MediaFilePreviewInfo | null {
    if (previews == null) {
        return null;
    }
    let smallest: MediaFilePreviewInfo | null = null;
    let largest: MediaFilePreviewInfo | null = null;
    previews.forEach(preview => {
        if (preview.targetWidth >= width && (smallest == null || smallest.targetWidth > preview.targetWidth)) {
            smallest = preview;
        }
        if (largest == null || largest.targetWidth < preview.targetWidth) {
            largest = preview;
        }
    });
    return smallest != null ? smallest : (isImage ? null : largest);
}

function mediaSources(
    originalLocation: string, rootPage: string | null, previews: MediaFilePreviewInfo[] | null | undefined
): string {
    if (previews == null) {
        return "";
    }
    return previews.map(preview => {
        const url = preview.original
            ? originalLocation
            : resolveMediaUrl(rootPage, preview.directPath ?? preview.path);
        return `${url} ${preview.width}w`;
    }).join(",");
}

function mediaSizes(previews: MediaFilePreviewInfo[] | null | undefined, isImage: boolean): string {
    const mobile = Math.min(350, mediaImageFindLargerPreview(previews, 350, isImage)?.width ?? 350);
    const regular = Math.min(900, mediaImageFindLargerPreview(previews, 900, isImage)?.width ?? 900);
    return `(max-width: 400px) ${mobile}px, ${regular}px`;
}

export function mediaImageSize(
    targetWidth: number,
    width: number | string | null | undefined,
    height: number | string | null | undefined,
    mediaFile: PrivateMediaFileInfo,
    enlarge: boolean = true
): number[] {
    const preview = mediaImageFindLargerPreview(mediaFile.previews, targetWidth, isImageType(mediaFile.mimeType));
    const sizeX = preview != null ? preview.width : mediaFile.width;
    const sizeY = preview != null ? preview.height : mediaFile.height;
    return mediaImageRect(width, height, sizeX, sizeY, enlarge);
}

export function mediaImageRect(
    width: number | string | null | undefined,
    height: number | string | null | undefined,
    rectWidth: number | null | undefined,
    rectHeight: number | null | undefined,
    enlarge: boolean = true
): number[] {
    const iwidth = toInt(width);
    const iheight = toInt(height);

    if (rectWidth == null || rectWidth === 0 || rectHeight == null || rectHeight === 0) {
        return [iwidth, iheight];
    }

    let scale: number;
    if (iwidth === 0 && iheight === 0) {
        scale = 1;
    } else {
        const scaleX = iwidth !== 0 ? iwidth / rectWidth : 1;
        const scaleY = iheight !== 0 ? iheight / rectHeight : 1;
        scale = Math.min(scaleX, scaleY);
    }
    if (!enlarge && scale > 1) {
        scale = 1;
    }

    return [Math.round(scale * rectWidth), Math.round(scale * rectHeight)];
}

export interface MediaImageTagAttributes {
    src: string;
    srcSet: string;
    sizes: string;
    width: number;
    height: number;
    alt?: string;
}

export function mediaImageTagAttributes(
    rootPage: string | null,
    mediaFile: PrivateMediaFileInfo,
    targetWidth: number,
    width?: string | number | null,
    height?: string | number | null
): MediaImageTagAttributes {
    let mediaLocation: string;
    let src: string;
    const preview = mediaImageFindLargerPreview(mediaFile.previews, targetWidth, isImageType(mediaFile.mimeType));
    if (mediaFile.directPath) {
        mediaLocation = resolveMediaUrl(rootPage, mediaFile.directPath);
        src = resolveMediaUrl(rootPage, preview?.directPath ?? mediaFile.directPath);
    } else {
        mediaLocation = resolveMediaUrl(rootPage, mediaFile.path);
        src = preview != null
            ? resolveMediaUrl(rootPage, preview.path)
            : mediaImagePreview(mediaLocation, targetWidth);
    }
    const srcSet = mediaSources(mediaLocation, rootPage, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? [], isImageType(mediaFile.mimeType));
    const [imageWidth, imageHeight] = mediaImageSize(targetWidth, width, height, mediaFile, false);
    const alt = mediaFile.textContent || undefined;

    return {src, srcSet, sizes, width: imageWidth, height: imageHeight, alt};
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

export function isMediaDirectPathExpiring(media: PrivateMediaFileInfo | null | undefined): boolean {
    return media?.directPath != null
        && media.directPathExpiresAt != null
        && (media.directPathExpiresAt - Date.now() / 1000) < 24 * 60 * 60;
}

export function mediaFileName(media: null | undefined): undefined;
export function mediaFileName(media: PrivateMediaFileInfo | MediaWithCaption): string;
export function mediaFileName(media: PrivateMediaFileInfo | MediaWithCaption | null | undefined): string | undefined {
    if (media == null) {
        return undefined;
    }
    return media.title ? media.title + "." + extension(media.mimeType) : media.path?.split("/").pop()?.split("?")[0];
}
