import { all, call, put } from 'typed-redux-saga';

import { executor } from "state/executor";
import { NodeApiError } from "api";
import { deleteBlockedUser, postBlockedUser } from "api/node/sagas";
import {
    BLOCK_DIALOG_SUBMIT,
    BlockDialogSubmitAction,
    blockDialogSubmitFailed,
    blockDialogSubmitted
} from "state/blockdialog/actions";

export default [
    executor(BLOCK_DIALOG_SUBMIT, "", blockDialogSubmitSaga)
];

function* blockDialogSubmitSaga(action: BlockDialogSubmitAction) {
    const {nodeName, prevBlockedUsers, blockedOperations, deadline, reasonSrc} = action.payload;

    try {
        yield* all(prevBlockedUsers.map(blockedUser => call(deleteBlockedUserIfExists, blockedUser.id)));
        const blockedUsers = yield* all(
            blockedOperations.map(blockedOperation =>
                call(postBlockedUser, ":", {blockedOperation, nodeName, deadline, reasonSrc}))
        );
        yield* put(blockDialogSubmitted(nodeName, blockedUsers));
    } catch (e) {
        yield* put(blockDialogSubmitFailed());
    }
}

function* deleteBlockedUserIfExists(id: string) {
    try {
        return yield* call(deleteBlockedUser, ":", id);
    } catch (e) {
        if (!(e instanceof NodeApiError)) {
            throw e;
        }
        return null;
    }
}
