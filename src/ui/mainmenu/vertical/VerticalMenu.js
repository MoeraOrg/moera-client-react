import React from 'react';
import { connect } from 'react-redux';

import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { Button } from "ui/control";
import MainMenuPages from "ui/mainmenu/MainMenuPages";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import DisconnectButton from "ui/mainmenu/connectionstatus/DisconnectButton";
import HomeName from "ui/mainmenu/connections/HomeName";
import "./VerticalMenu.css";

const VerticalMenu = ({atNode, connected}) => (
    <div id="vertical-menu" className="navbar-dark bg-dark">
        {atNode && <MainMenuPages/>}
        {!connected ?
            <>
                <Button variant="success" size="sm"  className="connect-button"
                        onClick={() => openConnectDialog()}>Connect</Button>
            </>
        :
            <>
                <NewPostButton/>
                <br/>
                <SettingsButton/>
                <HomeButton/>
                <DisconnectButton/>
                <br/>
                <HomeName/>
            </>
        }
    </div>
);

export default connect(
    state => ({
        atNode: isAtNode(state),
        connected: isConnectedToHome(state)
    }),
    { openConnectDialog }
)(VerticalMenu);
