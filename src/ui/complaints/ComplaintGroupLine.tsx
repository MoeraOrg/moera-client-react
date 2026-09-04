import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ExtComplaintGroupInfo } from "state/complaints/state";
import { getComplaintHeadingHtml, getComplaintStatusDetails } from "ui/complaints/complaint-details";
import { Icon } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { useNameDisplayMode } from "ui/nodename/hooks";
import { ut } from "util/url";
import "./ComplaintGroupLine.css";

interface Props {
    group: ExtComplaintGroupInfo;
}

export default function ComplaintGroupLine({group}: Props) {
    const nameDisplayMode = useNameDisplayMode();
    const {t} = useTranslation();

    const {icon: statusIcon, className: statusClass, unread} = getComplaintStatusDetails(group.status);
    const headingHtml = getComplaintHeadingHtml(group, nameDisplayMode, t);

    return (
        <Jump href={ut`/complaints/${group.id}`} className="complaint-group-line">
            <div className={cx("status", statusClass)} title={t("complaint-status." + group.status)}>
                {statusIcon && <Icon icon={statusIcon} size="1.2em"/>}
            </div>
            <div className={cx("heading", {"unread": unread})} dangerouslySetInnerHTML={{__html: headingHtml}}/>
        </Jump>
    );
}
