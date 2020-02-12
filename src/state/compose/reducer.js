import {
    COMPOSE_CONFLICT,
    COMPOSE_CONFLICT_CLOSE, COMPOSE_DRAFT_LIST_LOAD, COMPOSE_DRAFT_LIST_LOAD_FAILED, COMPOSE_DRAFT_LIST_LOADED,
    COMPOSE_DRAFT_LOAD,
    COMPOSE_DRAFT_LOAD_FAILED,
    COMPOSE_DRAFT_LOADED,
    COMPOSE_DRAFT_SAVE,
    COMPOSE_DRAFT_SAVE_FAILED,
    COMPOSE_DRAFT_SAVED,
    COMPOSE_FEATURES_LOAD,
    COMPOSE_FEATURES_LOAD_FAILED,
    COMPOSE_FEATURES_LOADED,
    COMPOSE_FEATURES_UNSET,
    COMPOSE_POST,
    COMPOSE_POST_FAILED,
    COMPOSE_POST_SUCCEEDED,
    COMPOSE_POSTING_LOAD,
    COMPOSE_POSTING_LOAD_FAILED,
    COMPOSE_POSTING_LOADED
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
    loadingDraft: false,
    savingDraft: false,
    savedDraft: false
};

const initialState = {
    loadingFeatures: false,
    loadedFeatures: false,
    ...emptyFeatures,
    ...emptyPosting,
    draftList: [],
    loadingDraftList: false,
    loadedDraftList: false
};

function buildDraftInfo(postingInfo) {
    const {id, bodySrc, editedAt} = postingInfo;
    const body = JSON.parse(bodySrc);

    return {
        id,
        subject: body.subject != null ? body.subject.substring(0, 64) : null,
        text: body.text != null ? body.text.substring(0, 256) : null,
        editedAt
    }
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
                posting: action.payload.posting,
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

        case COMPOSE_DRAFT_LIST_LOAD:
            return {
                ...state,
                loadingDraftList: true
            };

        case COMPOSE_DRAFT_LIST_LOADED:
            return {
                ...state,
                draftList: action.payload.draftList
                    .map(buildDraftInfo)
                    .sort((d1, d2) => d2.editedAt - d1.editedAt),
                loadingDraftList: false,
                loadedDraftList: true
            };

        case COMPOSE_DRAFT_LIST_LOAD_FAILED:
            return {
                ...state,
                loadingDraftList: false
            };

        default:
            return state;
    }
}
