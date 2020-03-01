import React from 'react';
import { connect } from 'react-redux';

import { Button, Loading } from "ui/control";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import ConnectionInfoButton from "ui/mainmenu/connectionstatus/ConnectionInfoButton";
import HomeName from "ui/mainmenu/connectionstatus/HomeName";
import DisconnectButton from "ui/mainmenu/connectionstatus/DisconnectButton";
import ConnectDialog from "ui/mainmenu/connectionstatus/connectdialog/ConnectDialog";
import { openConnectDialog } from "state/connectdialog/actions";
import { isConnectedToHome } from "state/home/selectors";

import "./ConnectionStatus.css";

const ConnectionStatus = ({connecting,  connected, openConnectDialog}) => (
    <>
        <div id="connection-status">{
            connecting ?
                <>Connecting <Loading/></>
            :
                (!connected ?
                    <>
                        Not connected to home
                        <Button variant="success" size="sm" onClick={openConnectDialog}>Connect</Button>
                    </>
                :
                    <>
                        <HomeButton/>
                        <SettingsButton/>
                        <ConnectionInfoButton/>
                        <HomeName/>
                        <DisconnectButton/>
                    </>
            )
        }
        </div>
        <ConnectDialog />
    </>
);

export default connect(
    state => ({
        connecting: state.home.connecting,
        connected: isConnectedToHome(state)
    }),
    { openConnectDialog }
)(ConnectionStatus);
