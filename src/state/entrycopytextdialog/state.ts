import { Body, MediaAttachment } from "api/node/api-types";

export interface EntryCopyTextDialogState {
    show: boolean;
    body: Body | null;
    nodeName: string;
    media: MediaAttachment[] | null;
}
