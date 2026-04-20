import { RelNodeName } from "util/rel-node-name";

export interface LightboxState {
    show: boolean;
    nodeName: RelNodeName | string;
    postingId: string | null;
    commentId: string | null;
    mediaId: string | null;
}
