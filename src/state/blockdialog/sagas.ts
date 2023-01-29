import { all, call, put } from 'typed-redux-saga';

import { executor } from "state/executor";
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
    const {nodeName, prevBlockedUsers, blockedOperations} = action.payload;

    try {
        const result = yield* all([
            ...prevBlockedUsers.map(blockedUser => call(deleteBlockedUser, ":", blockedUser.id)),
            ...blockedOperations.map(blockedOperation => call(postBlockedUser, ":", {blockedOperation, nodeName}))
        ]);
        const blockedUsers = result.filter((r): r is BlockedUserInfo => "id" in r);
        yield* put(blockDialogSubmitted(nodeName, blockedUsers));
    } catch (e) {
        yield* put(blockDialogSubmitFailed());
    }
}
