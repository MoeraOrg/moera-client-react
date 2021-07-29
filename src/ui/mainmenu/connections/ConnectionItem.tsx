import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import NodeName from "ui/nodename/NodeName";
import { ClientState } from "state/state";

type Props = {
    name?: string | null;
    url: string;
    onClick: () => void;
    onDisconnect: () => void;
} & ConnectedProps<typeof connector>;

const ConnectionItem = ({name, url, onClick, onDisconnect, standalone}: Props) => (
    <div className="connection-item">
        <div className="connection" onClick={onClick}>
            {name ?
                <NodeName name={name} linked={false} popup={false}/>
            :
                <span className="no-name">no name known</span>
            }<br/>
            {url}
        </div>
        <div className="connection-buttons">
            <a className="link" title="Open" href={!standalone ? url : Browser.passedLocation(url)}>
                <FontAwesomeIcon icon="external-link-alt"/>
            </a>
            <div className="disconnect" title="Disconnect" onClick={onDisconnect}>
                <FontAwesomeIcon icon="sign-out-alt"/>
            </div>
        </div>
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state)
    })
);

export default connector(ConnectionItem);
