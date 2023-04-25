import { call, put, select } from 'typed-redux-saga';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { Node } from "api";
import { ClientState } from "state/state";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import {
    SHERIFF_ORDER_DETAILS_DIALOG_LOAD,
    sheriffOrderDetailsDialogLoaded,
    sheriffOrderDetailsDialogLoadFailed
} from "state/sherifforderdetailsdialog/actions";

export default [
    executor(SHERIFF_ORDER_DETAILS_DIALOG_LOAD, "", sheriffOrderDetailsDialogLoadSaga)
];

function* sheriffOrderDetailsDialogLoadSaga() {
    const {nodeName, id} = yield* select((state: ClientState) => ({
        nodeName: state.sheriffOrderDetailsDialog.nodeName,
        id: state.sheriffOrderDetailsDialog.id
    }));

    if (nodeName == null || id == null) {
        yield* put(sheriffOrderDetailsDialogLoadFailed());
        return;
    }

    try {
        const info = yield* call(Node.getRemoteSheriffOrder, SHERIFF_GOOGLE_PLAY_TIMELINE, nodeName, id);
        yield* put(sheriffOrderDetailsDialogLoaded(info));
    } catch (e) {
        yield* put(sheriffOrderDetailsDialogLoadFailed());
        yield* put(errorThrown(e));
    }
}
