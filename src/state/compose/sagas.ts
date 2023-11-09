import { call, put, select } from 'typed-redux-saga';
import i18n from 'i18next';

import { errorThrown } from "state/error/actions";
import { Node, NodeApiError } from "api";
import {
    ComposeDraftDeleteAction,
    ComposeDraftListItemDeleteAction,
    composeDraftListItemDeleted,
    ComposeDraftListItemReloadAction,
    composeDraftListItemSet,
    ComposeDraftListLoadAction,
    composeDraftListLoaded,
    composeDraftListLoadFailed, ComposeDraftLoadAction,
    composeDraftLoaded,
    composeDraftLoadFailed,
    ComposeDraftSaveAction,
    composeDraftSaved,
    composeDraftSaveFailed,
    composeDraftUnset,
    ComposePostAction,
    composePostFailed,
    ComposePostingLoadAction,
    composePostingLoaded,
    composePostingLoadFailed,
    composePostSucceeded, ComposeSharedTextLoadAction,
    composeSharedTextSet,
    ComposeUpdateDraftDeleteAction
} from "state/compose/actions";
import { getComposeDraftId, getComposePostingId, isComposePostingEditing } from "state/compose/selectors";
import { executor } from "state/executor";
import { WithContext } from "state/action-types";
import { flashBox } from "state/flashbox/actions";
import { mutuallyIntroduced } from "state/init-selectors";

export default [
    executor("COMPOSE_POSTING_LOAD", "", composePostingLoadSaga, mutuallyIntroduced),
    executor("COMPOSE_POST", null, composePostSaga),
    executor("COMPOSE_DRAFT_LOAD", "", composeDraftLoadSaga, mutuallyIntroduced),
    executor("COMPOSE_DRAFT_SAVE", "", composeDraftSaveSaga),
    executor("COMPOSE_DRAFT_DELETE", "", composeDraftDeleteSaga),
    executor("COMPOSE_DRAFT_LIST_LOAD", "", composeDraftListLoadSaga, mutuallyIntroduced),
    executor("COMPOSE_DRAFT_LIST_ITEM_RELOAD", payload => payload.id, composeDraftListItemReloadSaga),
    executor("COMPOSE_DRAFT_LIST_ITEM_DELETE", payload => payload.id, composeDraftListItemDeleteSaga),
    executor("COMPOSE_UPDATE_DRAFT_DELETE", "", composeUpdateDraftDeleteSaga),
    executor("COMPOSE_SHARED_TEXT_LOAD", "", composeSharedTextLoadSaga)
];

