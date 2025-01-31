import { BlockedByUserInfo, BlockedUserInfo, Node } from "api";
import { WithContext } from "state/action-types";
import { executor } from "state/executor";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import {
    BlockingDetailsDialogLoadAction,
    blockingDetailsDialogLoaded,
    blockingDetailsDialogLoadFailed
} from "state/blockingdetailsdialog/actions";

export default [
    executor("BLOCKING_DETAILS_DIALOG_LOAD", "", blockingDetailsDialogLoadSaga)
];

async function blockingDetailsDialogLoadSaga(action: WithContext<BlockingDetailsDialogLoadAction>): Promise<void> {
    const {nodeName, remoteNodeName, remotePostingId, by} = select(state => ({
        nodeName: state.blockingDetailsDialog.nodeName,
        remoteNodeName: state.blockingDetailsDialog.remoteNodeName,
        remotePostingId: state.blockingDetailsDialog.remotePostingId,
        by: state.blockingDetailsDialog.by
    }));

    if (nodeName == null) {
        dispatch(blockingDetailsDialogLoadFailed().causedBy(action));
        return;
    }

    try {
        let blocked: (BlockedUserInfo | BlockedByUserInfo)[];
        if (!by) {
            blocked = await Node.searchBlockedUsers(action, nodeName, {
                blockedOperations: ["reaction" as const, "comment" as const],
                nodeName: remoteNodeName
            })
        } else {
            const postings = remoteNodeName != null ? [{nodeName: remoteNodeName, postingId: remotePostingId}] : [];
            blocked = await Node.searchBlockedByUsers(action, nodeName, {
                postings,
                strict: true
            });
        }
        dispatch(blockingDetailsDialogLoaded(blocked).causedBy(action));
    } catch (e) {
        dispatch(blockingDetailsDialogLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
