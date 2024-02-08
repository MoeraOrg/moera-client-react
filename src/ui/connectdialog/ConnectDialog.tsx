import React from 'react';
import { useSelector } from 'react-redux';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerNameOrUrl } from "state/node/selectors";
import ConnectForm from "ui/connectdialog/ConnectForm";
import AssignForm from "ui/connectdialog/AssignForm";
import ForgotForm from "ui/connectdialog/ForgotForm";
import ResetForm from "ui/connectdialog/ResetForm";

export default function ConnectDialog() {
    const form = useSelector((state: ClientState) => state.connectDialog.form);
    const location = useSelector((state: ClientState) => state.connectDialog.location);
    const nodeRoot = NodeName.shorten(useSelector(getOwnerNameOrUrl));

    return (
        <>
            {form === "connect" && <ConnectForm location={location} nodeRoot={nodeRoot}/>}
            {form === "assign" && <AssignForm location={location} nodeRoot={nodeRoot}/>}
            {form === "forgot" && <ForgotForm location={location} nodeRoot={nodeRoot}/>}
            {form === "reset" && <ResetForm location={location} nodeRoot={nodeRoot}/>}
        </>
    );
}
