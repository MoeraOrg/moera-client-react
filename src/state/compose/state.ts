import { DraftInfo, PostingFeatures, PostingInfo } from "api/node/api-types";

export interface ExtDraftInfo extends DraftInfo {
    subject: string | null;
    text: string | null;
    subjectHtml: string | null;
}

export interface DraftPostingInfo extends PostingInfo {
    subjectHtml: string | null;
}

export interface ComposeState {
    loadingFeatures: boolean;
    loadedFeatures: boolean;
    features: PostingFeatures | null;
    postingId: string | null;
    posting: DraftPostingInfo | null;
    loadingPosting: boolean;
    conflict: boolean;
    beingPosted: boolean;
    posted: boolean;
    draftId: string | null;
    draft: ExtDraftInfo | null;
    loadingDraft: boolean;
    savingDraft: boolean;
    savedDraft: boolean;
    sharedText: string | null;
    sharedTextType: SharedTextType | null;
    formId: number;
    draftList: ExtDraftInfo[];
    loadingDraftList: boolean;
    loadedDraftList: boolean;
    showPreview: boolean;
}
