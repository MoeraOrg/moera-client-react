import { DraftInfo, DraftText, PostingFeatures, PostingInfo, PostingText } from "api/node/api-types";
import { ActionBase, ActionWithPayload } from "state/action-base";

export const COMPOSE_FEATURES_LOAD = "COMPOSE_FEATURES_LOAD";
type ComposeFeaturesLoadAction = ActionBase<typeof COMPOSE_FEATURES_LOAD>;
export const composeFeaturesLoad = (): ComposeFeaturesLoadAction => ({
    type: COMPOSE_FEATURES_LOAD
});

export const COMPOSE_FEATURES_LOADED = "COMPOSE_FEATURES_LOADED";
type ComposeFeaturesLoadedAction = ActionBase<typeof COMPOSE_FEATURES_LOADED>;
export const composeFeaturesLoaded = (features: PostingFeatures) => ({
    type: COMPOSE_FEATURES_LOADED,
    payload: {features}
});

export const COMPOSE_FEATURES_LOAD_FAILED = "COMPOSE_FEATURES_LOAD_FAILED";
type ComposeFeaturesLoadFailedAction = ActionBase<typeof COMPOSE_FEATURES_LOAD_FAILED>;
export const composeFeaturesLoadFailed = (): ComposeFeaturesLoadFailedAction => ({
    type: COMPOSE_FEATURES_LOAD_FAILED
});

export const COMPOSE_FEATURES_UNSET = "COMPOSE_FEATURES_UNSET";
type ComposeFeaturesUnsetAction = ActionBase<typeof COMPOSE_FEATURES_UNSET>;
export const composeFeaturesUnset = (): ComposeFeaturesUnsetAction => ({
    type: COMPOSE_FEATURES_UNSET
});

export const COMPOSE_POSTING_LOAD = "COMPOSE_POSTING_LOAD";
type ComposePostingLoadAction = ActionBase<typeof COMPOSE_POSTING_LOAD>;
export const composePostingLoad = (): ComposePostingLoadAction => ({
    type: COMPOSE_POSTING_LOAD
});

export const COMPOSE_POSTING_LOADED = "COMPOSE_POSTING_LOADED";
type ComposePostingLoadedAction = ActionWithPayload<typeof COMPOSE_POSTING_LOADED, {
    posting: PostingInfo;
}>;
export const composePostingLoaded = (posting: PostingInfo): ComposePostingLoadedAction => ({
    type: COMPOSE_POSTING_LOADED,
    payload: {posting}
});

export const COMPOSE_POSTING_LOAD_FAILED = "COMPOSE_POSTING_LOAD_FAILED";
type ComposePostingLoadFailedAction = ActionBase<typeof COMPOSE_POSTING_LOAD_FAILED>;
export const composePostingLoadFailed = (): ComposePostingLoadFailedAction => ({
    type: COMPOSE_POSTING_LOAD_FAILED
});

export const COMPOSE_CONFLICT = "COMPOSE_CONFLICT";
type ComposeConflictAction = ActionBase<typeof COMPOSE_CONFLICT>;
export const composeConflict = (): ComposeConflictAction => ({
    type: COMPOSE_CONFLICT
});

export const COMPOSE_CONFLICT_CLOSE = "COMPOSE_CONFLICT_CLOSE";
type ComposeConflictCloseAction = ActionBase<typeof COMPOSE_CONFLICT_CLOSE>;
export const composeConflictClose = (): ComposeConflictCloseAction => ({
    type: COMPOSE_CONFLICT_CLOSE
});

export const COMPOSE_POST = "COMPOSE_POST";
type ComposePostAction = ActionWithPayload<typeof COMPOSE_POST, {
    id: string;
    draftId: string;
    postingText: PostingText;
}>;
export const composePost = (id: string, draftId: string, postingText: PostingText): ComposePostAction => ({
    type: COMPOSE_POST,
    payload: {id, draftId, postingText}
});

export const COMPOSE_POST_SUCCEEDED = "COMPOSE_POST_SUCCEEDED";
type ComposePostSucceededAction = ActionWithPayload<typeof COMPOSE_POST_SUCCEEDED, {
    posting: PostingInfo;
}>;
export const composePostSucceeded = (posting: PostingInfo): ComposePostSucceededAction => ({
    type: COMPOSE_POST_SUCCEEDED,
    payload: {posting}
});

export const COMPOSE_POST_FAILED = "COMPOSE_POST_FAILED";
type ComposePostFailedAction = ActionBase<typeof COMPOSE_POST_FAILED>;
export const composePostFailed = (): ComposePostFailedAction => ({
    type: COMPOSE_POST_FAILED
});

