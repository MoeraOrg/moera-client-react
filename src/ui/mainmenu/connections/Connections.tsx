import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { getHomeRootLocation } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Browser } from "ui/browser";
import { Button } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import ConnectionItem from "ui/mainmenu/connections/ConnectionItem";
import "./Connections.css";

type Props = {
    hide: () => void;
} & ConnectedProps<typeof connector>;

function Connections({hide, location, owner, roots, openConnectDialog, openSignUpDialog}: Props) {
    const onAddClick = () => {
        openConnectDialog();
        hide();
    };

    const onSignUpClick = () => {
        openSignUpDialog();
        hide();
    };

    const onItemClick = (location: string) => () => {
        Browser.switchData(location);
        hide();
    };

    const onDisconnect = (location: string) => () => {
        Browser.deleteData(location);
    };

    return (
        <div id="connections">
            {roots.map(root => (
                root.url === location ?
                    <div className="connection active" key={root.url}>
                        <NodeName name={owner.name} verified={owner.verified} correct={owner.correct}
                                  linked={false} popup={false}/><br/>
                        {location}<br/>
                        <span className="connected">Connected</span>
                    </div>
                :
                    <ConnectionItem key={root.url} name={root.name} url={root.url}
                                    onClick={onItemClick(root.url)}
                                    onDisconnect={onDisconnect(root.url)}/>
            ))}
            <div className="connection-add" onClick={onAddClick}>
                <FontAwesomeIcon icon="plus"/> Add connection
            </div>
            <div className="connection-sign-up">
                <Button variant="primary" size="sm" onClick={onSignUpClick}>Sign Up</Button>
            </div>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        location: getHomeRootLocation(state),
        owner: state.home.owner,
        roots: state.home.roots
    }),
    { openConnectDialog, openSignUpDialog }
);

export default connector(Connections);
