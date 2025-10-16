import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { openSignUpDialog } from "state/signupdialog/actions";
import * as Browser from "ui/browser";
import { Button } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./Invitation.css";

export default function Invitation() {
    const connected = useSelector((state: ClientState) => state.home.connecting || isConnectedToHome(state));
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (connected) {
        return null;
    }

    return (
        <div id="invitation">
            <h1>{t("do-you-have-blog")}</h1>
            <div className="buttons">
                <Trans i18nKey="invitation-buttons">
                    <Button variant="primary" size="lg" onClick={() => dispatch(openSignUpDialog())}/>
                    <div className="or"/>
                    <Jump className="btn btn-success btn-lg" href={Browser.urlWithBackHref("/connect")}/>
                </Trans>
            </div>
        </div>
    );
}
