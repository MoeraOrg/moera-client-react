import { MediaFileWithCaption } from "ui/control/richtexteditor";
import { RelNodeName } from "util/rel-node-name";

export interface ImageEditDialogState {
    show: boolean;
    parentOverlayId: string | undefined;
    nodeName: RelNodeName | string;
    media: MediaFileWithCaption | null;
    loading: boolean;
    saving: boolean;
}
