import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getInstantCount } from "state/feeds/selectors";
import { Icon, msNotifications } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { REL_HOME } from "util/rel-node-name";
import "./InstantBell.css";

interface Props {
    onClick?: () => void;
}

export default function InstantBell({onClick}: Props) {
    const count = useSelector(getInstantCount);
    const {t} = useTranslation();

    return (
        <Jump nodeName={REL_HOME} href="/instants" className="btn btn-silent-round bell-button" title={t("instants")}
              onNear={onClick} onFar={onClick}>
            <Icon icon={msNotifications} size={24}/>{count > 0 && <div className="count">{count}</div>}
        </Jump>
    );
}
