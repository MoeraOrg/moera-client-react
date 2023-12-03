import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Button } from "ui/control";
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
                    <Button variant="success" size="lg" onClick={() => dispatch(openConnectDialog())}/>
                </Trans>
            </div>
        </div>
    );
}
