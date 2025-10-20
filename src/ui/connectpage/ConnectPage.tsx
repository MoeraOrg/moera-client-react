import React from 'react';
import { useSelector } from 'react-redux';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerNameOrUrl } from "state/node/selectors";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import ConnectForm from "ui/connectpage/ConnectForm";
import ForgotForm from "ui/connectpage/ForgotForm";
import VerifyForm from "ui/connectpage/VerifyForm";
import ResetForm from "ui/connectpage/ResetForm";
import "./ConnectPage.css"

export default function ConnectPage() {
    const form = useSelector((state: ClientState) => state.connectPage.form);
    const location = useSelector((state: ClientState) => state.connectPage.location);
    const backHref = useSelector((state: ClientState) => state.connectPage.backHref);
    const resetToken = useSelector((state: ClientState) => state.connectPage.resetToken);
    const nodeRoot = NodeName.shorten(useSelector(getOwnerNameOrUrl));

    return (
        <>
            <GlobalTitle back={backHref}/>
            <div className="connect-page">
                {form === "connect" && <ConnectForm location={location} nodeRoot={nodeRoot}/>}
                {form === "forgot" && <ForgotForm location={location} nodeRoot={nodeRoot}/>}
                {form === "verify" && <VerifyForm location={location} nodeRoot={nodeRoot}/>}
                {form === "reset" && <ResetForm location={location} nodeRoot={nodeRoot} resetToken={resetToken ?? ""}/>}
            </div>
        </>
    );
}
