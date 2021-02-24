import React from 'react';
import { connect } from 'react-redux';

import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import MainMenuPages from "ui/mainmenu/MainMenuPages";
import DisconnectButton from "ui/mainmenu/connectionstatus/DisconnectButton";
import HomeName from "ui/mainmenu/connections/HomeName";
import "./VerticalMenu.css";

const VerticalMenu = ({atNode, connected}) => (
    <div id="vertical-menu" className="navbar-dark bg-dark">
        {atNode && <MainMenuPages/>}
        {connected &&
            <>
                <HomeName/>
                <div className="text-right">
                    <DisconnectButton/>
                </div>
            </>
        }
    </div>
);

export default connect(
    state => ({
        atNode: isAtNode(state),
        connected: isConnectedToHome(state)
    })
)(VerticalMenu);
