import i18n from 'i18next';

import { errorThrown } from "state/error/actions";
import { Node, NodeApiError } from "api";
import { updateMediaCaptions } from "state/mediaupload/media-upload";
import {
    ComposeDraftDeleteAction,
    ComposeDraftListItemDeleteAction,
    composeDraftListItemDeleted,
    ComposeDraftListItemReloadAction,
    composeDraftListItemSet,
    ComposeDraftListLoadAction,
    composeDraftListLoaded,
    composeDraftListLoadFailed,
    ComposeDraftLoadAction,
    composeDraftLoaded,
    composeDraftLoadFailed,
    ComposeDraftSaveAction,
    composeDraftSaved,
    composeDraftSaveFailed,
    composeDraftSelect,
    composeDraftUnset,
    ComposePostAction,
    ComposePostedAsyncAction,
    composePostedAsync,
    composePostFailed,
    ComposePostingLoadAction,
    composePostingLoaded,
    composePostingLoadFailed,
    composePostSucceeded,
    composeSharedTextAbsent,
    ComposeSharedTextLoadAction,
    composeSharedTextSet,
    ComposeUpdateDraftDeleteAction
} from "state/compose/actions";
import { getComposeDraftId, getComposePostingId, isComposePostingEditing } from "state/compose/selectors";
import { saga } from "state/saga";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { getOwnerName } from "state/node/selectors";
import { flashBox } from "state/flashbox/actions";
import { getFeedState } from "state/feeds/selectors";
import { mutuallyIntroduced } from "state/init-barriers";
import { jumpNear } from "state/navigation/actions";
import { deleteDraft } from "state/drafts/sagas";
import { loadRemoteMediaInDraftAttachments } from "state/remotemedia/sagas";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { ut } from "util/url";

export default [
    saga("COMPOSE_POSTING_LOAD", "", composePostingLoadSaga),
    saga("COMPOSE_POST", null, composePostSaga),
    saga("COMPOSE_POSTED_ASYNC", "", composePostedAsyncSaga),
    saga("COMPOSE_DRAFT_LOAD", "", composeDraftLoadSaga),
    saga("COMPOSE_DRAFT_SAVE", null, composeDraftSaveSaga),
    saga("COMPOSE_DRAFT_DELETE", "", composeDraftDeleteSaga),
    saga("COMPOSE_DRAFT_LIST_LOAD", "", composeDraftListLoadSaga),
    saga("COMPOSE_DRAFT_LIST_ITEM_RELOAD", payload => payload.id, composeDraftListItemReloadSaga),
    saga("COMPOSE_DRAFT_LIST_ITEM_DELETE", payload => payload.id, composeDraftListItemDeleteSaga),
    saga("COMPOSE_UPDATE_DRAFT_DELETE", "", composeUpdateDraftDeleteSaga),
    saga("COMPOSE_SHARED_TEXT_LOAD", "", composeSharedTextLoadSaga)
];

