import { call, put } from 'typed-redux-saga';

import { executor } from "state/executor";
import { postRemoteSheriffOrder } from "api/node/sagas";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    SHERIFF_ORDER_DELETE,
    SHERIFF_ORDER_DIALOG_SUBMIT,
    SheriffOrderDeleteAction,
    SheriffOrderDialogSubmitAction,
    sheriffOrderDialogSubmitFailed,
    sheriffOrderDialogSubmitted
} from "state/sherifforderdialog/actions";

export default [
    executor(SHERIFF_ORDER_DIALOG_SUBMIT, "", sheriffOrderDialogSubmitSaga),
    executor(SHERIFF_ORDER_DELETE, "", sheriffOrderDeleteSaga)
];

function* sheriffOrderDialogSubmitSaga(action: WithContext<SheriffOrderDialogSubmitAction>) {
    const {nodeName, feedName, postingId, commentId, reasonCode, reasonDetails} = action.payload;

    try {
        yield* call(postRemoteSheriffOrder, ":", nodeName, {
            delete: false, feedName, postingId, commentId, category: "visibility" as const, reasonCode, reasonDetails
        });
        yield* put(sheriffOrderDialogSubmitted());
    } catch (e) {
        yield* put(sheriffOrderDialogSubmitFailed());
        yield* put(errorThrown(e));
    }
}

function* sheriffOrderDeleteSaga(action: WithContext<SheriffOrderDeleteAction>) {
    const {nodeName, feedName, postingId, commentId} = action.payload;

    try {
        yield* call(postRemoteSheriffOrder, ":", nodeName, {
            delete: true, feedName, postingId, commentId, category: "visibility" as const
        });
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
