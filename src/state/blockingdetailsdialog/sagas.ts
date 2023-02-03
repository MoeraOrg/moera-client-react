import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { BlockedByUserInfo, BlockedUserInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import {
    BLOCKING_DETAILS_DIALOG_LOAD,
    blockingDetailsDialogLoaded,
    blockingDetailsDialogLoadFailed
} from "state/blockingdetailsdialog/actions";

export default [
    executor(BLOCKING_DETAILS_DIALOG_LOAD, "", blockingDetailsDialogLoadSaga)
];

function* blockingDetailsDialogLoadSaga() {
    const {nodeName, remoteNodeName, by} = yield* select((state: ClientState) => ({
        nodeName: state.blockingDetailsDialog.nodeName,
        remoteNodeName: state.blockingDetailsDialog.remoteNodeName,
        by: state.blockingDetailsDialog.by
    }));

    try {
        let blocked: (BlockedUserInfo | BlockedByUserInfo)[];
        if (!by) {
            blocked = yield* call(Node.searchBlockedUsers, nodeName, {
                blockedOperations: ["reaction" as const, "comment" as const],
                nodeName: remoteNodeName
            })
        } else {
            blocked = yield* call(Node.getBlockedByUsers, nodeName, remoteNodeName, null);
        }
        yield* put(blockingDetailsDialogLoaded(blocked));
    } catch (e) {
        yield* put(blockingDetailsDialogLoadFailed());
        yield* put(errorThrown(e));
    }
}
