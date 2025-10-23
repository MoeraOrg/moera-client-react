import React from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import * as Browser from "ui/browser";
import Jump from "ui/navigation/Jump";
import "./Invitation.css";

export default function Invitation() {
    const connected = useSelector((state: ClientState) => state.home.connecting || isConnectedToHome(state));
    const {t} = useTranslation();

    if (connected) {
        return null;
    }

    return (
        <div id="invitation">
            <h1>{t("do-you-have-blog")}</h1>
            <div className="buttons">
                <Trans i18nKey="invitation-buttons">
                    <Jump className="btn btn-primary btn-lg" href={Browser.urlWithBackHref("/signup")}/>
                    <div className="or"/>
                    <Jump className="btn btn-success btn-lg" href={Browser.urlWithBackHref("/connect")}/>
                </Trans>
            </div>
        </div>
    );
}