export const COMPOSE_DRAFT_LOAD = "COMPOSE_DRAFT_LOAD";
type ComposeDraftLoadAction = ActionBase<typeof COMPOSE_DRAFT_LOAD>;
export const composeDraftLoad = (): ComposeDraftLoadAction => ({
    type: COMPOSE_DRAFT_LOAD
});

export const COMPOSE_DRAFT_LOADED = "COMPOSE_DRAFT_LOADED";
type ComposeDraftLoadedAction = ActionWithPayload<typeof COMPOSE_DRAFT_LOADED, {
    draft: DraftInfo;
}>;
export const composeDraftLoaded = (draft: DraftInfo): ComposeDraftLoadedAction => ({
    type: COMPOSE_DRAFT_LOADED,
    payload: {draft}
});

export const COMPOSE_DRAFT_LOAD_FAILED = "COMPOSE_DRAFT_LOAD_FAILED";
type ComposeDraftLoadFailedAction = ActionBase<typeof COMPOSE_DRAFT_LOAD_FAILED>;
export const composeDraftLoadFailed = (): ComposeDraftLoadFailedAction => ({
    type: COMPOSE_DRAFT_LOAD_FAILED
});

export const COMPOSE_DRAFT_SAVE = "COMPOSE_DRAFT_SAVE";
type ComposeDraftSaveAction = ActionWithPayload<typeof COMPOSE_DRAFT_SAVE, {
    draftText: DraftText;
}>;
export const composeDraftSave = (draftText: DraftText): ComposeDraftSaveAction => ({
    type: COMPOSE_DRAFT_SAVE,
    payload: {draftText}
});

export const COMPOSE_DRAFT_SAVED = "COMPOSE_DRAFT_SAVED";
type ComposeDraftSavedAction = ActionWithPayload<typeof COMPOSE_DRAFT_SAVED, {
    postingId: string;
    draftId: string;
}>;
export const composeDraftSaved = (postingId: string, draftId: string): ComposeDraftSavedAction => ({
    type: COMPOSE_DRAFT_SAVED,
    payload: {postingId, draftId}
});

export const COMPOSE_DRAFT_SAVE_FAILED = "COMPOSE_DRAFT_SAVE_FAILED";
type ComposeDraftSaveFailedAction = ActionBase<typeof COMPOSE_DRAFT_SAVE_FAILED>;
export const composeDraftSaveFailed = (): ComposeDraftSaveFailedAction => ({
    type: COMPOSE_DRAFT_SAVE_FAILED
});

export const COMPOSE_DRAFT_UNSET = "COMPOSE_DRAFT_UNSET";
type ComposeDraftUnsetAction = ActionBase<typeof COMPOSE_DRAFT_UNSET>;
export const composeDraftUnset = (): ComposeDraftUnsetAction => ({
    type: COMPOSE_DRAFT_UNSET
});

export const COMPOSE_DRAFT_LIST_LOAD = "COMPOSE_DRAFT_LIST_LOAD";
type ComposeDraftListLoadAction = ActionBase<typeof COMPOSE_DRAFT_LIST_LOAD>;
export const composeDraftListLoad = (): ComposeDraftListLoadAction => ({
    type: COMPOSE_DRAFT_LIST_LOAD
});

export const COMPOSE_DRAFT_LIST_LOADED = "COMPOSE_DRAFT_LIST_LOADED";
type ComposeDraftListLoadedAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_LOADED, {
    draftList: DraftInfo[];
}>;
export const composeDraftListLoaded = (draftList: DraftInfo[]): ComposeDraftListLoadedAction => ({
    type: COMPOSE_DRAFT_LIST_LOADED,
    payload: {draftList}
});

export const COMPOSE_DRAFT_LIST_LOAD_FAILED = "COMPOSE_DRAFT_LIST_LOAD_FAILED";
type ComposeDraftListLoadFailedAction = ActionBase<typeof COMPOSE_DRAFT_LIST_LOAD_FAILED>;
export const composeDraftListLoadFailed = (): ComposeDraftListLoadFailedAction => ({
    type: COMPOSE_DRAFT_LIST_LOAD_FAILED
});

export const COMPOSE_DRAFT_SELECT = "COMPOSE_DRAFT_SELECT";
type ComposeDraftSelectAction = ActionWithPayload<typeof COMPOSE_DRAFT_SELECT, {
    id: string;
}>;
export const composeDraftSelect = (id: string): ComposeDraftSelectAction => ({
    type: COMPOSE_DRAFT_SELECT,
    payload: {id}
});

