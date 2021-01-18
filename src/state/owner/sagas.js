import { call, put, select } from 'redux-saga/effects';
import * as URI from 'uri-js';

import { Naming, Node, NodeName } from "api";
import { errorThrown } from "state/error/actions";
import { ownerSet, ownerSwitchClose, ownerSwitchFailed, ownerVerified } from "state/owner/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { initFromLocation } from "state/navigation/actions";
import { normalizeUrl, rootUrl } from "util/url";
import { getNodeUri } from "state/naming/sagas";
import { getNodeRootPage } from "state/node/selectors";
import { getOwnerName } from "state/owner/selectors";

export function* ownerLoadSaga() {
    try {
        const data = yield call(Node.getWhoAmI, "");
        yield put(ownerSet(data.nodeName, data.nodeNameChanging));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* ownerVerifySaga() {
    const {rootPage, ownerName} = yield select(state => ({
        rootPage: getNodeRootPage(state),
        ownerName: getOwnerName(state)
    }));
    try {
        const nodeUri = normalizeUrl(yield call(getNodeUri, ownerName));
        const correct = rootPage === nodeUri;
        yield put(ownerVerified(ownerName, correct));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* ownerSwitchSaga(action) {
    const {standalone, ownerName} = yield select(state => ({
        standalone: isStandaloneMode(state),
        ownerName: getOwnerName(state)
    }));

    if (action.payload.name === ownerName) {
        yield put(ownerSwitchClose());
        return;
    }

    try {
        const {name, generation} = NodeName.parse(action.payload.name);
        const info = yield Naming.getCurrent(name, generation);
        if (info && info.nodeUri) {
            if (!standalone) {
                try {
                    window.location = info.nodeUri;
                } catch (e) {
                    throw new Error("Node location is incorrect: " + info.nodeUri);
                }
            } else {
                const {scheme, host, port, path} = URI.parse(info.nodeUri);
                const rootLocation = rootUrl(scheme, host, port);
                yield put(initFromLocation(rootLocation, path, null, null));
            }
        } else {
            yield put(ownerSwitchFailed());
        }
    } catch (e) {
        yield put(ownerSwitchFailed());
        yield put(errorThrown(e));
    }
}
