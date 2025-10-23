import React from 'react';
import { Trans } from 'react-i18next';

import { useIsTinyScreen } from "ui/hook";
import * as Browser from "ui/browser";
import Jump from "ui/navigation/Jump";
import "./InvitationAlert.css";

export default function InvitationAlert() {
    const tinyScreen = useIsTinyScreen();

    return (
        <div id="invitation-alert">
            <span>
                <Trans i18nKey={tinyScreen ? "try-all-features" : "lets-try-all-features"}>
                    <Jump className="sign-up" href={Browser.urlWithBackHref("/signup")}/>
                </Trans>
            </span>
        </div>
    );
}
