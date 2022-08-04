import { Action } from 'redux';

import { DraftInfo, DraftText, PostingInfo, PostingText } from "api/node/api-types";
import { ActionWithPayload } from "state/action-types";

export const COMPOSE_POSTING_LOAD = "COMPOSE_POSTING_LOAD";
export type ComposePostingLoadAction = Action<typeof COMPOSE_POSTING_LOAD>;
export const composePostingLoad = (): ComposePostingLoadAction => ({
    type: COMPOSE_POSTING_LOAD
});

export const COMPOSE_POSTING_LOADED = "COMPOSE_POSTING_LOADED";
export type ComposePostingLoadedAction = ActionWithPayload<typeof COMPOSE_POSTING_LOADED, {
    posting: PostingInfo;
}>;
export const composePostingLoaded = (posting: PostingInfo): ComposePostingLoadedAction => ({
    type: COMPOSE_POSTING_LOADED,
    payload: {posting}
});

export const COMPOSE_POSTING_LOAD_FAILED = "COMPOSE_POSTING_LOAD_FAILED";
export type ComposePostingLoadFailedAction = Action<typeof COMPOSE_POSTING_LOAD_FAILED>;
export const composePostingLoadFailed = (): ComposePostingLoadFailedAction => ({
    type: COMPOSE_POSTING_LOAD_FAILED
});

export const COMPOSE_CONFLICT = "COMPOSE_CONFLICT";
export type ComposeConflictAction = Action<typeof COMPOSE_CONFLICT>;
export const composeConflict = (): ComposeConflictAction => ({
    type: COMPOSE_CONFLICT
});

export const COMPOSE_CONFLICT_CLOSE = "COMPOSE_CONFLICT_CLOSE";
export type ComposeConflictCloseAction = Action<typeof COMPOSE_CONFLICT_CLOSE>;
export const composeConflictClose = (): ComposeConflictCloseAction => ({
    type: COMPOSE_CONFLICT_CLOSE
});

export const COMPOSE_POST = "COMPOSE_POST";
interface ComposePostPrevState {
    hideComments: boolean;
}
export type ComposePostAction = ActionWithPayload<typeof COMPOSE_POST, {
    id: string | null;
    postingText: PostingText;
    prevState: ComposePostPrevState;
}>;
export const composePost = (id: string | null, postingText: PostingText,
                            prevState: ComposePostPrevState): ComposePostAction => ({
    type: COMPOSE_POST,
    payload: {id, postingText, prevState}
});

export const COMPOSE_POST_SUCCEEDED = "COMPOSE_POST_SUCCEEDED";
export type ComposePostSucceededAction = ActionWithPayload<typeof COMPOSE_POST_SUCCEEDED, {
    posting: PostingInfo;
}>;
export const composePostSucceeded = (posting: PostingInfo): ComposePostSucceededAction => ({
    type: COMPOSE_POST_SUCCEEDED,
    payload: {posting}
});

export const COMPOSE_POST_FAILED = "COMPOSE_POST_FAILED";
export type ComposePostFailedAction = Action<typeof COMPOSE_POST_FAILED>;
export const composePostFailed = (): ComposePostFailedAction => ({
    type: COMPOSE_POST_FAILED
});

export const COMPOSE_DRAFT_LOAD = "COMPOSE_DRAFT_LOAD";
export type ComposeDraftLoadAction = Action<typeof COMPOSE_DRAFT_LOAD>;
export const composeDraftLoad = (): ComposeDraftLoadAction => ({
    type: COMPOSE_DRAFT_LOAD
});

export const COMPOSE_DRAFT_LOADED = "COMPOSE_DRAFT_LOADED";
export type ComposeDraftLoadedAction = ActionWithPayload<typeof COMPOSE_DRAFT_LOADED, {
    draft: DraftInfo;
}>;
export const composeDraftLoaded = (draft: DraftInfo): ComposeDraftLoadedAction => ({
    type: COMPOSE_DRAFT_LOADED,
    payload: {draft}
});

export const COMPOSE_DRAFT_LOAD_FAILED = "COMPOSE_DRAFT_LOAD_FAILED";
export type ComposeDraftLoadFailedAction = Action<typeof COMPOSE_DRAFT_LOAD_FAILED>;
export const composeDraftLoadFailed = (): ComposeDraftLoadFailedAction => ({
    type: COMPOSE_DRAFT_LOAD_FAILED
});

