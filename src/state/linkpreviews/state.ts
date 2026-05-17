import { LinkPreviewInfo } from "api";
import { MediaWithCaption } from "util/media-with-caption";

export interface LinkImageState {
    uploading: boolean;
    info: MediaWithCaption | null;
}

export interface LinkPreviewState {
    loading: boolean;
    loaded: boolean;
    info: LinkPreviewInfo | null;
    images: Partial<Record<string, LinkImageState | null>>;
}

export type LinkPreviewsState = Partial<Record<string, LinkPreviewState>>;
