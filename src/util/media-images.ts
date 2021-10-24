import { MediaFilePreviewInfo, PrivateMediaFileInfo } from "api/node/api-types";
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

export const mediaImagePreview = (location: string, width: number): string => `${location}?width=${width}`;

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

export function mediaImageSize(targetWidth: number,
                               width: number | string | null | undefined,
                               height: number | string | null | undefined,
                               mediaFile: PrivateMediaFileInfo): number[] {
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

    return [Math.round(scale * sizeX), Math.round(scale * sizeY)];
}
