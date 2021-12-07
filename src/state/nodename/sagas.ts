import { call, put } from 'typed-redux-saga/macro';

import { errorThrown } from "state/error/actions";
import {
    NODE_NAME_LOAD,
    NODE_NAME_UPDATE,
    nodeNameLoadFailed,
    nodeNameSet,
    NodeNameUpdateAction,
    nodeNameUpdateFailed,
    nodeNameUpdateSucceeded,
    REGISTER_NAME,
    RegisterNameAction,
    registerNameFailed,
    registerNameSucceeded
} from "state/nodename/actions";
import { ownerSet } from "state/owner/actions";
import { Naming, Node } from "api";
import { executor } from "state/executor";

export default [
    executor(NODE_NAME_LOAD, "", nodeNameLoadSaga),
    executor(REGISTER_NAME, payload => payload.name, registerNameSaga),
    executor(NODE_NAME_UPDATE, null, nodeNameUpdateSaga)
];

function* nodeNameLoadSaga() {
    try {
        const {name = null} = yield* call(Node.getNodeName, "");
        yield* put(nodeNameSet(name));
        yield* put(ownerSet(name, null, false, false, false, null));
    } catch (e) {
        yield* put(nodeNameLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* registerNameSaga(action: RegisterNameAction) {
    const {name, onNameTaken} = action.payload;
    try {
        const free = yield* call(Naming.isFree, name);
        if (!free) {
            onNameTaken();
            yield* put(registerNameFailed());
            return;
        }
        const secret = yield* call(Node.registerName, "", name);
        yield* put(registerNameSucceeded(secret.name, secret.mnemonic));
    } catch (e) {
        yield* put(registerNameFailed());
        yield* put(errorThrown(e));
    }
}

function* nodeNameUpdateSaga(action: NodeNameUpdateAction) {
    const {name, mnemonic} = action.payload;
    try {
        yield* call(Node.updateNodeName, "", name, mnemonic);
        yield* put(nodeNameUpdateSucceeded());
    } catch (e) {
        yield* put(nodeNameUpdateFailed());
        yield* put(errorThrown(e));
    }
}
