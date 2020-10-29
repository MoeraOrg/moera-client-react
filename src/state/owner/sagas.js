import { call, put, select } from 'redux-saga/effects';
import * as URI from 'uri-js';

import { Naming, Node, NodeName } from "api";
import { errorThrown } from "state/error/actions";
import { ownerSet, ownerSwitchClose, ownerSwitchFailed, ownerVerified } from "state/owner/actions";
import { namingNameLoaded } from "state/naming/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { initFromLocation } from "state/navigation/actions";
import { normalizeUrl, rootUrl } from "util/misc";

export function* ownerLoadSaga() {
    try {
        const data = yield call(Node.getWhoAmI, "");
        yield put(ownerSet(data.nodeName));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* ownerVerifySaga() {
    const {rootPage, ownerName} = yield select(state => ({
        rootPage: state.node.root.page,
        ownerName: state.owner.name
    }));
    try {
        const {name, generation} = NodeName.parse(ownerName);
        const data = yield call(Naming.getCurrent, name, generation);
        const nodeUri = normalizeUrl(data.nodeUri);
        const correct = !!(data && rootPage === nodeUri);
        const latest = !!(data && data.latest);
        const deadline = data ? data.deadline : null;
        yield put(ownerVerified(ownerName, correct, deadline));
        yield put(namingNameLoaded(ownerName, latest, nodeUri));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* ownerSwitchSaga(action) {
    const {standalone, ownerName} = yield select(state => ({
        standalone: isStandaloneMode(state),
        ownerName: state.owner.name
    }));

    if (action.payload.name === ownerName) {
        yield put(ownerSwitchClose());
        return;
    }

    try {
        const {name, generation} = NodeName.parse(action.payload.name);
        let info;
        if (generation != null) {
            info = yield Naming.getCurrent(name, generation);
        } else {
            info = yield Naming.getCurrentForLatest(name);
        }
        if (info && info.nodeUri) {
            if (!standalone) {
                window.location = info.nodeUri;
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