export const COMPOSE_DRAFT_SAVE = "COMPOSE_DRAFT_SAVE";
export type ComposeDraftSaveAction = ActionWithPayload<typeof COMPOSE_DRAFT_SAVE, {
    draftId: string | null;
    draftText: DraftText;
}>;
export const composeDraftSave = (draftId: string | null, draftText: DraftText): ComposeDraftSaveAction => ({
    type: COMPOSE_DRAFT_SAVE,
    payload: {draftId, draftText}
});

export const COMPOSE_DRAFT_SAVED = "COMPOSE_DRAFT_SAVED";
export type ComposeDraftSavedAction = ActionWithPayload<typeof COMPOSE_DRAFT_SAVED, {
    postingId: string | null;
    draft: DraftInfo;
}>;
export const composeDraftSaved = (postingId: string | null, draft: DraftInfo): ComposeDraftSavedAction => ({
    type: COMPOSE_DRAFT_SAVED,
    payload: {postingId, draft}
});

export const COMPOSE_DRAFT_SAVE_FAILED = "COMPOSE_DRAFT_SAVE_FAILED";
export type ComposeDraftSaveFailedAction = Action<typeof COMPOSE_DRAFT_SAVE_FAILED>;
export const composeDraftSaveFailed = (): ComposeDraftSaveFailedAction => ({
    type: COMPOSE_DRAFT_SAVE_FAILED
});

export const COMPOSE_DRAFT_DELETE = "COMPOSE_DRAFT_DELETE";
export type ComposeDraftDeleteAction = Action<typeof COMPOSE_DRAFT_DELETE>;
export const composeDraftDelete = (): ComposeDraftDeleteAction => ({
    type: COMPOSE_DRAFT_DELETE
});

export const COMPOSE_DRAFT_UNSET = "COMPOSE_DRAFT_UNSET";
export type ComposeDraftUnsetAction = ActionWithPayload<typeof COMPOSE_DRAFT_UNSET, {
    resetForm: boolean;
}>;
export const composeDraftUnset = (resetForm: boolean): ComposeDraftUnsetAction => ({
    type: COMPOSE_DRAFT_UNSET,
    payload: {resetForm}
});

export const COMPOSE_DRAFT_LIST_LOAD = "COMPOSE_DRAFT_LIST_LOAD";
export type ComposeDraftListLoadAction = Action<typeof COMPOSE_DRAFT_LIST_LOAD>;
export const composeDraftListLoad = (): ComposeDraftListLoadAction => ({
    type: COMPOSE_DRAFT_LIST_LOAD
});

export const COMPOSE_DRAFT_LIST_LOADED = "COMPOSE_DRAFT_LIST_LOADED";
export type ComposeDraftListLoadedAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_LOADED, {
    draftList: DraftInfo[];
}>;
export const composeDraftListLoaded = (draftList: DraftInfo[]): ComposeDraftListLoadedAction => ({
    type: COMPOSE_DRAFT_LIST_LOADED,
    payload: {draftList}
});

export const COMPOSE_DRAFT_LIST_LOAD_FAILED = "COMPOSE_DRAFT_LIST_LOAD_FAILED";
export type ComposeDraftListLoadFailedAction = Action<typeof COMPOSE_DRAFT_LIST_LOAD_FAILED>;
export const composeDraftListLoadFailed = (): ComposeDraftListLoadFailedAction => ({
    type: COMPOSE_DRAFT_LIST_LOAD_FAILED
});

export const COMPOSE_DRAFT_SELECT = "COMPOSE_DRAFT_SELECT";
export type ComposeDraftSelectAction = ActionWithPayload<typeof COMPOSE_DRAFT_SELECT, {
    id: string | null;
}>;
export const composeDraftSelect = (id: string | null): ComposeDraftSelectAction => ({
    type: COMPOSE_DRAFT_SELECT,
    payload: {id}
});

export const COMPOSE_DRAFT_LIST_ITEM_RELOAD = "COMPOSE_DRAFT_LIST_ITEM_RELOAD";
export type ComposeDraftListItemReloadAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_ITEM_RELOAD, {
    id: string;
}>;
export const composeDraftListItemReload = (id: string): ComposeDraftListItemReloadAction => ({
    type: COMPOSE_DRAFT_LIST_ITEM_RELOAD,
    payload: {id}
});

