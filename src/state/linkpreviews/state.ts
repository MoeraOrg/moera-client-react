import { LinkPreview, LinkPreviewInfo } from "api";
import { MediaWithCaption } from "util/media-with-caption";

export interface LinkImageState {
    loading: boolean;
    info: MediaWithCaption | null;
}

export type ExtLinkPreviewInfo = LinkPreviewInfo & LinkPreview;

export interface LinkPreviewState {
    loading: boolean;
    loaded: boolean;
    info: ExtLinkPreviewInfo | null;
    images: Partial<Record<string, LinkImageState | null>>;
}

export type LinkPreviewsState = Partial<Record<string, LinkPreviewState>>;
