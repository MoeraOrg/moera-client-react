import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NodeName } from "ui/control";

const ConnectionItem = ({name, url, onClick, onDisconnect}) => (
    <div className="connection-item">
        <div className="connection" onClick={onClick}>
            {name ?
                <NodeName name={name} linked={false}/>
            :
                <span className="no-name">no name known</span>
            }<br/>
            {url}
        </div>
        <div className="connection-buttons">
            <a className="link" title="Open" href={url}>
                <FontAwesomeIcon icon="external-link-alt"/>
            </a>
            <div className="disconnect" title="Disconnect" onClick={onDisconnect}>
                <FontAwesomeIcon icon="sign-out-alt"/>
            </div>
        </div>
    </div>
);

export default ConnectionItem;