export const COMPOSE_DRAFT_LIST_ITEM_SET = "COMPOSE_DRAFT_LIST_ITEM_SET";
export type ComposeDraftListItemSetAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_ITEM_SET, {
    id: string;
    draft: DraftInfo;
}>;
export const composeDraftListItemSet = (id: string, draft: DraftInfo): ComposeDraftListItemSetAction => ({
    type: COMPOSE_DRAFT_LIST_ITEM_SET,
    payload: {id, draft}
});

export const COMPOSE_DRAFT_LIST_ITEM_DELETE = "COMPOSE_DRAFT_LIST_ITEM_DELETE";
export type ComposeDraftListItemDeleteAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_ITEM_DELETE, {
    id: string;
}>;
export const composeDraftListItemDelete = (id: string): ComposeDraftListItemDeleteAction => ({
    type: COMPOSE_DRAFT_LIST_ITEM_DELETE,
    payload: {id}
});

export const COMPOSE_DRAFT_LIST_ITEM_DELETED = "COMPOSE_DRAFT_LIST_ITEM_DELETED";
export type ComposeDraftListItemDeletedAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_ITEM_DELETED, {
    id: string;
}>;
export const composeDraftListItemDeleted = (id: string): ComposeDraftListItemDeletedAction => ({
    type: COMPOSE_DRAFT_LIST_ITEM_DELETED,
    payload: {id}
});

export const COMPOSE_UPDATE_DRAFT_DELETE = "COMPOSE_UPDATE_DRAFT_DELETE";
export type ComposeUpdateDraftDeleteAction = ActionWithPayload<typeof COMPOSE_UPDATE_DRAFT_DELETE, {
    resetForm: boolean
}>;
export const composeUpdateDraftDelete = (resetForm: boolean): ComposeUpdateDraftDeleteAction => ({
    type: COMPOSE_UPDATE_DRAFT_DELETE,
    payload: {resetForm}
});

export const COMPOSE_PREVIEW = "COMPOSE_PREVIEW";
export type ComposePreviewAction = Action<typeof COMPOSE_PREVIEW>;
export const composePreview = (): ComposePreviewAction => ({
    type: COMPOSE_PREVIEW
});

export const COMPOSE_PREVIEW_CLOSE = "COMPOSE_PREVIEW_CLOSE";
export type ComposePreviewCloseAction = Action<typeof COMPOSE_PREVIEW_CLOSE>;
export const composePreviewClose = (): ComposePreviewCloseAction => ({
    type: COMPOSE_PREVIEW_CLOSE
});

export const COMPOSE_SHARED_TEXT_LOAD = "COMPOSE_SHARED_TEXT_LOAD";
export type ComposeSharedTextLoadAction = Action<typeof COMPOSE_SHARED_TEXT_LOAD>;
export const composeSharedTextLoad = (): ComposeSharedTextLoadAction => ({
    type: COMPOSE_SHARED_TEXT_LOAD
});

export const COMPOSE_SHARED_TEXT_SET = "COMPOSE_SHARED_TEXT_SET";
export type ComposeSharedTextSetAction = ActionWithPayload<typeof COMPOSE_SHARED_TEXT_SET, {
    text: string;
    type: SharedTextType;
}>;
export const composeSharedTextSet = (text: string, type: SharedTextType): ComposeSharedTextSetAction => ({
    type: COMPOSE_SHARED_TEXT_SET,
    payload: {text, type}
});

export type ComposeAnyAction =
    ComposePostingLoadAction
    | ComposePostingLoadedAction
    | ComposePostingLoadFailedAction
    | ComposeConflictAction
    | ComposeConflictCloseAction
    | ComposePostAction
    | ComposePostSucceededAction
    | ComposePostFailedAction
    | ComposeDraftLoadAction
    | ComposeDraftLoadedAction
    | ComposeDraftLoadFailedAction
    | ComposeDraftSaveAction
    | ComposeDraftSavedAction
    | ComposeDraftSaveFailedAction
    | ComposeDraftDeleteAction
    | ComposeDraftUnsetAction
    | ComposeDraftListLoadAction
    | ComposeDraftListLoadedAction
    | ComposeDraftListLoadFailedAction
    | ComposeDraftSelectAction
    | ComposeDraftListItemReloadAction
    | ComposeDraftListItemSetAction
    | ComposeDraftListItemDeleteAction
    | ComposeDraftListItemDeletedAction
    | ComposeUpdateDraftDeleteAction
    | ComposePreviewAction
    | ComposePreviewCloseAction
    | ComposeSharedTextLoadAction
    | ComposeSharedTextSetAction;