function* composePostingLoadSaga(action: WithContext<ComposePostingLoadAction>) {
    const id = yield* select(getComposePostingId);
    if (action.context.ownerName == null || id == null) {
        yield* put(composePostingLoadFailed().causedBy(action));
        return;
    }

    try {
        const drafts = yield* call(Node.getDrafts, action, ":", "posting-update" as const, action.context.ownerName, id);
        if (drafts.length > 0) {
            yield* put(composeDraftLoaded(drafts[0]).causedBy(action));
        }
        const posting = yield* call(Node.getPosting, action, "", id, true, ["posting.not-found"]);
        yield* put(composePostingLoaded(posting).causedBy(action));
    } catch (e) {
        yield* put(composePostingLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* composePostSaga(action: ComposePostAction) {
    const {id, postingText, prevState} = action.payload;

    try {
        let posting;
        if (id == null) {
            posting = yield* call(Node.createPosting, action, "", postingText);
        } else {
            posting = yield* call(Node.updatePosting, action, "", id, postingText);
        }
        yield* put(composePostSucceeded(posting).causedBy(action));

        if (id != null) {
            const hideComments = postingText.commentOperations?.view === "private";
            if (hideComments !== prevState.hideComments) {
                yield* call(Node.updateAllComments, action, "", id, {
                    seniorOperations: {
                        view: postingText.commentOperations?.view
                    }
                });
            }
        }
    } catch (e) {
        yield* put(composePostFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* composeDraftLoadSaga(action: ComposeDraftLoadAction) {
    const id = yield* select(getComposeDraftId);
    if (id == null) {
        yield* put(composeDraftLoadFailed().causedBy(action));
        return;
    }

    try {
        const draft = yield* call(Node.getDraft, action, ":", id, ["draft.not-found"]);
        yield* put(composeDraftLoaded(draft).causedBy(action));
        yield* put(composeDraftListItemSet(id, draft).causedBy(action));
    } catch (e) {
        yield* put(composeDraftLoadFailed().causedBy(action));
        if (e instanceof NodeApiError) {
            yield* put(flashBox(i18n.t("draft-not-found")).causedBy(action));
        } else {
            yield* put(errorThrown(e));
        }
    }
}

function* composeDraftSaveSaga(action: ComposeDraftSaveAction) {
    const {draftId, draftText} = action.payload;

    try {
        let draft;
        if (draftId == null) {
            draft = yield* call(Node.createDraft, action, ":", draftText);
        } else {
            draft = yield* call(Node.updateDraft, action, ":", draftId, draftText);
        }
        if (draftText.receiverPostingId == null) {
            yield* put(composeDraftListItemSet(draft.id, draft).causedBy(action));
        }
        yield* put(composeDraftSaved(draftText.receiverPostingId ?? null, draft).causedBy(action));
    } catch (e) {
        yield* put(composeDraftSaveFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* composeDraftDeleteSaga(action: ComposeDraftDeleteAction) {
    const {draftId, editing} = yield* select(state => ({
        draftId: getComposeDraftId(state),
        editing: isComposePostingEditing(state)
    }));
    if (draftId == null) {
        return;
    }
    if (!editing) {
        yield* call(Node.deleteDraft, action, ":", draftId, ["draft.not-found"]);
        yield* put(composeDraftListItemDeleted(draftId, true).causedBy(action));
    } else {
        yield* call(Node.deleteDraft, action, ":", draftId, ["draft.not-found"]);
    }

}

function* composeDraftListLoadSaga(action: WithContext<ComposeDraftListLoadAction>) {
    if (action.context.ownerName == null) {
        yield* put(composeDraftListLoadFailed().causedBy(action));
        return;
    }

    try {
        const drafts = yield* call(Node.getDrafts, action, ":", "new-posting" as const, action.context.ownerName);
        yield* put(composeDraftListLoaded(drafts).causedBy(action));
    } catch (e) {
        yield* put(composeDraftListLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* composeDraftListItemReloadSaga(action: ComposeDraftListItemReloadAction) {
    try {
        const draft = yield* call(Node.getDraft, action, ":", action.payload.id, ["draft.not-found"]);
        yield* put(composeDraftListItemSet(draft.id, draft).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* composeDraftListItemDeleteSaga(action: ComposeDraftListItemDeleteAction) {
    const {id, resetForm} = action.payload;

    try {
        yield* call(Node.deleteDraft, action, ":", id, ["draft.not-found"]);
        yield* put(composeDraftListItemDeleted(id, resetForm).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(composeDraftListItemDeleted(id, resetForm).causedBy(action));
        } else {
            yield* put(errorThrown(e));
        }
    }
}

function* composeUpdateDraftDeleteSaga(action: ComposeUpdateDraftDeleteAction) {
    const id = yield* select(getComposeDraftId);
    if (id == null) {
        return;
    }

    try {
        yield* call(Node.deleteDraft, action, ":", id, ["draft.not-found"]);
        yield* put(composeDraftUnset(action.payload.resetForm).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* composeSharedTextLoadSaga(action: ComposeSharedTextLoadAction) {
    if (!window.Android) {
        return;
    }
    const text = window.Android.getSharedText();
    const type = window.Android.getSharedTextType();
    if (text != null) {
        yield* put(composeSharedTextSet(text, type).causedBy(action));
    }
}
