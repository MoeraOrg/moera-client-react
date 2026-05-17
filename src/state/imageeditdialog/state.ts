import { MediaWithCaption } from "util/media-with-caption";
import { RelNodeName } from "util/rel-node-name";

export interface ImageEditDialogState {
    show: boolean;
    parentOverlayId: string | undefined;
    nodeName: RelNodeName | string;
    media: MediaWithCaption | null;
    loading: boolean;
    saving: boolean;
}
