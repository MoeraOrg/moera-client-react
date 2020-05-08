import React from 'react';
import { connect } from 'react-redux';

import MainMenuTimelineLink from "ui/mainmenu/MainMenuTimelineLink";
import MainMenuLink from "ui/mainmenu/MainMenuLink";
import { PAGE_PROFILE } from "state/navigation/pages";
import { isConnectedToHome } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { Button } from "ui/control";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import InstantButton from "ui/mainmenu/connectionstatus/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import ConnectionsButton from "ui/mainmenu/connections/ConnectionsButton";
import DisconnectButton from "ui/mainmenu/connectionstatus/DisconnectButton";
import "./VerticalMenu.css";

const VerticalMenu = ({connected}) => (
    <div id="vertical-menu" className="navbar-dark bg-dark">
        <ul className="navbar-nav">
            <MainMenuTimelineLink/>
            <MainMenuLink page={PAGE_PROFILE} href="/profile">PROFILE</MainMenuLink>
        </ul>
        {!connected ?
            <>
                <Button variant="success" size="sm" onClick={() => openConnectDialog()}>Connect</Button>
            </>
        :
            <>
                <NewPostButton/>
                <br/>
                <InstantButton/>
                <SettingsButton/>
                <HomeButton/>
                <br/>
                <ConnectionsButton/>
                <DisconnectButton/>
            </>
        }
    </div>
);

export default connect(
    state => ({
        connected: isConnectedToHome(state)
    }),
    { openConnectDialog }
)(VerticalMenu);
