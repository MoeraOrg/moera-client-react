import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { getInstantCount } from "state/feeds/selectors";
import "./InstantBell.css";

export default function InstantBell() {
    const count = useSelector(getInstantCount);
    const {t} = useTranslation();

    return (
        <span className="connection-button bell-button" title={t("instants")}>
            <FontAwesomeIcon icon="bell"/>{count > 0 && <div className="count">{count}</div>}
        </span>
    );
}
