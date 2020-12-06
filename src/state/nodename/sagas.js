import { call, put } from 'redux-saga/effects';

import { errorThrown } from "state/error/actions";
import {
    nodeNameLoadFailed,
    nodeNameSet,
    nodeNameUpdateFailed,
    nodeNameUpdateSucceeded,
    registerNameFailed,
    registerNameSucceeded
} from "state/nodename/actions";
import { ownerSet } from "state/owner/actions";
import { Naming, Node } from "api";

export function* nodeNameLoadSaga() {
    try {
        const data = yield call(Node.getNodeName, "");
        yield put(nodeNameSet(data));
        if (data.name) {
            yield put(ownerSet(data.name, null));
        }
    } catch (e) {
        yield put(nodeNameLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* registerNameSaga(action) {
    const {name, onNameTaken} = action.payload;
    try {
        const free = yield call(Naming.isFree, name);
        if (!free) {
            onNameTaken();
            yield put(registerNameFailed());
            return;
        }
        const secret = yield call(Node.registerName, "", name);
        yield put(registerNameSucceeded(secret.name, secret.mnemonic));
    } catch (e) {
        yield put(registerNameFailed());
        yield put(errorThrown(e));
    }
}

export function* nodeNameUpdateSaga(action) {
    const {name, mnemonic} = action.payload;
    try {
        yield call(Node.updateNodeName, "", name, mnemonic);
        yield put(nodeNameUpdateSucceeded());
    } catch (e) {
        yield put(nodeNameUpdateFailed());
        yield put(errorThrown(e));
    }
}
