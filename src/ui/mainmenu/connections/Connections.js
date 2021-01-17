import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Browser } from "ui/browser";
import { Button, NodeName } from "ui/control";
import ConnectionItem from "ui/mainmenu/connections/ConnectionItem";
import "./Connections.css";
import { getHomeRootLocation } from "state/home/selectors";

class Connections extends React.PureComponent {

    static propTypes = {
        hide: PropType.func.isRequired
    };

    onAddClick = hide => () => {
        this.props.openConnectDialog();
        hide();
    };

    onSignUpClick = hide => () => {
        this.props.openSignUpDialog();
        hide();
    };

    onItemClick = (location, hide) => () => {
        Browser.switchData(location);
        hide();
    };

    onDisconnect = location => () => {
        Browser.deleteData(location);
    };

    render() {
        const {hide, location, owner, roots} = this.props;

        return (
            <div id="connections">
                {roots.map(root => (
                    root.url === location ?
                        <div className="connection active" key={root.url}>
                            <NodeName {...owner} linked={false}/><br/>
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

export default connect(
    state => ({
        location: getHomeRootLocation(state),
        owner: state.home.owner,
        roots: state.home.roots
    }),
    { openConnectDialog, openSignUpDialog }
)(Connections);
