import { Choice, DraftInfo, PostingInfo, SourceFormat } from "api/node/api-types";

export interface ExtDraftInfo extends DraftInfo {
    subject: string | null;
    text: string | null;
    subjectHtml: string | null;
}

export interface ComposeState {
    loadingFeatures: boolean;
    loadedFeatures: boolean;
    subjectPresent: boolean;
    sourceFormats: Choice<SourceFormat>[];
    postingId: string | null;
    posting: PostingInfo | null;
    loadingPosting: boolean;
    conflict: boolean;
    beingPosted: boolean;
    draftId: string | null;
    loadingDraft: boolean;
    savingDraft: boolean;
    savedDraft: boolean;
    sharedText: string | null;
    sharedTextType: SharedTextType | null;
    draftList: ExtDraftInfo[];
    loadingDraftList: boolean;
    loadedDraftList: boolean;
    showPreview: boolean;
}
