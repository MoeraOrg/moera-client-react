import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { Node } from "api";
import { executor } from "state/executor";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import {
    SheriffOrderDetailsDialogLoadAction,
    sheriffOrderDetailsDialogLoaded,
    sheriffOrderDetailsDialogLoadFailed
} from "state/sherifforderdetailsdialog/actions";

export default [
    executor("SHERIFF_ORDER_DETAILS_DIALOG_LOAD", "", sheriffOrderDetailsDialogLoadSaga)
];

async function sheriffOrderDetailsDialogLoadSaga(
    action: WithContext<SheriffOrderDetailsDialogLoadAction>
): Promise<void> {
    const {nodeName, id} = select(state => ({
        nodeName: state.sheriffOrderDetailsDialog.nodeName,
        id: state.sheriffOrderDetailsDialog.id
    }));

    if (nodeName == null || id == null) {
        dispatch(sheriffOrderDetailsDialogLoadFailed().causedBy(action));
        return;
    }

    try {
        const info = await Node.getRemoteSheriffOrder(action, SHERIFF_GOOGLE_PLAY_TIMELINE, nodeName, id);
        dispatch(sheriffOrderDetailsDialogLoaded(info).causedBy(action));
    } catch (e) {
        dispatch(sheriffOrderDetailsDialogLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
