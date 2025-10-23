import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import * as Browser from "ui/browser";
import { LoadingInline } from "ui/control";
import Jump from "ui/navigation/Jump";
import NewPostButton from "ui/mainmenu/connectionstatus/NewPostButton";
import ConnectionsButton from "ui/mainmenu/connections/ConnectionsButton";
import InstantButton from "ui/instant/InstantButton";
import "./ConnectionStatus.css";

export default function ConnectionStatus() {
    const connecting = useSelector((state: ClientState) => state.home.connecting);
    const connected = useSelector(isConnectedToHome);
    const {t} = useTranslation();

    if (connecting) {
        return <div className="connection-status"><LoadingInline/></div>;
    }
    if (!connected) {
        return (
            <div className="connection-status not-connected">
                <Jump className="btn btn-outline-primary" href={Browser.urlWithBackHref("/connect")}>
                    {t("connect")}
                </Jump>
                <Jump className="btn btn-primary" href={Browser.urlWithBackHref("/signup")}>
                    {t("sign-up")}
                </Jump>
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
