import React from 'react';
import { useSelector } from 'react-redux';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerNameOrUrl } from "state/node/selectors";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import ConnectForm from "ui/connectdialog/ConnectForm";
import ForgotForm from "ui/connectdialog/ForgotForm";
import "./ConnectPage.css"

export default function ConnectPage() {
    const form = useSelector((state: ClientState) => state.connectDialog.form);
    const location = useSelector((state: ClientState) => state.connectDialog.location);
    const backHref = useSelector((state: ClientState) => state.connectDialog.backHref);
    const nodeRoot = NodeName.shorten(useSelector(getOwnerNameOrUrl));

    return (
        <>
            <GlobalTitle back={backHref}/>
            <div className="connect-page">
                {form === "connect" && <ConnectForm location={location} nodeRoot={nodeRoot}/>}
                {form === "forgot" && <ForgotForm location={location} nodeRoot={nodeRoot}/>}
            </div>
        </>
    );
}
