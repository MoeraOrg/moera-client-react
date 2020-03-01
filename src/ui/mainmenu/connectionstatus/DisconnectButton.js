import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Browser } from "api";
import { confirmBox } from "state/confirmbox/actions";
import { disconnectFromHome } from "state/home/actions";
import { getAddonApiVersion } from "state/home/selectors";

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
        const {addonApiVersion, location, login, disconnectFromHome} = this.props;

        if (addonApiVersion >= 2) {
            Browser.storeConnectionData(location, login, null, null);
            Browser.storeCartesData(null, null);
        } else {
            Browser.storeHomeData(location, login, null, null,
                null, null);
        }
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
        addonApiVersion: getAddonApiVersion(state),
        location: state.home.root.location,
        login: state.home.login
    }),
    { confirmBox, disconnectFromHome }
)(DisconnectButton);
