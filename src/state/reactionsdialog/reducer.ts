import * as immutable from 'object-path-immutable';

import {
    CLOSE_REACTIONS_DIALOG,
    OPEN_REACTIONS_DIALOG,
    REACTION_VERIFY,
    REACTION_VERIFY_FAILED,
    REACTIONS_DIALOG_PAST_REACTIONS_LOAD,
    REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED,
    REACTIONS_DIALOG_PAST_REACTIONS_LOADED,
    REACTIONS_DIALOG_SELECT_TAB,
    REACTIONS_DIALOG_TOTALS_LOAD,
    REACTIONS_DIALOG_TOTALS_LOAD_FAILED,
    REACTIONS_DIALOG_TOTALS_LOADED,
    REACTIONS_DIALOG_UNSET
} from "state/reactionsdialog/actions";
import {
    EVENT_HOME_REMOTE_REACTION_VERIFICATION_FAILED,
    EVENT_HOME_REMOTE_REACTION_VERIFIED
} from "api/events/actions";
import { ReactionsDialogState } from "state/reactionsdialog/state";
import { ClientAction } from "state/action";

const emptyReactions = {
    loading: false,
    total: 0,
    after: Number.MAX_SAFE_INTEGER,
    items: []
};

const initialState = {
    show: false,
    nodeName: null,
    postingId: null,
    commentId: null,
    negative: false,
    activeTab: null,
    reactions: {},
    totals: {
        loading: false,
        loaded: false,
        total: 0,
        emojis: []
    },
    verificationStatus: {}
};

export default (state: ReactionsDialogState = initialState, action: ClientAction): ReactionsDialogState => {
    switch (action.type) {
        case OPEN_REACTIONS_DIALOG: {
            const {nodeName, postingId, commentId, negative} = action.payload;

            if (state.postingId === postingId && state.commentId === commentId && state.negative === negative) {
                return {
                    ...state,
                    show: true
                }
            }
            return {
                ...initialState,
                show: true,
                nodeName,
                postingId,
                commentId,
                negative
            };
        }

        case CLOSE_REACTIONS_DIALOG:
            return {
                ...state,
                show: false
            };

        case REACTIONS_DIALOG_UNSET:
            return {
                ...initialState
            };

        case REACTIONS_DIALOG_PAST_REACTIONS_LOAD: {
            const tab = state.activeTab ?? 0;
            if (state.reactions[tab] == null) {
                return immutable.set(state, ["reactions", tab], emptyReactions);
            } else {
                return immutable.set(state, ["reactions", tab, "loading"], true);
            }
        }

        case REACTIONS_DIALOG_PAST_REACTIONS_LOADED: {
            const {postingId, commentId, negative, emoji, before, after, total} = action.payload;

            if (state.postingId !== postingId || state.commentId !== commentId || state.negative !== negative) {
                return state;
            }
            const tab = emoji ?? 0;
            if (state.reactions[tab] == null) {
                return state;
            }
            if (before >= state.reactions[tab].after && after < state.reactions[tab].after) {
                let reactions = state.reactions[tab].items.slice();
                action.payload.reactions
                    .filter(p => p.moment <= state.reactions[tab].after)
                    .forEach(p => reactions.push(p));
                reactions.sort((a, b) => b.moment - a.moment);
                return immutable.assign(state, ["reactions", tab], {
                    loading: false,
                    total,
                    after,
                    items: reactions
                });
            }
            return immutable.set(state, ["reactions", tab, "loading"], false);
        }

        case REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED: {
            const {postingId, commentId, negative} = action.payload;
            if (state.postingId !== postingId || state.commentId !== commentId || state.negative !== negative) {
                return state;
            }
            const tab = state.activeTab ?? 0;
            if (state.reactions[tab] == null) {
                return state;
            }
            return immutable.set(state, ["reactions", tab, "loading"], false);
        }

        case REACTIONS_DIALOG_TOTALS_LOAD:
            return immutable.set(state, "totals.loading", true);

        case REACTIONS_DIALOG_TOTALS_LOADED: {
            let totals = !state.negative ? action.payload.positive : action.payload.negative;
            totals = totals.slice().filter(rt => rt.total == null || rt.total > 0);
            totals.sort((rt1, rt2) =>
                rt1.total != null && rt2.total != null ? rt2.total - rt1.total : (rt2.share ?? 0) - (rt1.share ?? 0));
            const total = totals.map(rt => rt.total)
                .filter(v => v != null)
                .reduce((sum, v) => sum! + v!, 0);
            return immutable.assign(state, "totals", {
                loading: false,
                loaded: true,
                total,
                emojis: totals
            });
        }

        case REACTIONS_DIALOG_TOTALS_LOAD_FAILED:
            return immutable.set(state, "totals.loading", false);

        case REACTIONS_DIALOG_SELECT_TAB:
            return immutable.set(state, "activeTab", action.payload.tab);

        case REACTION_VERIFY: {
            const {postingId, commentId, ownerName} = action.payload;

            if (postingId === state.postingId && commentId === state.commentId) {
                return immutable.set(state, ["verificationStatus", ownerName], "running");
            }
            return state;
        }

        case REACTION_VERIFY_FAILED: {
            const {postingId, commentId, ownerName} = action.payload;

            if (postingId === state.postingId && commentId === state.commentId) {
                return immutable.set(state, ["verificationStatus", ownerName], "none");
            }
            return state;
        }

        case EVENT_HOME_REMOTE_REACTION_VERIFIED:
            if (action.payload.postingId === state.postingId) {
                const status = action.payload.correct ? "correct" : "incorrect";
                return immutable.set(state, ["verificationStatus", action.payload.reactionOwnerName], status);
            }
            return state;

        case EVENT_HOME_REMOTE_REACTION_VERIFICATION_FAILED:
            if (action.payload.postingId === state.postingId) {
                return immutable.set(state, ["verificationStatus", action.payload.reactionOwnerName], "none");
            }
            return state;

        default:
            return state;
    }
}
