import { PrivateMediaFileInfo } from "api";
import { RelNodeName } from "util/rel-node-name";

export interface ImageEditDialogState {
    show: boolean;
    nodeName: RelNodeName | string;
    media: PrivateMediaFileInfo | null;
    loading: boolean;
    saving: boolean;
}
