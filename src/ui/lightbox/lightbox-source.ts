import { isImageType } from "util/mime-type";

export interface LightboxSource {
    url: string;
    type: "image" | "video";
}

export function lightboxSource(url: string | null | undefined, mimeType: string): LightboxSource | null {
    if (url == null) {
        return null;
    }

    return {
        url,
        type: isImageType(mimeType) ? "image" : "video"
    };
}
