import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SubscriberInfo } from "api";
import { isNodeAdmin } from "state/node/selectors";
import { Principal } from "ui/control";

interface Props {
    subscriber: SubscriberInfo;
}

export default function SubscriberVisibility({subscriber}: Props) {
    const isAdmin = useSelector(isNodeAdmin);
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
