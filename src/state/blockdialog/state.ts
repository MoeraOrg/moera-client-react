import { BlockedUserInfo } from "api/node/api-types";

export interface BlockDialogState {
    show: boolean;
    nodeName: string;
    fullName: string | null;
    entryNodeName: string | null;
    entryPostingId: string | null;
    prevBlocked: BlockedUserInfo[];
    submitting: boolean;
}
