import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Browser } from "api";
import { Button, Loading } from "ui/control";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import NewsButton from "ui/mainmenu/connectionstatus/NewsButton";
import InstantButton from "ui/instant/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import ConnectionsButton from "ui/mainmenu/connections/ConnectionsButton";
import DisconnectButton from "ui/mainmenu/connectionstatus/DisconnectButton";
import ConnectDialog from "ui/connectdialog/ConnectDialog";
import { openConnectDialog } from "state/connectdialog/actions";
import { openQuickTips } from "state/quicktips/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isAtNode } from "state/node/selectors";
import "./ConnectionStatus.css";

const ConnectionButtons = ({
    atNode, connecting,  connected, showNavigator, openConnectDialog, openQuickTips, openSignUpDialog
}) => {
    if (showNavigator && Browser.isTinyScreen()) {
        return null;
    }
    if (connecting) {
        return <>Connecting <Loading/></>;
    }
    if (!connected) {
        if (!atNode) {
            return null;
        }
        return (
            <span className="d-none d-lg-inline">
                Not connected to home
                <Button variant="primary" size="sm" onClick={() => openSignUpDialog()}>Sign Up</Button>
                <Button variant="success" size="sm" onClick={() => openConnectDialog()}>Connect</Button>
            </span>
        );
    }
    return (
        <>
            <span className="connection-button d-none d-lg-inline" title="Help" onClick={() => openQuickTips()}>
                <FontAwesomeIcon icon="question-circle"/>
            </span>
            <span className="d-none d-lg-inline">
                <NewPostButton/>
            </span>
            <NewsButton/>
            <InstantButton/>
            <span className="d-none d-lg-inline">
                <SettingsButton/>
                <HomeButton/>
                <ConnectionsButton/>
                <DisconnectButton/>
            </span>
        </>
    );
}

const ConnectionStatus = (props) => (
    <>
        <div id="connection-status">
            <ConnectionButtons {...props}/>
        </div>
        <ConnectDialog/>
    </>
);

export default connect(
    state => ({
        atNode: isAtNode(state),
        connecting: state.home.connecting,
        connected: isConnectedToHome(state),
        showNavigator: state.owner.showNavigator
    }),
    { openConnectDialog, openQuickTips, openSignUpDialog }
)(ConnectionStatus);
