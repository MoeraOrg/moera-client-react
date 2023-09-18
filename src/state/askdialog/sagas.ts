import { call, put, select } from 'typed-redux-saga';

import { executor } from "state/executor";
import { Features, Node } from "api";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { getNodeFeatures } from "state/node/selectors";
import {
    ASK_DIALOG_LOAD,
    ASK_DIALOG_SEND,
    AskDialogLoadAction,
    askDialogLoaded,
    askDialogLoadFailed,
    AskDialogSendAction,
    askDialogSendFailed,
    askDialogSent
} from "state/askdialog/actions";

export default [
    executor(ASK_DIALOG_LOAD, payload => payload.nodeName, askDialogLoadSaga),
    executor(ASK_DIALOG_SEND, null, askDialogSendSaga)
];

function* askDialogLoadSaga(action: WithContext<AskDialogLoadAction>) {
    const {nodeName} = action.payload;
    try {
        let features: Features | null;
        if (nodeName === action.context.ownerName) {
            features = yield* select(getNodeFeatures);
        } else {
            features = yield* call(Node.getFeatures, nodeName);
        }
        yield* put(askDialogLoaded(nodeName, features?.friendGroups?.available ?? [], features?.ask ?? []));
    } catch (e) {
        yield* put(askDialogLoadFailed(nodeName));
        yield* put(errorThrown(e));
    }
}

function* askDialogSendSaga(action: AskDialogSendAction) {
    const {nodeName, subject, friendGroupId, message} = action.payload;
    try {
        yield* call(Node.askRemoteNode, ":", nodeName, {subject, friendGroupId, message});
        yield* put(askDialogSent(nodeName));
    } catch (e) {
        yield* put(askDialogSendFailed(nodeName));
        yield* put(errorThrown(e));
    }
}
