import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getActiveComplaintGroup } from "state/complaints/selectors";
import "./ComplaintDecisionView.css";

export default function ComplaintDecisionView() {
    const group = useSelector(getActiveComplaintGroup);
    const {t} = useTranslation();

    return (
        <div className="complaint-decision-view">
            <h4>{t("decision")}</h4>
            {group?.status === "approved" && group.decisionCode != null &&
                <div className="info">{t(`sheriff-order-reason.${group.decisionCode}`)}</div>
            }
            {group?.decisionDetailsHtml &&
                <div className="info" dangerouslySetInnerHTML={{__html: group.decisionDetailsHtml}}/>
            }
        </div>
    );
}
