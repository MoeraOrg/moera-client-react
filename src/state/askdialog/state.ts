import { FriendGroupInfo } from "api/node/api-types";

export interface AskDialogState {
    show: boolean;
    loaded: boolean;
    loading: boolean;
    nodeName: string | null;
    friendGroups: FriendGroupInfo[];
    sending: boolean;
}
