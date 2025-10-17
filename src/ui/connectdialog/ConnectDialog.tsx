import React from 'react';
import { useSelector } from 'react-redux';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerNameOrUrl } from "state/node/selectors";
import ResetForm from "ui/connectdialog/ResetForm";

export default function ConnectDialog() {
    const form = useSelector((state: ClientState) => state.connectDialog.form);
    const location = useSelector((state: ClientState) => state.connectDialog.location);
    const nodeRoot = NodeName.shorten(useSelector(getOwnerNameOrUrl));

    return (
        <>
            {form === "reset" && <ResetForm location={location} nodeRoot={nodeRoot}/>}
        </>
    );
}
