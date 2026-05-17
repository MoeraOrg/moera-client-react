import { PrivateMediaFileInfo } from "api";

export interface RemoteMediaStatus {
    loading: boolean;
    loaded: boolean;
    error: boolean;
    media: PrivateMediaFileInfo | null;
}

export type RemoteMediaNodeState = Partial<Record<string, RemoteMediaStatus>>;

export type RemoteMediaState = Partial<Record<string, RemoteMediaNodeState>>;
