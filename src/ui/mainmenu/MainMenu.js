import React from 'react';
import { connect } from 'react-redux';

import { isAtNode } from "state/node/selectors";
import Logo from "ui/mainmenu/logo/Logo";
import OwnerSwitcher from "ui/mainmenu/owner/OwnerSwitcher";
import MainMenuPages from "ui/mainmenu/MainMenuPages";
import ConnectionStatus from "ui/mainmenu/connectionstatus/ConnectionStatus";
import VerticalMenuToggler from "ui/mainmenu/vertical/VerticalMenuToggler";
import "./MainMenu.css";

const MainMenu = ({atNode}) => (
    <nav id="main-menu" className="navbar sticky-top navbar-expand-md navbar-dark bg-dark">
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
);

export default connect(
    state => ({
        atNode: isAtNode(state)
    })
)(MainMenu);
