export interface SheriffOrderDialogState {
    show: boolean;
    nodeName: string;
    fullName: string | null;
    feedName: string;
    postingId: string | null;
    commentId: string | null;
    heading: string;
    submitting: boolean;
}
