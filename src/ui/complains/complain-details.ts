import { TFunction } from 'i18next';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBan, faCheck, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

import { SheriffComplainStatus } from "api";
import { ExtComplainGroupInfo } from "state/complains/state";
import { NameDisplayMode } from "ui/types";
import { formatFullName } from "util/names";

interface ComplainStatusDetails {
    icon: IconProp | null,
    className: string | undefined,
    unread: boolean
}

export function getComplainStatusDetails(status: SheriffComplainStatus | null | undefined): ComplainStatusDetails {
    const details: ComplainStatusDetails = {
        icon: null,
        className: undefined,
        unread: false
    };

    switch (status) {
        case "posted":
            details.icon = faSyncAlt;
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
            details.icon = faBan;
            details.className = "wrong";
            break;
        case "approved":
            details.icon = faCheck;
            details.className = "good";
            break;
        case "rejected":
            details.icon = faTimes;
            details.className = "wrong";
            break;
    }

    return details;
}

export function getComplainHeadingHtml(group: ExtComplainGroupInfo, nameDisplayMode: NameDisplayMode,
                                       t: TFunction): string {
    let subjectKey: string;
    let subjectValues;
    if (group.remotePostingId == null) {
        subjectKey = "complain-heading.blog";
        subjectValues = {
            name: formatFullName(group.remoteNodeName, group.remoteNodeFullName, nameDisplayMode)
        };
    } else if (group.remoteCommentId == null) {
        subjectKey = "complain-heading.post";
        subjectValues = {
            name: formatFullName(group.remotePostingOwnerName, group.remotePostingOwnerFullName, nameDisplayMode),
            heading: group.remotePostingHeadingHtml
        };
    } else {
        subjectKey = "complain-heading.comment";
        subjectValues = {
            postingName: formatFullName(group.remotePostingOwnerName, group.remotePostingOwnerFullName, nameDisplayMode),
            postingHeading: group.remotePostingHeadingHtml,
            commentName: formatFullName(group.remoteCommentOwnerName, group.remoteCommentOwnerFullName, nameDisplayMode),
            commentHeading: group.remoteCommentHeadingHtml
        };
    }

    return t(subjectKey, subjectValues);
}
