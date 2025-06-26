import React from 'react';
import { useSelector } from "react-redux";
import { format, formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { tDistanceToNow } from "i18n/time";
import { isAtHomeNode } from "state/node/selectors";
import { ExtComplaintInfo } from "state/complaints/state";
import NodeName from "ui/nodename/NodeName";
import "./Complaint.css";

interface Props {
    complaint: ExtComplaintInfo;
}

export default function Complaint({complaint}: Props) {
    const atHomeNode = useSelector(isAtHomeNode);
    const {t} = useTranslation();

    const date = fromUnixTime(complaint.createdAt);

    return (
        <div className="user-complaint">
            <span className="owner">
                <NodeName name={complaint.ownerName} fullName={complaint.ownerFullName}/>
            </span>
            <span className="date">
                <time dateTime={formatISO(date)} title={tDistanceToNow(date, t)}>
                    {format(date, "dd-MM-yyyy HH:mm")}
                </time>
            </span>
            <p>
                <strong>{t("reason")}: </strong>
                {t(`sheriff-order-reason.${complaint?.reasonCode ?? "other"}`)}
            </p>
            {complaint.reasonDetailsHtml &&
                <p dangerouslySetInnerHTML={{__html: complaint.reasonDetailsHtml}}/>
            }
            {(complaint.anonymousRequested && atHomeNode) &&
                <p className="anonymous-requested">
                    {t("user-asks-not-publish-complaint")}
                </p>
            }
        </div>
    );
}
