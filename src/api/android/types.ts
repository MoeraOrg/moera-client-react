import type { PrivateMediaFileInfo } from "api/node/api-types";

export type SharedTextType = "html" | "text";

export type AndroidAppFlavor = "google-play" | "apk";

export interface AndroidJsInterface {
    acknowledgeMediaUpload(id: string): void;
    abandonDraft(draftId: string): void;
    assignMediaUploadsToDraft(draftId: string): void;
    back(): void;
    cancelMediaUpload(id: string): void;
    changeLanguage(lang: string | null): void;
    connectedToHome(url: string | null, token: string | null, ownerName: string | null): void;
    discardSelectedMedia(id: string): void;
    getApiVersion(): number;
    getContentUriFileName(uriString: string): string | null;
    getContentUriMimeType(uriString: string): string | null;
    getFlavor(): AndroidAppFlavor;
    getSharedText(): string;
    getSharedTextType(): SharedTextType;
    isDonationsEnabled(): boolean; // deprecated
    loadSettings(): string;
    loadSettingsMeta(): string;
    locationChanged(url: string, location: string): void;
    log(text: string): void;
    readContentUri(uriString: string): string | null;
    requestMediaUploadStates(): void;
    saveFile(url: string, fileName: string, mimeType: string): void;
    saveImage(url: string, mimeType: string): void;
    setSwipeRefreshEnabled(enabled: boolean): void;
    setWebClientCapabilities(json: string): void;
    share(url: string, title: string): void;
    startMediaUpload(id: string, downsize: boolean, draftId: string | null): void;
    storeSettings(data: string): void;
    toast(text: string): void;
}

export interface AndroidMessageBack {
    source: string;
    action: "back";
}

export interface AndroidMessageCallReturn {
    source: string;
    action: "call-return";
    callId: number;
    value: string | number | null;
}

export interface AndroidMessageNetworkChanged {
    source: string;
    action: "network-changed";
}

export interface AndroidMessageContentSelected {
    source: string;
    action: "content-selected";
    uris: string[];
}

export interface AndroidMediaSelectionItem {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    thumbnail: string | null;
}

export interface AndroidMediaUploadErrorInfo {
    code: string;
    message: string;
    retryable: boolean;
    completionUnknown: boolean;
}

export type AndroidMediaUploadState =
    "QUEUED" | "CREATING" | "UPLOADING" | "RETRY_WAIT" | "FINALIZING" | "COMPLETED" | "FAILED";

export interface AndroidMessageMediaSelected {
    source: string;
    action: "media-selected";
    items: AndroidMediaSelectionItem[];
}

export interface AndroidMessageMediaUploadProgress {
    source: string;
    action: "media-upload-progress";
    id: string;
    draftId: string | null;
    loaded: number;
    total: number;
}

export interface AndroidMessageMediaUploadCompleted {
    source: string;
    action: "media-upload-completed";
    id: string;
    draftId: string | null;
    media: PrivateMediaFileInfo;
}

export interface AndroidMessageMediaUploadFailed {
    source: string;
    action: "media-upload-failed";
    id: string;
    draftId: string | null;
    error: AndroidMediaUploadErrorInfo;
}

export interface AndroidMessageMediaUploadState {
    source: string;
    action: "media-upload-state";
    id: string;
    draftId: string | null;
    state: AndroidMediaUploadState;
    name: string;
    mimeType: string;
    thumbnail: string | null;
    loaded: number;
    total: number;
    media?: PrivateMediaFileInfo;
    error?: AndroidMediaUploadErrorInfo;
}

export type AndroidMessage =
    AndroidMessageBack
    | AndroidMessageCallReturn
    | AndroidMessageNetworkChanged
    | AndroidMessageContentSelected
    | AndroidMessageMediaSelected
    | AndroidMessageMediaUploadProgress
    | AndroidMessageMediaUploadCompleted
    | AndroidMessageMediaUploadFailed
    | AndroidMessageMediaUploadState;
