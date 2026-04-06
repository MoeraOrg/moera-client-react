import { PrivateMediaFileInfo } from "api";

export interface MediaDownloadDialogState {
    show: boolean;
    nodeName: string;
    mediaId: string;
    errorCode: string | null;
    media: PrivateMediaFileInfo | null;
}
