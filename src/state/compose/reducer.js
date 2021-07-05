import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import {
    COMPOSE_CONFLICT,
    COMPOSE_CONFLICT_CLOSE,
    COMPOSE_DRAFT_LIST_ITEM_DELETED,
    COMPOSE_DRAFT_LIST_ITEM_SET,
    COMPOSE_DRAFT_LIST_LOAD,
    COMPOSE_DRAFT_LIST_LOAD_FAILED,
    COMPOSE_DRAFT_LIST_LOADED,
    COMPOSE_DRAFT_LOAD,
    COMPOSE_DRAFT_LOAD_FAILED,
    COMPOSE_DRAFT_LOADED,
    COMPOSE_DRAFT_REVISION_DELETE,
    COMPOSE_DRAFT_REVISION_SET,
    COMPOSE_DRAFT_SAVE,
    COMPOSE_DRAFT_SAVE_FAILED,
    COMPOSE_DRAFT_SAVED,
    COMPOSE_DRAFT_SELECT,
    COMPOSE_FEATURES_LOAD,
    COMPOSE_FEATURES_LOAD_FAILED,
    COMPOSE_FEATURES_LOADED,
    COMPOSE_FEATURES_UNSET,
    COMPOSE_POST,
    COMPOSE_POST_FAILED,
    COMPOSE_POST_SUCCEEDED,
    COMPOSE_POSTING_LOAD,
    COMPOSE_POSTING_LOAD_FAILED,
    COMPOSE_POSTING_LOADED,
    COMPOSE_PREVIEW,
    COMPOSE_PREVIEW_CLOSE, COMPOSE_SHARED_TEXT_SET
} from "state/compose/actions";
import { GO_TO_PAGE } from "state/navigation/actions";
import { PAGE_COMPOSE } from "state/navigation/pages";

const emptyFeatures = {
    subjectPresent: false,
    sourceFormats: []
};

const emptyPosting = {
    postingId: null,
    posting: null,
    loadingPosting: false,
    conflict: false,
    beingPosted: false,
    draftId: null,
    draftRevision: null,
    loadingDraft: false,
    savingDraft: false,
    savedDraft: false,
    sharedText: null,
    sharedTextType: null
};

const initialState = {
    loadingFeatures: false,
    loadedFeatures: false,
    ...emptyFeatures,
    ...emptyPosting,
    draftList: [],
    loadingDraftList: false,
    loadedDraftList: false,
    showPreview: false
};

function buildDraftInfo(draftInfo) {
    const {bodySrc} = draftInfo;
    const source = typeof bodySrc === "string" ? JSON.parse(bodySrc) : bodySrc;

    return {
        ...draftInfo,
        subject: source.subject != null ? source.subject.substring(0, 64) : null,
        text: source.text != null ? source.text.substring(0, 256) : null,
    }
}

function sortDraftList(draftList) {
    return draftList.sort((d1, d2) => d2.editedAt - d1.editedAt);
}

function appendToDraftList(draftList, draftInfo) {
    const extDraftInfo = buildDraftInfo(draftInfo);
    const list = draftList.slice();
    const i = list.findIndex(d => d.id === extDraftInfo.id);
    if (i >= 0) {
        list[i] = extDraftInfo;
    } else {
        list.push(extDraftInfo);
    }
    return sortDraftList(list);
}

