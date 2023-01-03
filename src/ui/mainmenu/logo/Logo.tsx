import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { useMainMenuHomeNews, useMainMenuTimeline } from "ui/mainmenu/main-menu";
import Jump from "ui/navigation/Jump";
import "./Logo.css";

type Props = ConnectedProps<typeof connector>;

function Logo({connectedToHome}: Props) {
    const {href: timelineHref} = useMainMenuTimeline();
    const {href: newsHref} = useMainMenuHomeNews();

    const nodeName = connectedToHome ? ":" : "";
    const href = connectedToHome ? newsHref : timelineHref;

    return (
        <div id="logo" className="navbar-brand">
            <Jump nodeName={nodeName} href={href}>
                <img id="logo-image" src="pics/logo-o-32.png" alt="Moera"/>
            </Jump>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        connectedToHome: isConnectedToHome(state)
    })
);

export default connector(Logo);
