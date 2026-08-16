import { PrivateMediaFileInfo } from "api";

export interface AndroidMedia {
    id: string;
    name: string;
    type: string;
    size: number;
    thumbnail: string | null;
}

export type AndroidMediaUploadProgressHandler = (loaded: number, total: number) => void;

export type AndroidMediaUploadHandler = (
    source: AndroidMedia,
    downsize: boolean,
    onProgress?: AndroidMediaUploadProgressHandler
) => Promise<PrivateMediaFileInfo>;

export class AndroidMediaUploadError extends Error {
    readonly code: string;
    readonly retryable: boolean;
    readonly completionUnknown: boolean;
    readonly details?: string;

    constructor(
        code: string,
        message: string,
        retryable: boolean = false,
        completionUnknown: boolean = false,
        details?: string
    ) {
        super(message);
        this.name = "AndroidMediaUploadError";
        this.code = code;
        this.retryable = retryable;
        this.completionUnknown = completionUnknown;
        this.details = details;
    }
}
