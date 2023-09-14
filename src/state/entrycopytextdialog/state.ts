import { Body, MediaAttachment } from "api";

export interface EntryCopyTextDialogState {
    show: boolean;
    body: Body | null;
    nodeName: string;
    media: MediaAttachment[] | null;
}
