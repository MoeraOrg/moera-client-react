import { Naming, Node } from "api";
import { executor } from "state/executor";
import { homeIntroduced } from "state/init-barriers";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import {
    MnemonicDeleteAction,
    mnemonicSet,
    MnemonicStoreAction,
    mnemonicUnset,
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
import { jumpNear } from "state/navigation/actions";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("NODE_NAME_LOAD", "", nodeNameLoadSaga),
    executor("REGISTER_NAME", payload => payload.name, registerNameSaga),
    executor("NODE_NAME_UPDATE", null, nodeNameUpdateSaga),
    executor("MNEMONIC_STORE", null, mnemonicStoreSaga),
    executor("MNEMONIC_DELETE", null, mnemonicDeleteSaga),
];

async function nodeNameLoadSaga(action: WithContext<NodeNameLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const info = await Node.getNodeName(action, REL_HOME, false);
        dispatch(nodeNameSet(info).causedBy(action));
    } catch (e) {
        dispatch(nodeNameLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function registerNameSaga(action: WithContext<RegisterNameAction>): Promise<void> {
    const {name, onNameTaken} = action.payload;
    try {
        const free = await Naming.isFree(action, name);
        if (!free) {
            onNameTaken();
            dispatch(registerNameFailed().causedBy(action));
            return;
        }
        const secret = await Node.createNodeName(action, REL_HOME, {name});
        dispatch(registerNameSucceeded().causedBy(action));
        dispatch(mnemonicSet(secret.name, secret.mnemonic!).causedBy(action));
        dispatch(jumpNear("/mnemonic", null, null).causedBy(action));
    } catch (e) {
        dispatch(registerNameFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function nodeNameUpdateSaga(action: WithContext<NodeNameUpdateAction>): Promise<void> {
    const {name, mnemonic} = action.payload;
    try {
        await Node.updateNodeName(action, REL_HOME, {name, mnemonic});
        dispatch(nodeNameUpdateSucceeded().causedBy(action));
    } catch (e) {
        dispatch(nodeNameUpdateFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function mnemonicStoreSaga(action: WithContext<MnemonicStoreAction>): Promise<void> {
    const mnemonic = select(state => state.nodeName.mnemonic);
    const email = select(state => state.signUp.email);

    try {
        if (mnemonic != null) {
            await Node.storeMnemonic(action, REL_HOME, {mnemonic});
        }
        dispatch(mnemonicUnset(true).causedBy(action));
        // wait with going to the next page until the mnemonic is stored, because if it fails,
        // we'll have a chance to write the mnemonic down or retry
        if (email) {
            dispatch(jumpNear("/profile/verify-email", null, null).causedBy(action));
        } else {
            dispatch(jumpNear("/start-reading", null, null).causedBy(action));
        }
    } catch (e) {
        dispatch(jumpNear("/mnemonic", null, null).causedBy(action));
    }
}

async function mnemonicDeleteSaga(action: WithContext<MnemonicDeleteAction>): Promise<void> {
    try {
        await Node.deleteStoredMnemonic(action, REL_HOME);
        dispatch(mnemonicUnset(false).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}
