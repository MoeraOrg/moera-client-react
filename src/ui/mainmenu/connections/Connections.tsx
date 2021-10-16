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

class Connections extends React.PureComponent<Props> {

    onAddClick = (hide: () => void) => () => {
        this.props.openConnectDialog();
        hide();
    };

    onSignUpClick = (hide: () => void) => () => {
        this.props.openSignUpDialog();
        hide();
    };

    onItemClick = (location: string, hide: () => void) => () => {
        Browser.switchData(location);
        hide();
    };

    onDisconnect = (location: string) => () => {
        Browser.deleteData(location);
    };

    render() {
        const {hide, location, owner, roots} = this.props;

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
                                        onClick={this.onItemClick(root.url, hide)}
                                        onDisconnect={this.onDisconnect(root.url)}/>
                ))}
                <div className="connection-add" onClick={this.onAddClick(hide)}>
                    <FontAwesomeIcon icon="plus"/> Add connection
                </div>
                <div className="connection-sign-up">
                    <Button variant="primary" size="sm" onClick={this.onSignUpClick(hide)}>Sign Up</Button>
                </div>
            </div>
        );
    }

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
