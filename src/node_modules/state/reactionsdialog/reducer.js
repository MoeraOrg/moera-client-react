import immutable from 'object-path-immutable';

import {
    CLOSE_REACTIONS_DIALOG,
    OPEN_REACTIONS_DIALOG,
    REACTIONS_DIALOG_PAST_REACTIONS_LOAD,
    REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED,
    REACTIONS_DIALOG_PAST_REACTIONS_LOADED,
    REACTIONS_DIALOG_SELECT_TAB,
    REACTIONS_DIALOG_TOTALS_LOAD,
    REACTIONS_DIALOG_TOTALS_LOAD_FAILED,
    REACTIONS_DIALOG_TOTALS_LOADED,
    REACTIONS_DIALOG_UNSET
} from "state/reactionsdialog/actions";

const emptyReactions = {
    loading: false,
    total: 0,
    after: Number.MAX_SAFE_INTEGER,
    items: []
};

const initialState = {
    show: false,
    postingId: null,
    negative: false,
    activeTab: null,
    reactions: {},
    totals: {
        loading: false,
        loaded: false,
        total: 0,
        emojis: []
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_REACTIONS_DIALOG:
            if (state.postingId === action.payload.postingId && state.negative === action.payload.negative) {
                return {
                    ...state,
                    show: true
                }
            }
            return {
                ...initialState,
                show: true,
                postingId: action.payload.postingId,
                negative: action.payload.negative
            };

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
            if (action.payload.postingId !== state.postingId || action.payload.negative !== state.negative) {
                return state;
            }
            const tab = action.payload.emoji ?? 0;
            if (state.reactions[tab] == null) {
                return state;
            }
            if (action.payload.before >= state.reactions[tab].after
                && action.payload.after < state.reactions[tab].after) {

                let reactions = state.reactions[tab].items.slice();
                action.payload.reactions
                    .filter(p => p.moment <= state.reactions[tab].after)
                    .forEach(p => reactions.push(p));
                reactions.sort((a, b) => b.moment - a.moment);
                return immutable(state)
                    .set(["reactions", tab, "loading"], false)
                    .set(["reactions", tab, "total"], action.payload.total)
                    .set(["reactions", tab, "after"], action.payload.after)
                    .set(["reactions", tab, "items"], reactions)
                    .value();
            } else {
                return immutable.set(state, ["reactions", tab, "loading"], false);
            }
        }

        case REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED: {
            if (action.payload.postingId !== state.postingId || action.payload.negative !== state.negative) {
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
            totals = totals.slice().filter(rt => rt.total > 0);
            totals.sort((rt1, rt2) => rt1.total - rt2.total);
            const total = totals.map(rt => rt.total).reduce((sum, v) => sum + v, 0);
            return immutable(state)
                .set("totals.loading", false)
                .set("totals.loaded", true)
                .set("totals.total", total)
                .set("totals.emojis", totals)
                .value();
        }

        case REACTIONS_DIALOG_TOTALS_LOAD_FAILED:
            return immutable.set(state, "totals.loading", false);

        case REACTIONS_DIALOG_SELECT_TAB:
            return immutable.set(state, "activeTab", action.payload.tab);

        default:
            return state;
    }
}
