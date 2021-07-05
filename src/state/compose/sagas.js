import { call, put, select } from 'redux-saga/effects';

import { errorThrown } from "state/error/actions";
import { Node } from "api";
import {
    COMPOSE_DRAFT_LIST_ITEM_DELETE,
    COMPOSE_DRAFT_LIST_ITEM_RELOAD,
    COMPOSE_DRAFT_LIST_LOAD,
    COMPOSE_DRAFT_LOAD,
    COMPOSE_DRAFT_REVISION_DELETE,
    COMPOSE_DRAFT_SAVE,
    COMPOSE_FEATURES_LOAD,
    COMPOSE_POST,
    COMPOSE_POSTING_LOAD,
    COMPOSE_SHARED_TEXT_LOAD,
    composeDraftListItemDeleted,
    composeDraftListItemSet,
    composeDraftListLoaded,
    composeDraftListLoadFailed,
    composeDraftLoaded,
    composeDraftLoadFailed,
    composeDraftRevisionSet,
    composeDraftSaved,
    composeDraftSaveFailed,
    composeFeaturesLoaded,
    composeFeaturesLoadFailed,
    composePostFailed,
    composePostingLoad,
    composePostingLoaded,
    composePostingLoadFailed,
    composePostSucceeded,
    composeSharedTextSet
} from "state/compose/actions";
import { getComposeDraftId, getComposePostingId } from "state/compose/selectors";
import { introduce } from "api/node/introduce";
import { executor } from "state/executor";

export default [
    executor(COMPOSE_FEATURES_LOAD, "", composeFeaturesLoadSaga),
    executor(COMPOSE_POSTING_LOAD, "", introduce(composePostingLoadSaga)),
    executor(COMPOSE_POST, null, composePostSaga),
    executor(COMPOSE_DRAFT_LOAD, "", introduce(composeDraftLoadSaga)),
    executor(COMPOSE_DRAFT_SAVE, "", composeDraftSaveSaga),
    executor(COMPOSE_DRAFT_LIST_LOAD, "", introduce(composeDraftListLoadSaga)),
    executor(COMPOSE_DRAFT_LIST_ITEM_RELOAD, payload => payload.id, composeDraftListItemReloadSaga),
    executor(COMPOSE_DRAFT_LIST_ITEM_DELETE, payload => payload.id, composeDraftListItemDeleteSaga),
    executor(COMPOSE_DRAFT_REVISION_DELETE, "", composeDraftRevisionDeleteSaga),
    executor(COMPOSE_SHARED_TEXT_LOAD, "", composeSharedTextLoadSaga)
];

function* composeFeaturesLoadSaga() {
    try {
        const data = yield call(Node.getPostingFeatures, "");
        yield put(composeFeaturesLoaded(data));
    } catch (e) {
        yield put(composeFeaturesLoadFailed());
        yield put(errorThrown(e));
    }
}

function* composePostingLoadSaga() {
    try {
        const id = yield select(getComposePostingId);
        const data = yield call(Node.getPostingDraftRevision, "", id);
        yield put(composePostingLoaded(data));
    } catch (e) {
        yield put(composePostingLoadFailed());
        yield put(errorThrown(e));
    }
}

function* composePostSaga(action) {
    const {id, draftId, postingText} = action.payload;

    try {
        let data;
        if (id == null) {
            data = yield call(Node.postPosting, "", postingText);
            if (draftId != null) {
                yield call(Node.deleteDraft, ":", draftId);
                yield put(composeDraftListItemDeleted(draftId));
            }
        } else {
            data = yield call(Node.putPosting, "", id, postingText);
            if (draftId != null) {
                yield call(Node.deletePostingDraftRevision, "", draftId);
            }
        }
        yield put(composePostSucceeded(data));
    } catch (e) {
        yield put(composePostFailed());
        yield put(errorThrown(e));
    }
}

function* composeDraftLoadSaga() {
    try {
        const id = yield select(getComposeDraftId);
        const data = yield call(Node.getDraft, ":", id);
        yield put(composeDraftLoaded(data));
        yield put(composeDraftListItemSet(id, data));
    } catch (e) {
        yield put(composeDraftLoadFailed());
        yield put(errorThrown(e));
    }
}

function* composeDraftSaveSaga(action) {
    const {draftText} = action.payload;

    try {
        let data;
        if (draftText.receiverPostingId == null) {
            if (draftText.id == null) {
                data = yield call(Node.postDraft, ":", draftText);
            } else {
                data = yield call(Node.putDraft, ":", draftText.id, draftText);
            }
            yield put(composeDraftListItemSet(data.id, data));
        } else {
            data = yield call(Node.putPostingDraftRevision, "", draftText.receiverPostingId, draftText);
            yield put(composeDraftRevisionSet(data));
        }
        yield put(composeDraftSaved(draftText.receiverPostingId, data.id));
    } catch (e) {
        yield put(composeDraftSaveFailed());
        yield put(errorThrown(e));
    }
}

function* composeDraftListLoadSaga(action) {
    try {
        const data = yield call(Node.getDraftsNewPosting, ":", action.context.ownerName);
        yield put(composeDraftListLoaded(data));
    } catch (e) {
        yield put(composeDraftListLoadFailed());
        yield put(errorThrown(e));
    }
}

function* composeDraftListItemReloadSaga(action) {
    try {
        const data = yield call(Node.getDraft, ":", action.payload.id);
        yield put(composeDraftListItemSet(data.id, data));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

function* composeDraftListItemDeleteSaga(action) {
    try {
        yield call(Node.deleteDraft, ":", action.payload.id);
        yield put(composeDraftListItemDeleted(action.payload.id));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

function* composeDraftRevisionDeleteSaga() {
    try {
        const id = yield select(getComposePostingId);
        yield call(Node.deletePostingDraftRevision, "", id);
        yield put(composePostingLoad());
    } catch (e) {
        yield put(errorThrown(e));
    }
}

function* composeSharedTextLoadSaga() {
    if (!window.Android) {
        return;
    }
    const text = window.Android.getSharedText();
    const type = window.Android.getSharedTextType();
    if (text != null) {
        yield put(composeSharedTextSet(text, type));
    }
}
