import type { AndroidMediaSelectionItem, AndroidMessageMediaUploadState } from "api/android/types";

export interface AndroidMediaRef {
    id: string;
    name: string;
    type: string;
    size: number;
    thumbnail: string | null;
}

export type LocalMediaSource = File | AndroidMediaRef;
export type MediaUploadSource = LocalMediaSource | string;

export function isAndroidMediaRef(source: MediaUploadSource): source is AndroidMediaRef {
    return typeof source !== "string" && !(source instanceof File);
}

export function androidSelectionToMediaRef(item: AndroidMediaSelectionItem): AndroidMediaRef {
    return {
        id: item.id,
        name: item.name,
        type: item.mimeType,
        size: item.size,
        thumbnail: item.thumbnail
    };
}

export function androidStateToMediaRef(state: AndroidMessageMediaUploadState): AndroidMediaRef {
    return {
        id: state.id,
        name: state.name,
        type: state.mimeType,
        size: state.total,
        thumbnail: state.thumbnail
    };
}
