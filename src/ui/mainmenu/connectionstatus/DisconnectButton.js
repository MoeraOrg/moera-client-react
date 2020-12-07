import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { confirmBox } from "state/confirmbox/actions";
import { disconnectFromHome } from "state/home/actions";
import { Browser } from "ui/browser";

class DisconnectButton extends React.PureComponent {

    onClick = () => {
        const {confirmBox} = this.props;

        confirmBox(
            "Do you really want to disconnect from your home node?",
            "Disconnect",
            "Cancel",
            this.onConfirmed,
            null,
            "danger"
        );
    };

    onConfirmed = () => {
        const {location, login, disconnectFromHome} = this.props;

        Browser.deleteData(location);
        disconnectFromHome(location, login);
    };

    render() {
        return (
            <span className="connection-button" title="Disconnect" onClick={this.onClick}>
                <FontAwesomeIcon icon="sign-out-alt"/>
            </span>
        );
    }

}

export default connect(
    state => ({
        location: state.home.root.location,
        login: state.home.login
    }),
    { confirmBox, disconnectFromHome }
)(DisconnectButton);
