import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import NodeName from "ui/nodename/NodeName";
import "./OwnerName.css";

export default function OwnerName() {
    const {name, changing, ...props} = useSelector((state: ClientState) => state.node.owner);
    const atHome = useSelector(isAtHomeNode);
    const {t} = useTranslation();

    return (
        <>
            {atHome &&
                <span className="home navbar-text" title={t("you-at-home")}><FontAwesomeIcon icon={faHome}/></span>
            }
            {name ?
                <span id="owner-name"><NodeName name={name} linked={false} popup={false} {...props}/></span>
            :
                <span id="owner-name" className="navbar-text">{changing ? "\u22ef" : t("no-name-set")}</span>
            }
        </>
    );
}
