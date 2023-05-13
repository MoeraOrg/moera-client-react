export interface SheriffOrderTarget {
    nodeName: string;
    fullName?: string | null;
    feedName: string;
    postingOwnerName?: string | null;
    postingOwnerFullName?: string | null;
    postingOwnerGender?: string | null;
    postingHeading?: string | null;
    postingId?: string | null;
    commentOwnerName?: string | null;
    commentOwnerFullName?: string | null;
    commentOwnerGender?: string | null;
    commentHeading?: string | null;
    commentId?: string | null;
}

export interface SheriffOrderDialogState {
    show: boolean;
    target: SheriffOrderTarget | null;
    submitting: boolean;
}
