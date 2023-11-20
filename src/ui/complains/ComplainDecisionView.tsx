import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getActiveComplainGroup } from "state/complains/selectors";
import "./ComplainDecisionView.css";

export default function ComplainDecisionView() {
    const group = useSelector(getActiveComplainGroup);
    const {t} = useTranslation();

    return (
        <div className="complain-decision-view">
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
