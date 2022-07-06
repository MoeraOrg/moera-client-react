import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNode } from "state/node/selectors";
import Logo from "ui/mainmenu/logo/Logo";
import OwnerSwitcher from "ui/mainmenu/owner/OwnerSwitcher";
import MainMenuPages from "ui/mainmenu/MainMenuPages";
import ConnectionStatus from "ui/mainmenu/connectionstatus/ConnectionStatus";
import VerticalMenuToggler from "ui/mainmenu/vertical/VerticalMenuToggler";
import RefreshIndicator from "ui/mainmenu/RefreshIndicator";
import "./MainMenu.css";

type Props = ConnectedProps<typeof connector>;

const MainMenu = ({atNode}: Props) => (
    <>
        <nav id="main-menu" className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
            <Logo/>
            {atNode ?
                <>
                    <OwnerSwitcher/>
                    <div className="collapse navbar-collapse">
                        <MainMenuPages/>
                    </div>
                </>
            :
                <div className="collapse navbar-collapse"/>
            }
            <ConnectionStatus/>
            <VerticalMenuToggler/>
        </nav>
        <RefreshIndicator/>
    </>
);

const connector = connect(
    (state: ClientState) => ({
        atNode: isAtNode(state)
    })
);

export default connector(MainMenu);
