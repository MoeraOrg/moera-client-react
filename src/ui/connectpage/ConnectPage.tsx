import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import GlobalBottom from "ui/mainmenu/GlobalBottom";
import ConnectForm from "ui/connectpage/ConnectForm";
import ForgotForm from "ui/connectpage/ForgotForm";
import VerifyForm from "ui/connectpage/VerifyForm";
import ResetForm from "ui/connectpage/ResetForm";
import ChangePasswordForm from "ui/connectpage/ChangePasswordForm";
import "./ConnectPage.css"

export default function ConnectPage() {
    const form = useSelector((state: ClientState) => state.connectPage.form);
    const location = useSelector((state: ClientState) => state.connectPage.location);
    const backHref = useSelector((state: ClientState) => state.connectPage.backHref);
    const resetToken = useSelector((state: ClientState) => state.connectPage.resetToken);

    return (
        <>
            <GlobalTitle back={backHref}/>
            <main className="connect-page global-page">
                {form === "connect" && <ConnectForm location={location}/>}
                {form === "forgot" && <ForgotForm location={location}/>}
                {form === "verify" && <VerifyForm location={location}/>}
                {form === "reset" && <ResetForm location={location} resetToken={resetToken ?? ""}/>}
                {form === "change" && <ChangePasswordForm/>}
            </main>
            <GlobalBottom/>
        </>
    );
}
