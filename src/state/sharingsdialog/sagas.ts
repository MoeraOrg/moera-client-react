import { Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { saga } from "state/saga";
import { nodeCardsPreload } from "state/nodecards/actions";
import { errorThrown } from "state/error/actions";
import {
    SharingsDialogPastSharingsLoadAction,
    sharingsDialogPastSharingsLoaded,
    sharingsDialogPastSharingsLoadFailed
} from "state/sharingsdialog/actions";
import { getPosting } from "state/postings/selectors";

export default [
    saga(
        "SHARINGS_DIALOG_PAST_SHARINGS_LOAD",
        payload => `${payload.nodeName}:${payload.postingId}:${payload.before}`,
        sharingsDialogPastSharingsLoadSaga
    )
];

async function sharingsDialogPastSharingsLoadSaga(
    action: WithContext<SharingsDialogPastSharingsLoadAction>
): Promise<void> {
    const {nodeName, postingId, before} = action.payload;

    const posting = select(state => getPosting(state, postingId, nodeName));

    if (posting == null) {
        dispatch(sharingsDialogPastSharingsLoadFailed(nodeName, postingId, before).causedBy(action));
        return;
    }

    try {
        const slice = await Node.getPostingSharings(
            action, posting.receiverName ?? nodeName, posting.receiverPostingId ?? posting.id, before, 40
        );
        dispatch(sharingsDialogPastSharingsLoaded(nodeName, postingId, before, slice).causedBy(action));
        dispatch(nodeCardsPreload(slice.sharings.map(sharing => sharing.remoteNodeName)).causedBy(action));
    } catch (e) {
        dispatch(sharingsDialogPastSharingsLoadFailed(nodeName, postingId, before).causedBy(action));
        dispatch(errorThrown(e));
    }
}
