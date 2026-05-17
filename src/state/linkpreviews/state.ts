import { LinkPreviewInfo, PrivateMediaFileInfo } from "api";

export interface LinkImageState {
    uploading: boolean;
    info: PrivateMediaFileInfo | null;
}

export interface LinkPreviewState {
    loading: boolean;
    loaded: boolean;
    info: LinkPreviewInfo | null;
    images: Partial<Record<string, LinkImageState | null>>;
}

export type LinkPreviewsState = Partial<Record<string, LinkPreviewState>>;
