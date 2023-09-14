import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SubscriberInfo } from "api";
import { ClientState } from "state/state";
import { isNodeAdmin } from "state/node/selectors";
import { Principal } from "ui/control";

type Props = {
    subscriber: SubscriberInfo;
} & ConnectedProps<typeof connector>;

function SubscriberVisibility({subscriber, isAdmin}: Props) {
    const {t} = useTranslation();

    const view = subscriber.operations?.view ?? "public";
    const seniorView = subscriber.adminOperations?.view ?? "unset";

    if (seniorView !== "unset" && (isAdmin || seniorView !== "public")) {
        return <Principal value={view} className="senior" comment={t("set-by-admin")}/>;
    }

    if (view === "public") {
        return null;
    }

    return <Principal value={view}/>;
}

const connector = connect(
    (state: ClientState) => ({
        isAdmin: isNodeAdmin(state)
    })
);

export default connector(SubscriberVisibility);
