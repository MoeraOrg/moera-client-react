import { PrivateMediaFileInfo } from "api/node/api-types";

export interface ImageEditDialogState {
    show: boolean;
    nodeName: string | null;
    media: PrivateMediaFileInfo | null;
    loading: boolean;
    saving: boolean;
}
