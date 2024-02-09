import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { isAtNode } from "state/node/selectors";
import { isAtRemovalPage } from "state/navigation/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import * as Browser from "ui/browser";
import { Button, Loading } from "ui/control";
import HomeButton from "ui/mainmenu/connectionstatus/HomeButton";
import QuickTipsButton from "ui/quicktips/QuickTipsButton";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import NewsButton from "ui/mainmenu/connectionstatus/NewsButton";
import InstantButton from "ui/instant/InstantButton";
import SettingsButton from "ui/mainmenu/connectionstatus/SettingsButton";
import ConnectionsButton from "ui/mainmenu/connections/ConnectionsButton";
import "./ConnectionStatus.css";

const ConnectDialog = React.lazy(() => import("ui/connectdialog/ConnectDialog"));

function ConnectionButtons() {
    const atNode = useSelector(isAtNode);
    const atRemovalPage = useSelector(isAtRemovalPage);
    const connecting = useSelector((state: ClientState) => state.home.connecting);
    const connected = useSelector(isConnectedToHome);
    const showNavigator = useSelector((state: ClientState) => state.node.owner.showNavigator);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (showNavigator && Browser.isTinyScreen()) {
        return null;
    }
    if (connecting) {
        return <>{t("connecting")} <Loading/></>;
    }
    if (!connected) {
        if (!atNode && !atRemovalPage) {
            return null;
        }
        return (
            <span className="d-none d-lg-inline me-lg-2">
                {t("not-connected-home")}
                <Button variant="primary" size="sm" onClick={() => dispatch(openSignUpDialog())}>
                    {t("sign-up")}
                </Button>
                <Button variant="success" size="sm" onClick={() => dispatch(openConnectDialog())}>
                    {t("connect")}
                </Button>
            </span>
        );
    }
    return (
        <span className="d-none d-lg-inline">
            <QuickTipsButton/>
            <NewPostButton/>
            <NewsButton/>
            <InstantButton/>
            <SettingsButton/>
            <HomeButton/>
            <ConnectionsButton/>
        </span>
    );
}

export default function ConnectionStatus() {
    const showConnectDialog = useSelector((state: ClientState) =>
        state.connectDialog.show && !state.messageBox.show && !state.home.connecting);

    return (
        <>
            <div className="connection-status">
                <ConnectionButtons/>
            </div>
            {showConnectDialog &&
                <Suspense fallback={null}>
                    <ConnectDialog/>
                </Suspense>
            }
        </>
    );
}
