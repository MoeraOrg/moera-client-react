import type { AndroidMedia } from "api/android/media-upload";
import type { AndroidMediaSelectionItem, AndroidMessageMediaUploadState } from "api/android/types";

export type LocalMediaUploadSource = File | AndroidMedia;
export type MediaUploadSource = LocalMediaUploadSource | string;

export function isAndroidMedia(source: MediaUploadSource): source is AndroidMedia {
    return typeof source !== "string" && !(source instanceof File);
}

export function androidSelectionToMedia(item: AndroidMediaSelectionItem): AndroidMedia {
    return {
        id: item.id,
        name: item.name,
        type: item.mimeType,
        size: item.size,
        thumbnail: item.thumbnail
    };
}

export function androidStateToMedia(state: AndroidMessageMediaUploadState): AndroidMedia {
    return {
        id: state.id,
        name: state.name,
        type: state.mimeType,
        size: state.total,
        thumbnail: state.thumbnail
    };
}
