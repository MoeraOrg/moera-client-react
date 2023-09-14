import { LinkPreviewInfo, VerifiedMediaFile } from "api";

export interface LinkImageState {
    uploading: boolean;
    info: VerifiedMediaFile | null;
}

export interface LinkPreviewState {
    loading: boolean;
    loaded: boolean;
    info: LinkPreviewInfo | null;
    images: Partial<Record<string, LinkImageState | null>>;
}

export type LinkPreviewsState = Partial<Record<string, LinkPreviewState>>;
