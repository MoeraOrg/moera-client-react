import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { Button, Loading } from "ui/control";
import QuickTipsButton from "ui/quicktips/QuickTipsButton";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import NewsButton from "ui/mainmenu/connectionstatus/NewsButton";
import InstantButton from "ui/instant/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isBottomMenuVisible } from "state/navigation/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import "./BottomMenu.css";

const BottomMenu = ({atNode, connecting,  connected, visible, openConnectDialog, openSignUpDialog}) => {
    if (connecting) {
        return <>Connecting <Loading/></>;
    }

    const className = cx(["connection-status", "d-lg-none", "navbar-dark", "bg-dark"], {"invisible": !visible});
    if (!connected) {
        if (!atNode) {
            return null;
        }
        return (
            <div id="bottom-menu" className={className}>
                Not connected to home
                <Button variant="primary" size="sm" onClick={() => openSignUpDialog()}>Sign Up</Button>
                <Button variant="success" size="sm" onClick={() => openConnectDialog()}>Connect</Button>
            </div>
        );
    }
    return (
        <div id="bottom-menu" className={className}>
            <NewPostButton/>
            <QuickTipsButton/>
            <SettingsButton/>
            <HomeButton/>
            <InstantButton/>
            <NewsButton/>
        </div>
    );
};

export default connect(
    state => ({
        atNode: isAtNode(state),
        connecting: state.home.connecting,
        connected: isConnectedToHome(state),
        visible: isBottomMenuVisible(state)
    }),
    { openConnectDialog, openSignUpDialog }
)(BottomMenu);
