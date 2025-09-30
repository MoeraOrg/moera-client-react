import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isBottomMenuVisible } from "state/navigation/selectors";
import { Loading } from "ui/control";
import { useIsTinyScreen, useVirtualKeyboard } from "ui/hook";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import NewsButton from "ui/mainmenu/connectionstatus/NewsButton";
import InstantButton from "ui/instant/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import InvitationAlert from "ui/mainmenu/InvitationAlert";
import "./BottomMenu.css";

export default function BottomMenu() {
    const atNode = useSelector(isAtNode);
    const connecting = useSelector((state: ClientState) => state.home.connecting);
    const connected = useSelector(isConnectedToHome);
    const bottomMenuVisible = useSelector(isBottomMenuVisible);
    const {open: keyboardOpen} = useVirtualKeyboard();
    const {t} = useTranslation();

    const tinyScreen = useIsTinyScreen();

    if (!tinyScreen) {
        return null;
    }

    const invisible = !bottomMenuVisible || keyboardOpen;

    const className = cx(["connection-status", "navbar-dark", "bg-dark"], {invisible});

    if (connecting) {
        return (
            <div id="bottom-menu" className={className}>
                {t("connecting")} <Loading/>
            </div>
        );
    }

    if (!connected) {
        if (!atNode) {
            return null;
        }

        return <InvitationAlert/>;
    }

    return (
        <div id="bottom-menu" className={className}>
            <NewPostButton/>
            <SettingsButton/>
            <HomeButton/>
            <InstantButton/>
            <NewsButton/>
        </div>
    );
}
