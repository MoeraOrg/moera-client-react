import { executor } from "state/executor";
import { Features, Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { getNodeFeatures } from "state/node/selectors";
import {
    AskDialogLoadAction,
    askDialogLoaded,
    askDialogLoadFailed,
    AskDialogSendAction,
    askDialogSendFailed,
    askDialogSent
} from "state/askdialog/actions";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("ASK_DIALOG_LOAD", payload => payload.nodeName, askDialogLoadSaga),
    executor("ASK_DIALOG_SEND", null, askDialogSendSaga)
];

async function askDialogLoadSaga(action: WithContext<AskDialogLoadAction>): Promise<void> {
    const {nodeName} = action.payload;
    try {
        let features: Features | null;
        if (nodeName === action.context.ownerName) {
            features = select(getNodeFeatures);
        } else {
            features = await Node.getFeatures(action, nodeName);
        }
        dispatch(askDialogLoaded(
            nodeName, features?.friendGroups?.available ?? [], features?.ask ?? []
        ).causedBy(action));
    } catch (e) {
        dispatch(askDialogLoadFailed(nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function askDialogSendSaga(action: WithContext<AskDialogSendAction>): Promise<void> {
    const {nodeName, subject, friendGroupId, message} = action.payload;
    try {
        await Node.askRemoteNode(action, REL_HOME, nodeName, {subject, friendGroupId, message});
        dispatch(askDialogSent(nodeName).causedBy(action));
    } catch (e) {
        dispatch(askDialogSendFailed(nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}
