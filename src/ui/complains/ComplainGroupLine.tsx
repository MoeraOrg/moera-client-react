import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { ExtComplainGroupInfo } from "state/complains/state";
import { getComplainHeadingHtml, getComplainStatusDetails } from "ui/complains/complain-details";
import { NameDisplayMode } from "ui/types";
import Jump from "ui/navigation/Jump";
import "./ComplainGroupLine.css";

type Props = {
    group: ExtComplainGroupInfo;
} & ConnectedProps<typeof connector>;

function ComplainGroupLine({group, nameDisplayMode}: Props) {
    const {t} = useTranslation();

    const {icon: statusIcon, className: statusClass, unread} = getComplainStatusDetails(group.status);
    const headingHtml = getComplainHeadingHtml(group, nameDisplayMode, t);

    return (
        <Jump href={`/complains/${group.id}`} className="complain-group-line">
            <div className={cx("status", statusClass)} title={t("complain-status." + group.status)}>
                {statusIcon &&
                    <FontAwesomeIcon icon={statusIcon}/>
                }
            </div>
            <div className={cx("heading", {"unread": unread})} dangerouslySetInnerHTML={{__html: headingHtml}}/>
        </Jump>
    );
}

const connector = connect(
    (state: ClientState) => ({
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    })
);

export default connector(ComplainGroupLine);
