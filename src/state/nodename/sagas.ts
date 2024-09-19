import { call, put, select } from 'typed-redux-saga';

import { Naming, Node } from "api";
import { executor } from "state/executor";
import { WithContext } from "state/action-types";
import { ClientState } from "state/state";
import { errorThrown } from "state/error/actions";
import {
    MnemonicCloseAction,
    mnemonicClosed,
    NodeNameLoadAction,
    nodeNameLoadFailed,
    nodeNameSet,
    NodeNameUpdateAction,
    nodeNameUpdateFailed,
    nodeNameUpdateSucceeded,
    RegisterNameAction,
    registerNameFailed,
    registerNameSucceeded
} from "state/nodename/actions";
import { ownerSet } from "state/node/actions";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    executor("NODE_NAME_LOAD", "", nodeNameLoadSaga),
    executor("REGISTER_NAME", payload => payload.name, registerNameSaga),
    executor("NODE_NAME_UPDATE", null, nodeNameUpdateSaga),
    executor("MNEMONIC_CLOSE", null, mnemonicCloseSaga),
];

function* nodeNameLoadSaga(action: WithContext<NodeNameLoadAction>) {
    try {
        const {name = null, storedMnemonic} = yield* call(Node.getNodeName, action, REL_CURRENT, false);
        yield* put(nodeNameSet(name, storedMnemonic ?? false).causedBy(action));
        yield* put(ownerSet(name, null, false, false, false, null).causedBy(action));
    } catch (e) {
        yield* put(nodeNameLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* registerNameSaga(action: WithContext<RegisterNameAction>) {
    const {name, onNameTaken} = action.payload;
    try {
        const free = yield* call(Naming.isFree, action, name);
        if (!free) {
            onNameTaken();
            yield* put(registerNameFailed().causedBy(action));
            return;
        }
        const secret = yield* call(Node.createNodeName, action, REL_CURRENT, {name});
        yield* put(registerNameSucceeded(secret.name, secret.mnemonic!).causedBy(action));
    } catch (e) {
        yield* put(registerNameFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* nodeNameUpdateSaga(action: WithContext<NodeNameUpdateAction>) {
    const {name, mnemonic} = action.payload;
    try {
        yield* call(Node.updateNodeName, action, REL_CURRENT, {name, mnemonic});
        yield* put(nodeNameUpdateSucceeded().causedBy(action));
    } catch (e) {
        yield* put(nodeNameUpdateFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* mnemonicCloseSaga(action: WithContext<MnemonicCloseAction>) {
    const {store} = action.payload;

    const {stored, mnemonic} = yield* select((state: ClientState) => ({
        stored: state.nodeName.storedMnemonic,
        mnemonic: state.nodeName.mnemonic
    }));

    try {
        if (store && !stored && mnemonic != null) {
            yield* call(Node.storeMnemonic, action, REL_CURRENT, {mnemonic});
        } else if (!store && stored) {
            yield* call(Node.deleteStoredMnemonic, action, REL_CURRENT);
        }
        yield* put(mnemonicClosed(store).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
