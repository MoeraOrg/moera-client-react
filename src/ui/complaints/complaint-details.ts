import { TFunction } from 'i18next';

import { SheriffComplaintStatus } from "api";
import { ExtComplaintGroupInfo } from "state/complaints/state";
import { NameDisplayMode } from "ui/types";
import { MaterialSymbol, msBlock, msCancel, msCheck, msSync } from "ui/material-symbols";
import { formatFullName } from "util/names";

interface ComplaintStatusDetails {
    icon: MaterialSymbol | null,
    className: string | undefined,
    unread: boolean
}

export function getComplaintStatusDetails(status: SheriffComplaintStatus | null | undefined): ComplaintStatusDetails {
    const details: ComplaintStatusDetails = {
        icon: null,
        className: undefined,
        unread: false
    };

    switch (status) {
        case "posted":
            details.icon = msSync;
            details.className = "processing";
            details.unread = true;
            break;
        case "prepared":
            details.unread = true;
            break;
        case "prepare-failed":
        case "not-found":
        case "invalid-target":
        case "not-original":
        case "not-sheriff":
            details.icon = msBlock;
            details.className = "wrong";
            break;
        case "approved":
            details.icon = msCheck;
            details.className = "good";
            break;
        case "rejected":
            details.icon = msCancel;
            details.className = "wrong";
            break;
    }

    return details;
}

export function getComplaintHeadingHtml(group: ExtComplaintGroupInfo, nameDisplayMode: NameDisplayMode,
                                        t: TFunction): string {
    let subjectKey: string;
    let subjectValues;
    if (group.remotePostingId == null) {
        subjectKey = "complaint-heading.blog";
        subjectValues = {
            name: formatFullName(group.remoteNodeName, group.remoteNodeFullName, nameDisplayMode)
        };
    } else if (group.remoteCommentId == null) {
        subjectKey = "complaint-heading.post";
        subjectValues = {
            name: formatFullName(group.remotePostingOwnerName, group.remotePostingOwnerFullName, nameDisplayMode),
            heading: group.remotePostingHeadingHtml
        };
    } else {
        subjectKey = "complaint-heading.comment";
        subjectValues = {
            postingName: formatFullName(group.remotePostingOwnerName, group.remotePostingOwnerFullName, nameDisplayMode),
            postingHeading: group.remotePostingHeadingHtml,
            commentName: formatFullName(group.remoteCommentOwnerName, group.remoteCommentOwnerFullName, nameDisplayMode),
            commentHeading: group.remoteCommentHeadingHtml
        };
    }

    return t(subjectKey, subjectValues);
}
