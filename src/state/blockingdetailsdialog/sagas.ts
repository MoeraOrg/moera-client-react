import { call, put, select } from 'typed-redux-saga';

import { BlockedByUserInfo, BlockedUserInfo, Node } from "api";
import { ClientState } from "state/state";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import {
    BlockingDetailsDialogLoadAction,
    blockingDetailsDialogLoaded,
    blockingDetailsDialogLoadFailed
} from "state/blockingdetailsdialog/actions";

export default [
    executor("BLOCKING_DETAILS_DIALOG_LOAD", "", blockingDetailsDialogLoadSaga)
];

function* blockingDetailsDialogLoadSaga(action: BlockingDetailsDialogLoadAction) {
    const {nodeName, remoteNodeName, remotePostingId, by} = yield* select((state: ClientState) => ({
        nodeName: state.blockingDetailsDialog.nodeName,
        remoteNodeName: state.blockingDetailsDialog.remoteNodeName,
        remotePostingId: state.blockingDetailsDialog.remotePostingId,
        by: state.blockingDetailsDialog.by
    }));

    try {
        let blocked: (BlockedUserInfo | BlockedByUserInfo)[];
        if (!by) {
            blocked = yield* call(Node.searchBlockedUsers, action, nodeName, {
                blockedOperations: ["reaction" as const, "comment" as const],
                nodeName: remoteNodeName
            })
        } else {
            const postings = remoteNodeName != null ? [{nodeName: remoteNodeName, postingId: remotePostingId}] : [];
            blocked = yield* call(Node.searchBlockedByUsers, action, nodeName, {
                postings,
                strict: true
            });
        }
        yield* put(blockingDetailsDialogLoaded(blocked).causedBy(action));
    } catch (e) {
        yield* put(blockingDetailsDialogLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}
