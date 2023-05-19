import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { ExtComplainGroupInfo } from "state/complains/state";
import { NameDisplayMode } from "ui/types";
import Jump from "ui/navigation/Jump";
import { formatFullName } from "util/misc";
import "./ComplainGroupLine.css";

type Props = {
    group: ExtComplainGroupInfo;
} & ConnectedProps<typeof connector>;

function ComplainGroupLine({group, nameDisplayMode}: Props) {
    const {t} = useTranslation();

    let statusIcon: IconProp | null = null;
    let statusClass: string | undefined = undefined;
    let unread: boolean = false;
    switch (group.status) {
        case "posted":
            statusIcon = "sync-alt";
            statusClass = "processing";
            unread = true;
            break;
        case "prepared":
            unread = true;
            break;
        case "prepare-failed":
        case "not-found":
        case "invalid-target":
        case "not-original":
        case "not-sheriff":
            statusIcon = "ban";
            statusClass = "wrong";
            break;
        case "accepted":
            statusIcon = "check";
            statusClass = "good";
            break;
        case "rejected":
            statusIcon = "times";
            statusClass = "wrong";
            break;
    }

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

    return (
        <Jump href={`/complains/${group.id}`} className="complain-group-line">
            <div className={cx("status", statusClass)} title={t("complain-status." + group.status)}>
                {statusIcon &&
                    <FontAwesomeIcon icon={statusIcon}/>
                }
            </div>
            <div className={cx("heading", {"unread": unread})}
                 dangerouslySetInnerHTML={{__html: t(subjectKey, subjectValues)}}/>
        </Jump>
    );
}

const connector = connect(
    (state: ClientState) => ({
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    })
);

export default connector(ComplainGroupLine);