export const COMPOSE_DRAFT_LIST_ITEM_RELOAD = "COMPOSE_DRAFT_LIST_ITEM_RELOAD";
type ComposeDraftListItemReloadAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_ITEM_RELOAD, {
    id: string;
}>;
export const composeDraftListItemReload = (id: string): ComposeDraftListItemReloadAction => ({
    type: COMPOSE_DRAFT_LIST_ITEM_RELOAD,
    payload: {id}
});

export const COMPOSE_DRAFT_LIST_ITEM_SET = "COMPOSE_DRAFT_LIST_ITEM_SET";
type ComposeDraftListItemSetAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_ITEM_SET, {
    id: string;
    draft: DraftInfo;
}>;
export const composeDraftListItemSet = (id: string, draft: DraftInfo): ComposeDraftListItemSetAction => ({
    type: COMPOSE_DRAFT_LIST_ITEM_SET,
    payload: {id, draft}
});

export const COMPOSE_DRAFT_LIST_ITEM_DELETE = "COMPOSE_DRAFT_LIST_ITEM_DELETE";
type ComposeDraftListItemDeleteAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_ITEM_DELETE, {
    id: string;
}>;
export const composeDraftListItemDelete = (id: string): ComposeDraftListItemDeleteAction => ({
    type: COMPOSE_DRAFT_LIST_ITEM_DELETE,
    payload: {id}
});

export const COMPOSE_DRAFT_LIST_ITEM_DELETED = "COMPOSE_DRAFT_LIST_ITEM_DELETED";
type ComposeDraftListItemDeletedAction = ActionWithPayload<typeof COMPOSE_DRAFT_LIST_ITEM_DELETED, {
    id: string;
}>;
export const composeDraftListItemDeleted = (id: string): ComposeDraftListItemDeletedAction => ({
    type: COMPOSE_DRAFT_LIST_ITEM_DELETED,
    payload: {id}
});

export const COMPOSE_DRAFT_REVISION_DELETE = "COMPOSE_DRAFT_REVISION_DELETE";
type ComposeDraftRevisionDeleteAction = ActionBase<typeof COMPOSE_DRAFT_REVISION_DELETE>;
export const composeDraftRevisionDelete = (): ComposeDraftRevisionDeleteAction => ({
    type: COMPOSE_DRAFT_REVISION_DELETE
});

export const COMPOSE_PREVIEW = "COMPOSE_PREVIEW";
type ComposePreviewAction = ActionBase<typeof COMPOSE_PREVIEW>;
export const composePreview = (): ComposePreviewAction => ({
    type: COMPOSE_PREVIEW
});

export const COMPOSE_PREVIEW_CLOSE = "COMPOSE_PREVIEW_CLOSE";
type ComposePreviewCloseAction = ActionBase<typeof COMPOSE_PREVIEW_CLOSE>;
export const composePreviewClose = (): ComposePreviewCloseAction => ({
    type: COMPOSE_PREVIEW_CLOSE
});

export const COMPOSE_SHARED_TEXT_LOAD = "COMPOSE_SHARED_TEXT_LOAD";
type ComposeSharedTextLoadAction = ActionBase<typeof COMPOSE_SHARED_TEXT_LOAD>;
export const composeSharedTextLoad = (): ComposeSharedTextLoadAction => ({
    type: COMPOSE_SHARED_TEXT_LOAD
});

export const COMPOSE_SHARED_TEXT_SET = "COMPOSE_SHARED_TEXT_SET";
type ComposeSharedTextSetAction = ActionWithPayload<typeof COMPOSE_SHARED_TEXT_SET, {
    text: string;
    type: SharedTextType;
}>;
export const composeSharedTextSet = (text: string, type: SharedTextType): ComposeSharedTextSetAction => ({
    type: COMPOSE_SHARED_TEXT_SET,
    payload: {text, type}
});

export type ComposeAnyAction =
    ComposeFeaturesLoadAction
    | ComposeFeaturesLoadedAction
    | ComposeFeaturesLoadFailedAction
    | ComposeFeaturesUnsetAction
    | ComposePostingLoadAction
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
    | ComposeDraftUnsetAction
    | ComposeDraftListLoadAction
    | ComposeDraftListLoadedAction
    | ComposeDraftListLoadFailedAction
    | ComposeDraftSelectAction
    | ComposeDraftListItemReloadAction
    | ComposeDraftListItemSetAction
    | ComposeDraftListItemDeleteAction
    | ComposeDraftListItemDeletedAction
    | ComposeDraftRevisionDeleteAction
    | ComposePreviewAction
    | ComposePreviewCloseAction
    | ComposeSharedTextLoadAction
    | ComposeSharedTextSetAction;
