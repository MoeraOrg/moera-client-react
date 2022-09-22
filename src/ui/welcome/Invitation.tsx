import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import { Button } from "ui/control";
import "./Invitation.css";

type Props = ConnectedProps<typeof connector>;

const Invitation = ({connected, openConnectDialog, openSignUpDialog}: Props) => {
    const {t} = useTranslation();

    if (connected) {
        return null;
    }

    return (
        <div id="invitation">
            <h1>{t("do-you-have-blog")}</h1>
            <div className="buttons">
                <Trans i18nKey="invitation-buttons">
                    <Button variant="primary" size="lg" onClick={() => openSignUpDialog()}/>
                    <div className="or"/>
                    <Button variant="success" size="lg" onClick={() => openConnectDialog()}/>
                </Trans>
            </div>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        connected: state.home.connecting || isConnectedToHome(state)
    }),
    { openConnectDialog, openSignUpDialog }
);

export default connector(Invitation);
