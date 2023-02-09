import { BlockedByUserInfo, BlockedUserInfo } from "api/node/api-types";

export interface BlockingDetailsDialogState {
    show: boolean;
    loaded: boolean;
    loading: boolean;
    nodeName: string | null;
    remoteNodeName: string | null;
    remotePostingId: string | null;
    remotePostingHeading: string | null;
    by: boolean;
    blocked: (BlockedUserInfo | BlockedByUserInfo)[];
}