function draftToPosting(draft) {
    const posting = cloneDeep(draft);
    posting.id = draft.receiverPostingId;
    delete posting.draftType;
    delete posting.receiverName;
    delete posting.receiverPostingId;

    return posting;
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GO_TO_PAGE:
            if (action.payload.page === PAGE_COMPOSE) {
                return {
                    ...state,
                    ...emptyPosting,
                    postingId: action.payload.details.id,
                    draftId: action.payload.details.draftId
                }
            }
            return state;

        case COMPOSE_FEATURES_LOAD:
            return {
                ...state,
                loadingFeatures: true
            };

        case COMPOSE_FEATURES_LOADED:
            return {
                ...state,
                loadingFeatures: false,
                loadedFeatures: true,
                ...emptyFeatures,
                ...action.payload.features
            };

        case COMPOSE_FEATURES_LOAD_FAILED:
            return {
                ...state,
                loadingFeatures: false
            };

        case COMPOSE_FEATURES_UNSET:
            return {
                ...state,
                loadingFeatures: false,
                loadedFeatures: false,
                ...emptyFeatures
            };

        case COMPOSE_POSTING_LOAD:
            return {
                ...state,
                loadingPosting: true
            };

        case COMPOSE_POSTING_LOADED:
            return {
                ...state,
                posting: action.payload.posting,
                draftRevision: cloneDeep(action.payload.posting),
                loadingPosting: false
            };

        case COMPOSE_POSTING_LOAD_FAILED:
            return {
                ...state,
                loadingPosting: false
            };

        case COMPOSE_CONFLICT:
            return {
                ...state,
                conflict: true
            };

        case COMPOSE_CONFLICT_CLOSE:
            return {
                ...state,
                conflict: false
            };

        case COMPOSE_POST:
            return {
                ...state,
                beingPosted: true
            };

        case COMPOSE_POST_SUCCEEDED:
        case COMPOSE_POST_FAILED:
            return {
                ...state,
                beingPosted: false
            };

        case COMPOSE_DRAFT_LOAD:
            return {
                ...state,
                loadingDraft: true
            };

        case COMPOSE_DRAFT_LOADED:
            return {
                ...state,
                posting: draftToPosting(action.payload.draft),
                loadingDraft: false
            };

        case COMPOSE_DRAFT_LOAD_FAILED:
            return {
                ...state,
                loadingDraft: false
            };

        case COMPOSE_DRAFT_SAVE:
            return {
                ...state,
                savingDraft: true,
                savedDraft: false
            };

        case COMPOSE_DRAFT_SAVED:
            if (action.payload.postingId === state.postingId) {
                return {
                    ...state,
                    posting: state.postingId != null && state.posting != null
                        ? immutable.set(state.posting, "draftPending", true) : state.posting,
                    draftId: action.payload.draftId,
                    savingDraft: false,
                    savedDraft: true
                };
            } else {
                return state;
            }

        case COMPOSE_DRAFT_SAVE_FAILED:
            return {
                ...state,
                savingDraft: false,
                savedDraft: false
            };

        case COMPOSE_DRAFT_REVISION_SET:
            return {
                ...state,
                draftRevision: action.payload.draftRevision
            };

        case COMPOSE_DRAFT_LIST_LOAD:
            return {
                ...state,
                loadingDraftList: true
            };

        case COMPOSE_DRAFT_LIST_LOADED:
            return {
                ...state,
                draftList: sortDraftList(action.payload.draftList.map(buildDraftInfo)),
                loadingDraftList: false,
                loadedDraftList: true
            };

        case COMPOSE_DRAFT_LIST_LOAD_FAILED:
            return {
                ...state,
                loadingDraftList: false
            };

        case COMPOSE_DRAFT_SELECT:
            return {
                ...state,
                ...emptyPosting,
                draftId: action.payload.id
            };

        case COMPOSE_DRAFT_LIST_ITEM_SET:
            if (state.loadedDraftList) {
                return {
                    ...state,
                    draftList: appendToDraftList(state.draftList, action.payload.draft)
                };
            } else {
                return state;
            }

        case COMPOSE_DRAFT_LIST_ITEM_DELETED: {
            if (!state.loadedDraftList && (state.postingId != null || state.draftId !== action.payload.id)) {
                return state;
            }
            let result;
            if (state.postingId == null && state.draftId === action.payload.id) {
                result = {
                    ...state,
                    ...emptyPosting
                }
            } else {
                result = {
                    ...state
                }
            }
            if (state.loadedDraftList) {
                result.draftList = state.draftList.filter(d => d.id !== action.payload.id);
            }
            return result;
        }

        case COMPOSE_DRAFT_REVISION_DELETE:
            return {
                ...state,
                ...emptyPosting,
                postingId: state.postingId
            };

        case COMPOSE_PREVIEW:
            return {
                ...state,
                showPreview: true
            };

        case COMPOSE_PREVIEW_CLOSE:
            return {
                ...state,
                showPreview: false
            };

        case COMPOSE_SHARED_TEXT_SET:
            return {
                ...state,
                sharedText: action.payload.text,
                sharedTextType: action.payload.type
            };

        default:
            return state;
    }
}
