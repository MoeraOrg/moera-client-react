import { all, call, put } from 'typed-redux-saga';

import { executor } from "state/executor";
import { NodeApiError } from "api";
import { BlockedUserInfo } from "api/node/api-types";
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
    const {nodeName, prevBlockedUsers, blockedOperations, deadline} = action.payload;

    try {
        const result = yield* all([
            ...prevBlockedUsers.map(blockedUser => call(deleteBlockedUserIfExists, blockedUser.id)),
            ...blockedOperations.map(blockedOperation =>
                call(postBlockedUser, ":", {blockedOperation, nodeName, deadline}))
        ]);
        const blockedUsers = result.filter((r): r is BlockedUserInfo => r != null && "id" in r);
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
