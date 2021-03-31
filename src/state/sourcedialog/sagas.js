import { call, put } from 'redux-saga/effects';

import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { Node } from "api";
import { OPEN_SOURCE_DIALOG, sourceDialogLoaded, sourceDialogLoadFailed } from "state/sourcedialog/actions";

export default [
    executor(OPEN_SOURCE_DIALOG, "", openSourceDialogSaga)
];

function* openSourceDialogSaga(action) {
    const {postingId, commentId} = action.payload;

    try {
        let entry;
        if (commentId == null) {
            entry = yield call(Node.getPosting, "", postingId, true);
        } else {
            entry = yield call(Node.getComment, "", postingId, commentId, true);
        }
        yield put(sourceDialogLoaded(entry.bodySrc.text));
    } catch (e) {
        yield put(sourceDialogLoadFailed());
        yield put(errorThrown(e));
    }
}
