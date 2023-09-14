import { PrivateMediaFileInfo } from "api";

export interface ImageEditDialogState {
    show: boolean;
    nodeName: string | null;
    media: PrivateMediaFileInfo | null;
    loading: boolean;
    saving: boolean;
}
