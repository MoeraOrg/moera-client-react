import { call, put, select } from 'redux-saga/effects';

import { normalizeUrl } from "util/misc";
import { errorThrown } from "state/error/actions";
import { Naming, Node, NodeName } from "api";
import { ownerSet, ownerSwitchClose, ownerSwitchFailed, ownerVerified } from "state/owner/actions";
import { namingNameLoaded } from "state/naming/actions";

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
    const ownerName = yield select(state => state.owner.name);
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
            document.location.href = info.nodeUri;
        } else {
            yield put(ownerSwitchFailed());
        }
    } catch (e) {
        yield put(ownerSwitchFailed());
        yield put(errorThrown(e));
    }
}
