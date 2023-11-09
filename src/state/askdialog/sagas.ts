import { call, put, select } from 'typed-redux-saga';

import { executor } from "state/executor";
import { Features, Node } from "api";
import { WithContext } from "state/action-types";
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

export default [
    executor("ASK_DIALOG_LOAD", payload => payload.nodeName, askDialogLoadSaga),
    executor("ASK_DIALOG_SEND", null, askDialogSendSaga)
];

function* askDialogLoadSaga(action: WithContext<AskDialogLoadAction>) {
    const {nodeName} = action.payload;
    try {
        let features: Features | null;
        if (nodeName === action.context.ownerName) {
            features = yield* select(getNodeFeatures);
        } else {
            features = yield* call(Node.getFeatures, action, nodeName);
        }
        yield* put(askDialogLoaded(
            nodeName, features?.friendGroups?.available ?? [], features?.ask ?? []
        ).causedBy(action));
    } catch (e) {
        yield* put(askDialogLoadFailed(nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* askDialogSendSaga(action: AskDialogSendAction) {
    const {nodeName, subject, friendGroupId, message} = action.payload;
    try {
        yield* call(Node.askRemoteNode, action, ":", nodeName, {subject, friendGroupId, message});
        yield* put(askDialogSent(nodeName).causedBy(action));
    } catch (e) {
        yield* put(askDialogSendFailed(nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}
