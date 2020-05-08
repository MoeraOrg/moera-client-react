import React from 'react';
import { connect } from 'react-redux';

import { Button, Loading } from "ui/control";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import InstantButton from "ui/mainmenu/connectionstatus/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import ConnectionsButton from "ui/mainmenu/connections/ConnectionsButton";
import DisconnectButton from "ui/mainmenu/connectionstatus/DisconnectButton";
import ConnectDialog from "ui/connectdialog/ConnectDialog";
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
                        <Button variant="success" size="sm" onClick={() => openConnectDialog()}>Connect</Button>
                    </>
                :
                    <>
                        <NewPostButton/>
                        <InstantButton/>
                        <SettingsButton/>
                        <HomeButton/>
                        <ConnectionsButton/>
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
