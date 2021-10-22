import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import MainMenuPages from "ui/mainmenu/MainMenuPages";
import DisconnectButton from "ui/mainmenu/connectionstatus/DisconnectButton";
import HomeName from "ui/mainmenu/connections/HomeName";
import "./VerticalMenu.css";

type Props = ConnectedProps<typeof connector>;

const VerticalMenu = ({atNode, connected}: Props) => (
    <div id="vertical-menu" className="navbar-dark bg-dark">
        {atNode && <MainMenuPages/>}
        {connected &&
            <>
                <HomeName/>
                <div className="text-end">
                    <DisconnectButton/>
                </div>
            </>
        }
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        atNode: isAtNode(state),
        connected: isConnectedToHome(state)
    })
);

export default connector(VerticalMenu);
