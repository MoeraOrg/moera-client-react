import { call, put, select } from 'redux-saga/effects';

import { errorThrown } from "state/error/actions";
import { Node } from "api";
import {
    composeDraftSaved,
    composeDraftSaveFailed,
    composeFeaturesLoaded,
    composeFeaturesLoadFailed,
    composePostFailed,
    composePostingLoaded,
    composePostingLoadFailed,
    composePostSucceeded
} from "state/compose/actions";
import { getComposePostingId } from "state/compose/selectors";

export function* composeFeaturesLoadSaga() {
    try {
        const data = yield call(Node.getPostingFeatures);
        yield put(composeFeaturesLoaded(data));
    } catch (e) {
        yield put(composeFeaturesLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* composePostingLoadSaga() {
    try {
        const id = yield select(getComposePostingId);
        const data = yield call(Node.getPostingDraftRevision, id);
        yield put(composePostingLoaded(data));
    } catch (e) {
        yield put(composePostingLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* composePostSaga(action) {
    const {id, draftId, postingText} = action.payload;

    try {
        let data;
        if (id == null) {
            data = yield call(Node.postPosting, postingText);
            if (draftId != null) {
                yield call(Node.deleteDraftPosting, draftId);
            }
        } else {
            data = yield call(Node.putPosting, id, postingText);
            if (draftId != null) {
                yield call(Node.deletePostingDraftRevision, draftId);
            }
        }
        yield put(composePostSucceeded(data));
    } catch (e) {
        yield put(composePostFailed());
        yield put(errorThrown(e));
    }
}

export function* composeDraftSaveSaga(action) {
    const {postingId, draftId, postingText} = action.payload;

    try {
        let data;
        if (postingId == null) {
            if (draftId == null) {
                data = yield call(Node.postDraftPosting, postingText);
            } else {
                data = yield call(Node.putDraftPosting, draftId, postingText);
            }
        } else {
            data = yield call(Node.putPostingDraftRevision, postingId, postingText);
        }
        yield put(composeDraftSaved(postingId, data.id));
    } catch (e) {
        yield put(composeDraftSaveFailed());
        yield put(errorThrown(e));
    }
}
