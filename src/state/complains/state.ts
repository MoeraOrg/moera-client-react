import { SheriffComplainGroupInfo } from "api/node/api-types";

export interface ExtComplainGroupInfo extends SheriffComplainGroupInfo {
    extracted?: true;
    remotePostingHeadingHtml: string | null;
    remoteCommentHeadingHtml: string | null;
    decisionDetailsHtml: string | null;
}

export interface ComplainsState {
    loadingFuture: boolean;
    loadingPast: boolean;
    before: number;
    after: number;
    complainGroups: Partial<Record<string, ExtComplainGroupInfo>>;
    complainGroupList: string[];
    total: number;
    totalInFuture: number;
    totalInPast: number;
}
