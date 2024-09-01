import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import GrantConfirmed from "ui/grant/GrantConfirmed";
import GrantValidating from "ui/grant/GrantValidating";
import GrantNotValid from "ui/grant/GrantNotValid";
import GrantConfirmation from "ui/grant/GrantConfirmation";
import { isConnectedToHome } from "state/home/selectors";

export default function GrantContent() {
    const validated = useSelector((state: ClientState) => state.grant.validated);
    const valid = useSelector((state: ClientState) => state.grant.valid);
    const confirmed = useSelector((state: ClientState) => state.grant.confirmed);
    const connectedToHome = useSelector(isConnectedToHome);

    if (confirmed) {
        return <GrantConfirmed/>;
    }
    if (!validated || !connectedToHome) {
        return <GrantValidating/>;
    }
    if (!valid) {
        return <GrantNotValid/>;
    }
    return <GrantConfirmation/>;
}
