import { DraftInfo, DraftText, PostingInfo, PostingText } from "api";
import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type ComposePostingLoadAction = ActionWithoutPayload<"COMPOSE_POSTING_LOAD">;
export const composePostingLoad = (): ComposePostingLoadAction =>
    actionWithoutPayload("COMPOSE_POSTING_LOAD");

export type ComposePostingLoadedAction = ActionWithPayload<"COMPOSE_POSTING_LOADED", {
    posting: PostingInfo;
}>;
export const composePostingLoaded = (posting: PostingInfo): ComposePostingLoadedAction =>
    actionWithPayload("COMPOSE_POSTING_LOADED", {posting});

export type ComposePostingLoadFailedAction = ActionWithoutPayload<"COMPOSE_POSTING_LOAD_FAILED">;
export const composePostingLoadFailed = (): ComposePostingLoadFailedAction =>
    actionWithoutPayload("COMPOSE_POSTING_LOAD_FAILED");

export type ComposeConflictAction = ActionWithoutPayload<"COMPOSE_CONFLICT">;
export const composeConflict = (): ComposeConflictAction =>
    actionWithoutPayload("COMPOSE_CONFLICT");

export type ComposeConflictCloseAction = ActionWithoutPayload<"COMPOSE_CONFLICT_CLOSE">;
export const composeConflictClose = (): ComposeConflictCloseAction =>
    actionWithoutPayload("COMPOSE_CONFLICT_CLOSE");

interface ComposePostPrevState {
    hideComments: boolean;
}
export type ComposePostAction = ActionWithPayload<"COMPOSE_POST", {
    id: string | null;
    postingText: PostingText;
    prevState: ComposePostPrevState;
}>;
export const composePost = (
    id: string | null, postingText: PostingText, prevState: ComposePostPrevState
): ComposePostAction =>
    actionWithPayload("COMPOSE_POST", {id, postingText, prevState});

export type ComposePostSucceededAction = ActionWithPayload<"COMPOSE_POST_SUCCEEDED", {
    posting: PostingInfo;
}>;
export const composePostSucceeded = (posting: PostingInfo): ComposePostSucceededAction =>
    actionWithPayload("COMPOSE_POST_SUCCEEDED", {posting});

export type ComposePostFailedAction = ActionWithoutPayload<"COMPOSE_POST_FAILED">;
export const composePostFailed = (): ComposePostFailedAction =>
    actionWithoutPayload("COMPOSE_POST_FAILED");

export type ComposeDraftLoadAction = ActionWithoutPayload<"COMPOSE_DRAFT_LOAD">;
export const composeDraftLoad = (): ComposeDraftLoadAction =>
    actionWithoutPayload("COMPOSE_DRAFT_LOAD");

export type ComposeDraftLoadedAction = ActionWithPayload<"COMPOSE_DRAFT_LOADED", {
    draft: DraftInfo;
}>;
export const composeDraftLoaded = (draft: DraftInfo): ComposeDraftLoadedAction =>
    actionWithPayload("COMPOSE_DRAFT_LOADED", {draft});

export type ComposeDraftLoadFailedAction = ActionWithoutPayload<"COMPOSE_DRAFT_LOAD_FAILED">;
export const composeDraftLoadFailed = (): ComposeDraftLoadFailedAction =>
    actionWithoutPayload("COMPOSE_DRAFT_LOAD_FAILED");

export type ComposeDraftSaveAction = ActionWithPayload<"COMPOSE_DRAFT_SAVE", {
    draftId: string | null;
    draftText: DraftText;
}>;
export const composeDraftSave = (draftId: string | null, draftText: DraftText): ComposeDraftSaveAction =>
    actionWithPayload("COMPOSE_DRAFT_SAVE", {draftId, draftText});

export type ComposeDraftSavedAction = ActionWithPayload<"COMPOSE_DRAFT_SAVED", {
    postingId: string | null;
    draft: DraftInfo;
}>;
export const composeDraftSaved = (postingId: string | null, draft: DraftInfo): ComposeDraftSavedAction =>
    actionWithPayload("COMPOSE_DRAFT_SAVED", {postingId, draft});

export type ComposeDraftSaveFailedAction = ActionWithoutPayload<"COMPOSE_DRAFT_SAVE_FAILED">;
export const composeDraftSaveFailed = (): ComposeDraftSaveFailedAction =>
    actionWithoutPayload("COMPOSE_DRAFT_SAVE_FAILED");

export type ComposeDraftDeleteAction = ActionWithoutPayload<"COMPOSE_DRAFT_DELETE">;
export const composeDraftDelete = (): ComposeDraftDeleteAction =>
    actionWithoutPayload("COMPOSE_DRAFT_DELETE");

