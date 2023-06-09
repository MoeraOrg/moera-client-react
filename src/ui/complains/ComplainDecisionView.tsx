import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { complainsDecisionPost } from "state/complains/actions";
import { getActiveComplainGroup } from "state/complains/selectors";
import "./ComplainDecisionView.css";

type Props = ConnectedProps<typeof connector>;

function ComplainDecisionView({group}: Props) {
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

const connector = connect(
    (state: ClientState) => ({
        group: getActiveComplainGroup(state)
    }),
    { complainsDecisionPost }
);

export default connector(ComplainDecisionView);
