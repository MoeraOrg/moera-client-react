import { all, call, put } from 'typed-redux-saga';

import { executor } from "state/executor";
import { NodeApiError } from "api";
import { deleteBlockedUser, postBlockedUser } from "api/node/sagas";
import { WithContext } from "state/action-types";
import {
    BLOCK_DIALOG_SUBMIT,
    BlockDialogSubmitAction,
    blockDialogSubmitFailed,
    blockDialogSubmitted
} from "state/blockdialog/actions";
import { blockedUsersAdded, blockedUsersDeleted } from "state/blockedoperations/actions";

export default [
    executor(BLOCK_DIALOG_SUBMIT, "", blockDialogSubmitSaga)
];

function* blockDialogSubmitSaga(action: WithContext<BlockDialogSubmitAction>) {
    const {
        nodeName, entryNodeName, entryPostingId, prevBlockedUsers, blockedOperations, deadline, reasonSrc
    } = action.payload;
    const {homeOwnerName} = action.context;

    const ownEntryId = entryNodeName == null ? null : entryNodeName === homeOwnerName ? entryPostingId : null;
    const targetNodeName = entryNodeName == null || entryNodeName === homeOwnerName ? null : entryNodeName;
    const targetPostingId = entryNodeName == null || entryNodeName === homeOwnerName ? null : entryPostingId;

    try {
        yield* all(prevBlockedUsers.map(blockedUser => call(deleteBlockedUserIfExists, blockedUser.id)));
        const blockedUsers = yield* all(
            blockedOperations.map(blockedOperation => call(postBlockedUser, ":", {
                blockedOperation,
                nodeName,
                entryId: ownEntryId,
                entryNodeName: targetNodeName,
                entryPostingId: targetPostingId,
                deadline,
                reasonSrc
            }))
        );
        yield* put(blockDialogSubmitted(nodeName));

        if (prevBlockedUsers.length > 0) {
            yield* put(blockedUsersDeleted(prevBlockedUsers));
        }
        if (blockedUsers.length > 0) {
            yield* put(blockedUsersAdded(blockedUsers));
        }
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
