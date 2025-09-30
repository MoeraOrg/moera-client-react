import React from 'react';
import { useDispatch } from 'react-redux';
import { Trans } from 'react-i18next';

import { openSignUpDialog } from "state/signupdialog/actions";
import { useIsTinyScreen } from "ui/hook";
import "./InvitationAlert.css";

export default function InvitationAlert() {
    const tinyScreen = useIsTinyScreen();
    const dispatch = useDispatch();

    const onSignUp = () => dispatch(openSignUpDialog());

    return (
        <div id="invitation-alert">
            <span>
                <Trans i18nKey={tinyScreen ? "try-all-features" : "lets-try-all-features"}>
                    <span className="sign-up" onClick={onSignUp}/>
                </Trans>
            </span>
        </div>
    );
}
