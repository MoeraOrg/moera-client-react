import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { isAtNode } from "state/node/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Button, LoadingInline } from "ui/control";
import { useIsTinyScreen } from "ui/hook";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import InstantButton from "ui/instant/InstantButton";
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
        return <div className="connection-status"><LoadingInline/></div>;
    }
    if (!connected) {
        if (!atNode) {
            return null;
        }
        return (
            <div className="connection-status not-connected">
                <Button variant="outline-primary" onClick={() => dispatch(openConnectDialog())}>
                    {t("connect")}
                </Button>
                <Button variant="primary" onClick={() => dispatch(openSignUpDialog())}>
                    {t("sign-up")}
                </Button>
            </div>
        );
    }
    return (
        <div className="connection-status connected">
            <NewPostButton/>
            <InstantButton/>
            <ConnectionsButton/>
        </div>
    );
}