async function composePostingLoadSaga(action: WithContext<ComposePostingLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const id = select(getComposePostingId);
    if (action.context.ownerName == null || id == null) {
        dispatch(composePostingLoadFailed().causedBy(action));
        return;
    }

    try {
        const drafts = await Node.getDrafts(action, REL_HOME, "posting-update" as const, action.context.ownerName, id);
        if (drafts.length > 0) {
            dispatch(composeDraftLoaded(drafts[0]).causedBy(action));
        }
        const posting = await Node.getPosting(action, REL_CURRENT, id, true, ["posting.not-found"]);
        dispatch(composePostingLoaded(posting).causedBy(action));
    } catch (e) {
        dispatch(composePostingLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function composePostSaga(action: WithContext<ComposePostAction>): Promise<void> {
    const {id, postingText, postingSourceText, captions, compressionPending, prevState} = action.payload;

    const ownerName = select(getOwnerName);
    if (ownerName == null) {
        return;
    }

    try {
        if (!compressionPending) {
            let posting;
            if (id == null) {
                posting = await Node.createPosting(action, REL_CURRENT, postingText);
            } else {
                posting = await Node.updatePosting(action, REL_CURRENT, id, postingText);
            }
            await updateMediaCaptions(action, REL_CURRENT, posting.media, captions);
            dispatch(composePostSucceeded(posting).causedBy(action));
        } else {
            if (id == null) {
                await Node.createRemotePosting(action, REL_HOME, ownerName, postingSourceText);
            } else {
                await Node.updateRemotePosting(action, REL_HOME, ownerName, id, postingText);
            }
            dispatch(composePostedAsync(id).causedBy(action));
            dispatch(flashBox(i18n.t("video-post-being-processed")).causedBy(action));
        }

        if (id != null) {
            const hideComments = postingText.commentOperations?.view === "private";
            if (hideComments !== prevState.hideComments) {
                await Node.updateAllComments(action, REL_CURRENT, id, {
                    seniorOperations: {
                        view: postingText.commentOperations?.view
                    }
                });
            }
        }
    } catch (e) {
        dispatch(composePostFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function composePostedAsyncSaga(action: WithContext<ComposePostedAsyncAction>): Promise<void> {
    const {postingId} = action.payload;
    if (postingId != null) {
        dispatch(jumpNear(ut`/post/${postingId}`, null, null).causedBy(action));
        return;
    }

    const anchor = select(state => getFeedState(state, REL_CURRENT, "timeline").anchor);
    const href = anchor != null ? `/timeline?before=${anchor}` : "/timeline";
    dispatch(jumpNear(href, null, null).causedBy(action));
}

async function composeDraftLoadSaga(action: WithContext<ComposeDraftLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    const id = select(getComposeDraftId);
    if (id == null) {
        dispatch(composeDraftLoadFailed().causedBy(action));
        return;
    }

    try {
        const draft = await Node.getDraft(action, REL_HOME, id, ["draft.not-found"]);
        dispatch(composeDraftLoaded(draft).causedBy(action));
        dispatch(composeDraftListItemSet(id, draft).causedBy(action));
        loadRemoteMediaInDraftAttachments(action, draft.media);
    } catch (e) {
        dispatch(composeDraftLoadFailed().causedBy(action));
        if (e instanceof NodeApiError) {
            dispatch(flashBox(i18n.t("draft-not-found")).causedBy(action));
        } else {
            dispatch(errorThrown(e));
        }
        dispatch(composeDraftSelect(null));
    }
}

async function composeDraftSaveSaga(action: WithContext<ComposeDraftSaveAction>): Promise<void> {
    const {draftId, draftText} = action.payload;

    try {
        let draft;
        if (draftId == null) {
            draft = await Node.createDraft(action, REL_HOME, draftText);
        } else {
            draft = await Node.updateDraft(action, REL_HOME, draftId, draftText, ["draft.not-found"]);
        }
        if (draftText.receiverPostingId == null) {
            dispatch(composeDraftListItemSet(draft.id, draft).causedBy(action));
        }
        dispatch(composeDraftSaved(draftText.receiverPostingId ?? null, draft).causedBy(action));
    } catch (e) {
        dispatch(composeDraftSaveFailed().causedBy(action));
        if (!(e instanceof NodeApiError)) {
            dispatch(errorThrown(e));
        }
    }
}

async function composeDraftDeleteSaga(action: WithContext<ComposeDraftDeleteAction>): Promise<void> {
    const {draftId, editing} = select(state => ({
        draftId: getComposeDraftId(state),
        editing: isComposePostingEditing(state)
    }));
    if (draftId == null) {
        return;
    }
    await deleteDraft(action, draftId);
    if (!editing) {
        dispatch(composeDraftListItemDeleted(draftId, true).causedBy(action));
    }

}

async function composeDraftListLoadSaga(action: WithContext<ComposeDraftListLoadAction>): Promise<void> {
    await mutuallyIntroduced();
    if (action.context.ownerName == null) {
        dispatch(composeDraftListLoadFailed().causedBy(action));
        return;
    }

    try {
        const drafts = await Node.getDrafts(action, REL_HOME, "new-posting" as const, action.context.ownerName);
        dispatch(composeDraftListLoaded(drafts).causedBy(action));
    } catch (e) {
        dispatch(composeDraftListLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function composeDraftListItemReloadSaga(action: WithContext<ComposeDraftListItemReloadAction>): Promise<void> {
    try {
        const draft = await Node.getDraft(action, REL_HOME, action.payload.id, ["draft.not-found"]);
        dispatch(composeDraftListItemSet(draft.id, draft).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function composeDraftListItemDeleteSaga(action: WithContext<ComposeDraftListItemDeleteAction>): Promise<void> {
    const {id, resetForm} = action.payload;

    try {
        await deleteDraft(action, id);
        dispatch(composeDraftListItemDeleted(id, resetForm).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(composeDraftListItemDeleted(id, resetForm).causedBy(action));
        } else {
            dispatch(errorThrown(e));
        }
    }
}

async function composeUpdateDraftDeleteSaga(action: WithContext<ComposeUpdateDraftDeleteAction>): Promise<void> {
    const id = select(getComposeDraftId);
    if (id == null) {
        return;
    }

    try {
        await deleteDraft(action, id);
        dispatch(composeDraftUnset(action.payload.resetForm).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(composeDraftUnset(action.payload.resetForm).causedBy(action));
        }
        dispatch(errorThrown(e));
    }
}

function composeSharedTextLoadSaga(action: ComposeSharedTextLoadAction): void {
    if (!window.Android) {
        dispatch(composeSharedTextAbsent().causedBy(action));
        return;
    }
    const text = window.Android.getSharedText();
    const type = window.Android.getSharedTextType();
    if (text != null) {
        dispatch(composeSharedTextSet(text, type).causedBy(action));
    } else {
        dispatch(composeSharedTextAbsent().causedBy(action));
    }
}
