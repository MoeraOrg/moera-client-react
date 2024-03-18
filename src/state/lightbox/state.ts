import { RelNodeName } from "util/rel-node-name";

export interface LightBoxState {
    show: boolean;
    nodeName: RelNodeName | string;
    postingId: string | null;
    commentId: string | null;
    mediaId: string | null;
}
