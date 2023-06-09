import React from 'react';
import { connect, ConnectedProps } from "react-redux";
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { getDateFnsLocale } from "i18n";
import { ClientState } from 'state/state';
import { isAtHomeNode } from "state/node/selectors";
import { ExtComplainInfo } from "state/complains/state";
import NodeName from "ui/nodename/NodeName";
import "./Complain.css";

type Props = {
    complain: ExtComplainInfo;
} & ConnectedProps<typeof connector>

function Complain({complain, atHomeNode}: Props) {
    const {t} = useTranslation();

    const date = fromUnixTime(complain.createdAt);

    return (
        <div className="user-complain">
            <span className="owner">
                <NodeName name={complain.ownerName} fullName={complain.ownerFullName}/>
            </span>
            <span className="date">
                <time dateTime={formatISO(date)} title={formatDistanceToNow(date, {locale: getDateFnsLocale()})}>
                    {format(date, "dd-MM-yyyy HH:mm")}
                </time>
            </span>
            <p>
                <strong>{t("reason")}: </strong>
                {t(`sheriff-order-reason.${complain?.reasonCode ?? "other"}`)}
            </p>
            {complain.reasonDetailsHtml &&
                <p dangerouslySetInnerHTML={{__html: complain.reasonDetailsHtml}}/>
            }
            {(complain.anonymousRequested && atHomeNode) &&
                <p className="anonymous-requested">
                    {t("user-asks-not-publish-complain")}
                </p>
            }
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        atHomeNode: isAtHomeNode(state)
    })
);

export default connector(Complain);
