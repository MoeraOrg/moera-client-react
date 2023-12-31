import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { getInstantCount } from "state/feeds/selectors";
import "./InstantBell.css";

export default function InstantBell() {
    const count = useSelector(getInstantCount);
    const {t} = useTranslation();

    return (
        <span className="connection-button bell-button" title={t("instants")}>
            <FontAwesomeIcon icon={faBell}/>{count > 0 && <div className="count">{count}</div>}
        </span>
    );
}
