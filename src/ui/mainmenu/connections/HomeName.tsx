import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import "./HomeName.css";

export default function HomeName() {
    const ownerName = useSelector((state: ClientState) => state.home.owner.name);
    const changing = useSelector((state: ClientState) => state.home.owner.changing);
    const {t} = useTranslation();

    const {name, generation} = NodeName.parse(ownerName);
    return (
        <span className="home-name">
            {name ?
                <span className="navbar-text name">
                    {name}{generation ? <span className="generation">{generation}</span> : ""}
                </span>
            :
                <span className="navbar-text name anonymous">{changing ? "\u22ef" : t("no-name-set")}</span>
            }
        </span>
    );
}
