import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import * as Browser from "ui/browser";
import NodeName from "ui/nodename/NodeName";

interface Props {
    name?: string | null;
    url: string;
    onClick: () => void;
    onDisconnect: () => void;
}

export default function ConnectionItem({name, url, onClick, onDisconnect}: Props) {
    const {t} = useTranslation();

    return (
        <div className="connection-item">
            <div className="connection" onClick={onClick}>
                {name ?
                    <NodeName name={name} linked={false} popup={false}/>
                :
                    <span className="no-name">{t("no-name-known")}</span>
                }<br/>
                {url}
            </div>
            <div className="connection-buttons">
                <a className="link" title={t("open")} href={Browser.passedLocation(url)}>
                    <FontAwesomeIcon icon={faExternalLinkAlt}/>
                </a>
                <div className="disconnect" title={t("disconnect")} onClick={onDisconnect}>
                    <FontAwesomeIcon icon={faSignOutAlt}/>
                </div>
            </div>
        </div>
    );
}
