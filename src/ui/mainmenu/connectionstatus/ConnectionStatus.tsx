import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { isAtNode } from "state/node/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Button, Loading } from "ui/control";
import { useIsTinyScreen } from "ui/hook";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import NewsButton from "ui/mainmenu/connectionstatus/NewsButton";
import InstantButton from "ui/instant/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import ConnectionsButton from "ui/mainmenu/connections/ConnectionsButton";
import "./ConnectionStatus.css";

export default function ConnectionStatus() {
    const atNode = useSelector(isAtNode);
    const connecting = useSelector((state: ClientState) => state.home.connecting);
    const connected = useSelector(isConnectedToHome);
    const showNavigator = useSelector((state: ClientState) => state.node.owner.showNavigator);
    const dispatch = useDispatch();
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    if (showNavigator && tinyScreen) {
        return null;
    }
    if (connecting) {
        return <>{t("connecting")} <Loading/></>;
    }
    if (!connected) {
        if (!atNode) {
            return null;
        }
        return (
            <div className="connection-status">
                <span className="me-2">
                    {t("not-connected-home")}
                    <Button variant="primary" size="sm" onClick={() => dispatch(openSignUpDialog())}>
                        {t("sign-up")}
                    </Button>
                    <Button variant="success" size="sm" onClick={() => dispatch(openConnectDialog())}>
                        {t("connect")}
                    </Button>
                </span>
            </div>
        );
    }
    return (
        <div className="connection-status">
            <NewPostButton/>
            <NewsButton/>
            <InstantButton/>
            <SettingsButton/>
            <HomeButton/>
            <ConnectionsButton/>
        </div>
    );
}
