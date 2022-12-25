import { AskSubject, FriendGroupInfo } from "api/node/api-types";

export interface AskDialogState {
    show: boolean;
    loaded: boolean;
    loading: boolean;
    nodeName: string | null;
    nodeCount: number;
    friendGroups: FriendGroupInfo[];
    subjectsAllowed: AskSubject[];
    sending: boolean;
}
