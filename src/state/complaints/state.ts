import { SheriffComplaintGroupInfo, SheriffComplaintInfo } from "api";

export interface ExtComplaintGroupInfo extends SheriffComplaintGroupInfo {
    extracted?: true;
    remotePostingHeadingHtml: string | null;
    remoteCommentHeadingHtml: string | null;
    decisionDetailsHtml: string | null;
}

export interface ExtComplaintInfo extends SheriffComplaintInfo {
    extracted?: true;
    reasonDetailsHtml: string | null;
}

export interface ComplaintsState {
    loadingFuture: boolean;
    loadingPast: boolean;
    before: number;
    after: number;
    complaintGroups: Partial<Record<string, ExtComplaintGroupInfo>>;
    complaintGroupList: string[];
    inboxOnly: boolean;
    total: number;
    totalInFuture: number;
    totalInPast: number;
    activeComplaintGroupId: string | null;
    loadingActive: boolean;
    complaints: ExtComplaintInfo[];
    loadingComplaints: boolean;
    submitting: boolean;
}
