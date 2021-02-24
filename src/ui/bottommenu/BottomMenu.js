import React from 'react';
import { connect } from 'react-redux';

import { Button, Loading } from "ui/control";
import QuickTipsButton from "ui/quicktips/QuickTipsButton";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import NewsButton from "ui/mainmenu/connectionstatus/NewsButton";
import InstantButton from "ui/instant/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import "./BottomMenu.css";

const BottomMenu = ({atNode, connecting,  connected, openConnectDialog, openSignUpDialog}) => {
    if (connecting) {
        return <>Connecting <Loading/></>;
    }
    if (!connected) {
        if (!atNode) {
            return null;
        }
        return (
            <div id="bottom-menu" className="connection-status d-lg-none navbar-dark bg-dark">
                Not connected to home
                <Button variant="primary" size="sm" onClick={() => openSignUpDialog()}>Sign Up</Button>
                <Button variant="success" size="sm" onClick={() => openConnectDialog()}>Connect</Button>
            </div>
        );
    }
    return (
        <div id="bottom-menu" className="connection-status d-lg-none navbar-dark bg-dark">
            <NewsButton/>
            <InstantButton/>
            <HomeButton/>
            <SettingsButton/>
            <QuickTipsButton/>
            <NewPostButton/>
        </div>
    );
};

export default connect(
    state => ({
        atNode: isAtNode(state),
        connecting: state.home.connecting,
        connected: isConnectedToHome(state)
    }),
    { openConnectDialog, openSignUpDialog }
)(BottomMenu);
