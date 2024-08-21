import { call, put, select } from 'typed-redux-saga';

import { executor } from "state/executor";
import { ClientState } from "state/state";
import { WithContext } from "state/action-types";
import { homeIntroduced } from "state/init-selectors";
import {
    GrantConfirmAction,
    grantConfirmed,
    grantConfirmFailed,
    GrantValidateAction,
    grantValidated
} from "state/grant/actions";
import { Node } from "api";
import { getNodeUri } from "state/naming/sagas";
import { REL_HOME } from "util/rel-node-name";
import { errorThrown } from "state/error/actions";

export default [
    executor("GRANT_VALIDATE", null, grantValidateSaga, homeIntroduced),
    executor("GRANT_CONFIRM", null, grantConfirmSaga),
    executor("GRANT_CONFIRMED", null, grantConfirmedSaga)
];

function* grantValidateSaga(action: WithContext<GrantValidateAction>) {
    const {clientName, carte, scopes} = yield* select((state: ClientState) => ({
        clientName: state.grant.clientName,
        carte: state.grant.carte,
        scopes: state.grant.scopes
    }));

    if (!clientName) {
        yield* put(grantValidated(false, "Client name is not set").causedBy(action));
        return;
    }

    try {
        const nodeUri = yield* call(getNodeUri, action, clientName);
        if (nodeUri == null) {
            yield* put(grantValidated(false, "Client name is not found").causedBy(action));
            return;
        }
        const grant = yield* call(Node.getGrant, action, REL_HOME, clientName);
        // @ts-ignore
        if (new Set(scopes).isSubsetOf(new Set(grant.scope))) {
            yield* put(grantValidated(true, null).causedBy(action));
            yield* put(grantConfirmed().causedBy(action));
            return;
        }
        const info = yield* call(
            Node.verifyCarte, action, REL_HOME, {clientName, carte}, (code: string) => code.includes("carte")
        );
        if (!info.valid) {
            yield* put(grantValidated(false, info.errorMessage ?? null).causedBy(action))
            return;
        }
        if (!info.clientScope?.includes("grant")) {
            yield* put(grantValidated(false, "Carte does not have 'grant' permission").causedBy(action));
            return;
        }
        yield* put(grantValidated(true, null).causedBy(action));
    } catch (e) {
        yield* put(grantValidated(false, String(e)).causedBy(action));
    }
}

function* grantConfirmSaga(action: WithContext<GrantConfirmAction>) {
    const {clientName, scopes} = yield* select((state: ClientState) => ({
        clientName: state.grant.clientName,
        scopes: state.grant.scopes
    }));

    try {
        yield* call(Node.grantOrRevoke, action, REL_HOME, clientName, {scope: scopes, revoke: false});
        yield* put(grantConfirmed().causedBy(action));
    } catch (e) {
        yield* put(grantConfirmFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* grantConfirmedSaga() {
    const redirectUri = yield* select((state: ClientState) => state.grant.redirectUri);
    if (redirectUri == null) {
        return;
    }
    window.location.href = redirectUri;
}
