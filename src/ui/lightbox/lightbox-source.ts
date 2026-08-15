import { isImageType } from "util/mime-type";

export interface LightboxSource {
    url: string;
    previewUrl: string | undefined;
    width: number | undefined;
    height: number | undefined;
    type: "image" | "video";
}

export function lightboxSource(
    url: string | null | undefined,
    previewUrl: string | undefined,
    width: number | undefined,
    height: number | undefined,
    mimeType: string
): LightboxSource | null {
    if (url == null) {
        return null;
    }

    return {
        url,
        previewUrl,
        width,
        height,
        type: isImageType(mimeType) ? "image" : "video"
    };
}
