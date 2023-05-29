import { SheriffComplainGroupInfo, SheriffComplainInfo } from "api/node/api-types";

export interface ExtComplainGroupInfo extends SheriffComplainGroupInfo {
    extracted?: true;
    remotePostingHeadingHtml: string | null;
    remoteCommentHeadingHtml: string | null;
    decisionDetailsHtml: string | null;
}

export interface ExtComplainInfo extends SheriffComplainInfo {
    extracted?: true;
    reasonDetailsHtml: string | null;
}

export interface ComplainsState {
    loadingFuture: boolean;
    loadingPast: boolean;
    before: number;
    after: number;
    complainGroups: Partial<Record<string, ExtComplainGroupInfo>>;
    complainGroupList: string[];
    inboxOnly: boolean;
    total: number;
    totalInFuture: number;
    totalInPast: number;
    activeComplainGroupId: string | null;
    loadingActive: boolean;
    complains: ExtComplainInfo[];
    loadingComplains: boolean;
    submitting: boolean;
}
