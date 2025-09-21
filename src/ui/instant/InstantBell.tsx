import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getInstantCount } from "state/feeds/selectors";
import { Icon, msNotifications } from "ui/material-symbols";
import "./InstantBell.css";

interface Props {
    onClick?: () => void;
}

export default function InstantBell({onClick}: Props) {
    const count = useSelector(getInstantCount);
    const {t} = useTranslation();

    return (
        <button className="btn btn-silent-round bell-button" title={t("instants")} onClick={onClick}>
            <Icon icon={msNotifications} size={24}/>{count > 0 && <div className="count">{count}</div>}
        </button>
    );
}
