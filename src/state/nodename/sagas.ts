import { Naming, Node } from "api";
import { executor } from "state/executor";
import { homeIntroduced } from "state/init-barriers";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
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
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("NODE_NAME_LOAD", "", nodeNameLoadSaga),
    executor("REGISTER_NAME", payload => payload.name, registerNameSaga),
    executor("NODE_NAME_UPDATE", null, nodeNameUpdateSaga),
    executor("MNEMONIC_CLOSE", null, mnemonicCloseSaga),
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
        dispatch(registerNameSucceeded(secret.name, secret.mnemonic!).causedBy(action));
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

async function mnemonicCloseSaga(action: WithContext<MnemonicCloseAction>): Promise<void> {
    const {store} = action.payload;

    const {stored, mnemonic} = select(state => ({
        stored: state.nodeName.storedMnemonic,
        mnemonic: state.nodeName.mnemonic
    }));

    try {
        if (store && !stored && mnemonic != null) {
            await Node.storeMnemonic(action, REL_HOME, {mnemonic});
        } else if (!store && stored) {
            await Node.deleteStoredMnemonic(action, REL_HOME);
        }
        dispatch(mnemonicClosed(store).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}
