import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import NodeName from "ui/nodename/NodeName";

type Props = {
    name?: string | null;
    url: string;
    onClick: () => void;
    onDisconnect: () => void;
} & ConnectedProps<typeof connector>;

const ConnectionItem = ({name, url, onClick, onDisconnect, standalone}: Props) => {
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
                <a className="link" title={t("open")} href={!standalone ? url : Browser.passedLocation(url)}>
                    <FontAwesomeIcon icon="external-link-alt"/>
                </a>
                <div className="disconnect" title={t("disconnect")} onClick={onDisconnect}>
                    <FontAwesomeIcon icon="sign-out-alt"/>
                </div>
            </div>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state)
    })
);

export default connector(ConnectionItem);
