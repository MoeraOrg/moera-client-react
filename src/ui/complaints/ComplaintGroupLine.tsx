import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { ExtComplaintGroupInfo } from "state/complaints/state";
import { getComplaintHeadingHtml, getComplaintStatusDetails } from "ui/complaints/complaint-details";
import { NameDisplayMode } from "ui/types";
import { Icon } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import "./ComplaintGroupLine.css";

interface Props {
    group: ExtComplaintGroupInfo;
}

export default function ComplaintGroupLine({group}: Props) {
    const nameDisplayMode = useSelector((state: ClientState) =>
        getSetting(state, "full-name.display") as NameDisplayMode
    );
    const {t} = useTranslation();

    const {icon: statusIcon, className: statusClass, unread} = getComplaintStatusDetails(group.status);
    const headingHtml = getComplaintHeadingHtml(group, nameDisplayMode, t);

    return (
        <Jump href={`/complaints/${group.id}`} className="complaint-group-line">
            <div className={cx("status", statusClass)} title={t("complaint-status." + group.status)}>
                {statusIcon && <Icon icon={statusIcon} size="1.2em"/>}
            </div>
            <div className={cx("heading", {"unread": unread})} dangerouslySetInnerHTML={{__html: headingHtml}}/>
        </Jump>
    );
}
