import * as URI from 'uri-js';

import { executor } from "state/executor";
import { Node } from "api";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { dispatch, select } from "state/store-sagas";
import { homeIntroduced } from "state/init-barriers";
import { getNodeUri } from "state/naming/sagas";
import { isConnectedToHome } from "state/home/selectors";
import { goToLocation } from "state/navigation/actions";
import {
    GrantConfirmAction,
    grantConfirmed,
    grantConfirmFailed,
    GrantValidateAction,
    grantValidated
} from "state/grant/actions";
import { REL_HOME } from "util/rel-node-name";
import { urlWithParameters } from "util/url";

export default [
    executor("GRANT_VALIDATE", null, grantValidateSaga),
    executor("GRANT_CONFIRM", null, grantConfirmSaga),
    executor("GRANT_CONFIRMED", null, grantConfirmedSaga)
];

async function grantValidateSaga(action: WithContext<GrantValidateAction>): Promise<void> {
    await homeIntroduced();
    const {clientName, carte, scopes, redirectUri, connectedToHome} = select(state => ({
        clientName: state.grant.clientName,
        carte: state.grant.carte,
        scopes: state.grant.scopes,
        redirectUri: state.grant.redirectUri,
        connectedToHome: isConnectedToHome(state)
    }));

    if (!connectedToHome) {
        openConnectPage(clientName, carte, scopes, redirectUri);
        return;
    }

    if (!clientName) {
        dispatch(grantValidated(false, "Client name is not set").causedBy(action));
        return;
    }

    try {
        const nodeUri = await getNodeUri(action, clientName);
        if (nodeUri == null) {
            dispatch(grantValidated(false, "Client name is not found").causedBy(action));
            return;
        }
        const grant = await Node.getGrant(action, REL_HOME, clientName);
        // @ts-ignore
        if (new Set(scopes).isSubsetOf(new Set(grant.scope))) {
            dispatch(grantValidated(true, null).causedBy(action));
            dispatch(grantConfirmed().causedBy(action));
            return;
        }
        const info = await Node.verifyCarte(
            action, REL_HOME, {clientName, carte}, (code: string) => code.includes("carte")
        );
        if (!info.valid) {
            dispatch(grantValidated(false, info.errorMessage ?? null).causedBy(action))
            return;
        }
        if (!info.clientScope?.includes("grant")) {
            dispatch(grantValidated(false, "Carte does not have 'grant' permission").causedBy(action));
            return;
        }
        dispatch(grantValidated(true, null).causedBy(action));
    } catch (e) {
        dispatch(grantValidated(false, String(e)).causedBy(action));
    }
}

function openConnectPage(clientName: string, carte: string, scopes: string[], redirectUri: string | null): void {
    const backHref = urlWithParameters("/grant", {
        client_id: clientName,
        cliend_secret: carte,
        scope: scopes.join(","),
        redirect_uri: redirectUri
    });
    const {path = null, query = null} = URI.parse(urlWithParameters("/connect", {back: backHref}));
    dispatch(goToLocation(path, query, null));
}

async function grantConfirmSaga(action: WithContext<GrantConfirmAction>): Promise<void> {
    const {clientName, scopes} = select(state => ({
        clientName: state.grant.clientName,
        scopes: state.grant.scopes
    }));

    try {
        await Node.grantOrRevoke(action, REL_HOME, clientName, {scope: scopes, revoke: false});
        dispatch(grantConfirmed().causedBy(action));
    } catch (e) {
        dispatch(grantConfirmFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

function grantConfirmedSaga(): void {
    const redirectUri = select().grant.redirectUri;
    if (redirectUri == null) {
        return;
    }
    window.location.href = redirectUri;
}
