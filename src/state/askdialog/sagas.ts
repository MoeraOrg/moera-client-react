import { call, put } from 'typed-redux-saga';

import { executor } from "state/executor";
import { Node } from "api";
import { errorThrown } from "state/error/actions";
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

function* askDialogLoadSaga(action: AskDialogLoadAction) {
    const {nodeName} = action.payload;
    try {
        const groups = yield* call(Node.getFriendGroups, nodeName);
        yield* put(askDialogLoaded(nodeName, groups));
    } catch (e) {
        yield* put(askDialogLoadFailed(nodeName));
        yield* put(errorThrown(e));
    }
}

function* askDialogSendSaga(action: AskDialogSendAction) {
    const {nodeName, subject, friendGroupId, message} = action.payload;
    try {
        yield* call(Node.askRemoteNode, ":", nodeName, subject, friendGroupId, message);
        yield* put(askDialogSent(nodeName));
    } catch (e) {
        yield* put(askDialogSendFailed(nodeName));
        yield* put(errorThrown(e));
    }
}