export type ComposeDraftUnsetAction = ActionWithPayload<"COMPOSE_DRAFT_UNSET", {
    resetForm: boolean;
}>;
export const composeDraftUnset = (resetForm: boolean): ComposeDraftUnsetAction =>
    actionWithPayload("COMPOSE_DRAFT_UNSET", {resetForm});

export type ComposeDraftListLoadAction = ActionWithoutPayload<"COMPOSE_DRAFT_LIST_LOAD">;
export const composeDraftListLoad = (): ComposeDraftListLoadAction =>
    actionWithoutPayload("COMPOSE_DRAFT_LIST_LOAD");

export type ComposeDraftListLoadedAction = ActionWithPayload<"COMPOSE_DRAFT_LIST_LOADED", {
    draftList: DraftInfo[];
}>;
export const composeDraftListLoaded = (draftList: DraftInfo[]): ComposeDraftListLoadedAction =>
    actionWithPayload("COMPOSE_DRAFT_LIST_LOADED", {draftList});

export type ComposeDraftListLoadFailedAction = ActionWithoutPayload<"COMPOSE_DRAFT_LIST_LOAD_FAILED">;
export const composeDraftListLoadFailed = (): ComposeDraftListLoadFailedAction =>
    actionWithoutPayload("COMPOSE_DRAFT_LIST_LOAD_FAILED");

export type ComposeDraftSelectAction = ActionWithPayload<"COMPOSE_DRAFT_SELECT", {
    id: string | null;
}>;
export const composeDraftSelect = (id: string | null): ComposeDraftSelectAction =>
    actionWithPayload("COMPOSE_DRAFT_SELECT", {id});

export type ComposeDraftListItemReloadAction = ActionWithPayload<"COMPOSE_DRAFT_LIST_ITEM_RELOAD", {
    id: string;
}>;
export const composeDraftListItemReload = (id: string): ComposeDraftListItemReloadAction =>
    actionWithPayload("COMPOSE_DRAFT_LIST_ITEM_RELOAD", {id});

export type ComposeDraftListItemSetAction = ActionWithPayload<"COMPOSE_DRAFT_LIST_ITEM_SET", {
    id: string;
    draft: DraftInfo;
}>;
export const composeDraftListItemSet = (id: string, draft: DraftInfo): ComposeDraftListItemSetAction =>
    actionWithPayload("COMPOSE_DRAFT_LIST_ITEM_SET", {id, draft});

export type ComposeDraftListItemDeleteAction = ActionWithPayload<"COMPOSE_DRAFT_LIST_ITEM_DELETE", {
    id: string;
    resetForm: boolean;
}>;
export const composeDraftListItemDelete = (id: string, resetForm: boolean): ComposeDraftListItemDeleteAction =>
    actionWithPayload("COMPOSE_DRAFT_LIST_ITEM_DELETE", {id, resetForm});

export type ComposeDraftListItemDeletedAction = ActionWithPayload<"COMPOSE_DRAFT_LIST_ITEM_DELETED", {
    id: string;
    resetForm: boolean;
}>;
export const composeDraftListItemDeleted = (id: string, resetForm: boolean): ComposeDraftListItemDeletedAction =>
    actionWithPayload("COMPOSE_DRAFT_LIST_ITEM_DELETED", {id, resetForm});

export type ComposeUpdateDraftDeleteAction = ActionWithPayload<"COMPOSE_UPDATE_DRAFT_DELETE", {
    resetForm: boolean;
}>;
export const composeUpdateDraftDelete = (resetForm: boolean): ComposeUpdateDraftDeleteAction =>
    actionWithPayload("COMPOSE_UPDATE_DRAFT_DELETE", {resetForm});

export type ComposePreviewAction = ActionWithoutPayload<"COMPOSE_PREVIEW">;
export const composePreview = (): ComposePreviewAction =>
    actionWithoutPayload("COMPOSE_PREVIEW");

export type ComposePreviewCloseAction = ActionWithoutPayload<"COMPOSE_PREVIEW_CLOSE">;
export const composePreviewClose = (): ComposePreviewCloseAction =>
    actionWithoutPayload("COMPOSE_PREVIEW_CLOSE");

export type ComposeSharedTextLoadAction = ActionWithoutPayload<"COMPOSE_SHARED_TEXT_LOAD">;
export const composeSharedTextLoad = (): ComposeSharedTextLoadAction =>
    actionWithoutPayload("COMPOSE_SHARED_TEXT_LOAD");

export type ComposeSharedTextSetAction = ActionWithPayload<"COMPOSE_SHARED_TEXT_SET", {
    text: string;
    type: SharedTextType;
}>;
export const composeSharedTextSet = (text: string, type: SharedTextType): ComposeSharedTextSetAction =>
    actionWithPayload("COMPOSE_SHARED_TEXT_SET", {text, type});

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
