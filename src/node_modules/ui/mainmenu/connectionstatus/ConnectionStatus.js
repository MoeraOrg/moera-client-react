import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, Loading } from "ui/control";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import ConnectionInfoButton from "ui/mainmenu/connectionstatus/ConnectionInfoButton";
import HomeName from "ui/mainmenu/connectionstatus/HomeName";
import ConnectDialog from "ui/mainmenu/connectionstatus/connectdialog/ConnectDialog";
import { openConnectDialog } from "state/connectdialog/actions";
import { disconnectFromHome } from "state/home/actions";
import { isConnectedToHome } from "state/home/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { Browser } from "api";
import "./ConnectionStatus.css";

const ConnectionStatus = ({connecting,  connected, location, login, openConnectDialog, confirmBox,
                           disconnectFromHome}) => (
    <>
        <div id="connection-status">{
            connecting ?
                <>Connecting <Loading /></>
            :
                (!connected ?
                    <>
                        Not connected to home
                        <Button variant="success" size="sm" onClick={openConnectDialog}>Connect</Button>
                    </>
                :
                    <>
                        <HomeButton />
                        <SettingsButton />
                        <ConnectionInfoButton />
                        <HomeName />
                        <span className="connection-button"
                              title="Disconnect"
                              onClick={() => {
                                  confirmBox(
                                      "Do you really want to disconnect from your home node?",
                                      "Disconnect",
                                      "Cancel",
                                      () => {
                                          Browser.storeHomeData(location, login, null, null, null);
                                          disconnectFromHome(location, login);
                                      },
                                      null,
                                      "danger"
                                  );
                              }}>
                            <FontAwesomeIcon icon="sign-out-alt"/>
                        </span>
                    </>
            )
        }</div>
        <ConnectDialog />
    </>
);

export default connect(
    state => ({
        connecting: state.home.connecting,
        connected: isConnectedToHome(state),
        location: state.home.root.location,
        login: state.home.login
    }),
    { openConnectDialog, confirmBox, disconnectFromHome }
)(ConnectionStatus);
