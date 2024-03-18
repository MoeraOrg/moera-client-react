import { Body, MediaAttachment } from "api";
import { RelNodeName } from "util/rel-node-name";

export interface EntryCopyTextDialogState {
    show: boolean;
    body: Body | null;
    nodeName: RelNodeName | string;
    media: MediaAttachment[] | null;
}
