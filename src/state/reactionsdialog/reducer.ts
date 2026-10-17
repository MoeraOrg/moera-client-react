import * as immutable from 'object-path-immutable';

import { ClientAction } from "state/action";
import {
    ReactionsDialogReactionUpdate,
    ReactionsDialogState,
    ReactionsDialogTabsState
} from "state/reactionsdialog/state";
import { REL_CURRENT } from "util/rel-node-name";
import { notNull } from "util/misc";

const emptyReactions: ReactionsDialogTabsState = {
    loading: false,
    total: 0,
    after: Number.MAX_SAFE_INTEGER,
    items: []
};

const initialState: ReactionsDialogState = {
    generation: 0,
    show: false,
    nodeName: REL_CURRENT,
    postingId: null,
    commentId: null,
    negative: false,
    activeTab: null,
    reactions: {},
    totals: {
        generation: 0,
        loading: false,
        loaded: false,
        total: 0,
        emojis: []
    },
    verificationStatus: {}
};

function updateReactions(
    state: ReactionsDialogTabsState,
    update: ReactionsDialogReactionUpdate,
    negative: boolean,
    emoji: number
): ReactionsDialogTabsState {
    const {reaction} = update;

    if (reaction == null) {
        return {...state, items: [], total: 0, after: Number.MIN_SAFE_INTEGER};
    }

    const items = state.items.filter(item => {
        if (update.type === "deleted" && reaction.moment != null) {
            return item.moment !== reaction.moment;
        }
        return (reaction.ownerName == null || item.ownerName !== reaction.ownerName)
            && (reaction.moment == null || item.moment !== reaction.moment);
    });

    // Reaction slices include the reaction at their lower boundary.
    if (
        update.type === "added"
        && reaction.negative === negative
        && (emoji === 0 || reaction.emoji === emoji)
        && state.after < Number.MAX_SAFE_INTEGER
        && reaction.moment != null && reaction.moment >= state.after
    ) {
        items.push(reaction);
        items.sort((a, b) => b.moment! - a.moment!);
    }

    return {...state, items};
}

export default (state: ReactionsDialogState = initialState, action: ClientAction): ReactionsDialogState => {
    switch (action.type) {
        case "OPEN_REACTIONS_DIALOG": {
            const {nodeName, postingId, commentId, negative} = action.payload;

            if (
                state.nodeName === nodeName
                && state.postingId === postingId
                && state.commentId === commentId
                && state.negative === negative
            ) {
                return {
                    ...state,
                    show: true
                }
            }
            return {
                ...initialState,
                generation: state.generation + 1,
                show: true,
                nodeName,
                postingId,
                commentId,
                negative
            };
        }

        case "CLOSE_REACTIONS_DIALOG":
            return {
                ...state,
                show: false
            };

        case "REACTIONS_DIALOG_UNSET":
            return {
                ...initialState,
                generation: state.generation + 1
            };

        case "REACTIONS_DIALOG_REACTION_ADDED":
        case "REACTIONS_DIALOG_REACTION_DELETED": {
            const update: ReactionsDialogReactionUpdate = action.type === "REACTIONS_DIALOG_REACTION_ADDED"
                ? {type: "added", reaction: action.payload.reaction}
                : {type: "deleted", reaction: action.payload.reaction};
            const reactions = {...state.reactions};
            for (const [emoji, tab] of Object.entries(reactions)) {
                if (tab != null) {
                    reactions[Number(emoji)] = {
                        ...updateReactions(tab, update, state.negative, Number(emoji)),
                        pendingUpdates: tab.loading ? [...(tab.pendingUpdates ?? []), update] : undefined
                    };
                }
            }
            const verificationStatus = {...state.verificationStatus};
            if (update.reaction?.ownerName != null) {
                delete verificationStatus[update.reaction.ownerName];
            }
            return {
                ...state,
                reactions,
                verificationStatus: update.reaction != null ? verificationStatus : {}
            };
        }

        case "REACTIONS_DIALOG_PAST_REACTIONS_LOAD": {
            const tab = state.activeTab ?? 0;
            return immutable.set(state, ["reactions", tab], {
                ...(state.reactions[tab] ?? emptyReactions), loading: true, pendingUpdates: []
            });
        }

        case "REACTIONS_DIALOG_PAST_REACTIONS_LOADED": {
            const {postingId, commentId, negative, emoji, before, after, total} = action.payload;

            if (state.postingId !== postingId || state.commentId !== commentId || state.negative !== negative) {
                return state;
            }
            const tab = emoji ?? 0;
            const tabReactions = state.reactions[tab];
            if (tabReactions == null) {
                return state;
            }
            if (before >= tabReactions.after && after < tabReactions.after) {
                const reactions = tabReactions.items.slice();
                const moments = new Set(reactions.map(reaction => reaction.moment));
                action.payload.reactions
                    .filter(p => p.moment != null && p.moment <= tabReactions.after && !moments.has(p.moment))
                    .forEach(p => reactions.push(p));
                reactions.sort((a, b) => b.moment! - a.moment!);
                let updated: ReactionsDialogTabsState = {
                    loading: false,
                    total: tabReactions.pendingUpdates?.length ? tabReactions.total : (total ?? tabReactions.total),
                    after,
                    items: reactions
                };
                // Events received during the request also apply to the newly loaded range.
                for (const update of tabReactions.pendingUpdates ?? []) {
                    updated = updateReactions(updated, update, negative, tab);
                }
                return immutable.set(state, ["reactions", tab], updated);
            }
            return immutable.assign(state, ["reactions", tab], {loading: false, pendingUpdates: undefined});
        }

        case "REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED": {
            const {postingId, commentId, negative, emoji} = action.payload;
            if (state.postingId !== postingId || state.commentId !== commentId || state.negative !== negative) {
                return state;
            }
            const tab = emoji ?? 0;
            if (state.reactions[tab] == null) {
                return state;
            }
            return immutable.assign(state, ["reactions", tab], {loading: false, pendingUpdates: undefined});
        }

        case "REACTIONS_DIALOG_TOTALS_LOAD":
            return immutable.assign(state, "totals", {loading: true, generation: state.totals.generation + 1});

        case "REACTIONS_DIALOG_TOTALS_LOADED": {
            let totals = !state.negative ? action.payload.positive : action.payload.negative;
            totals = totals.slice().filter(rt => rt.total == null || rt.total > 0);
            totals.sort((rt1, rt2) =>
                rt1.total != null && rt2.total != null ? rt2.total - rt1.total : (rt2.share ?? 0) - (rt1.share ?? 0)
            );
            const total = totals.map(rt => rt.total)
                .filter(notNull)
                .reduce((sum, v) => sum! + v!, 0);
            const reactions = {...state.reactions};
            for (const [emoji, tab] of Object.entries(reactions)) {
                if (tab == null) {
                    continue;
                }
                const emojiTotal = totals.find(rt => rt.emoji === Number(emoji));
                const tabTotal = Number(emoji) === 0
                    ? (totals.every(rt => rt.total != null) ? total : null)
                    : (emojiTotal == null ? 0 : emojiTotal.total);
                if (tabTotal != null) {
                    reactions[Number(emoji)] = {...tab, total: tabTotal};
                }
            }
            return {
                ...state,
                reactions,
                totals: {...state.totals, loading: false, loaded: true, total, emojis: totals}
            };
        }

        case "REACTIONS_DIALOG_TOTALS_LOAD_FAILED":
            return immutable.set(state, "totals.loading", false);

        case "REACTIONS_DIALOG_SELECT_TAB":
            return immutable.set(state, "activeTab", action.payload.tab);

        case "REACTION_VERIFY": {
            const {postingId, commentId, ownerName} = action.payload;

            if (postingId === state.postingId && commentId === state.commentId) {
                return immutable.set(state, ["verificationStatus", ownerName], "running");
            }
            return state;
        }

        case "REACTION_VERIFY_FAILED": {
            const {postingId, commentId, ownerName} = action.payload;

            if (postingId === state.postingId && commentId === state.commentId) {
                return immutable.set(state, ["verificationStatus", ownerName], "none");
            }
            return state;
        }

        case "EVENT_HOME_REMOTE_REACTION_VERIFIED":
            if (action.payload.postingId === state.postingId) {
                const status = action.payload.correct ? "correct" : "incorrect";
                return immutable.set(state, ["verificationStatus", action.payload.reactionOwnerName], status);
            }
            return state;

        case "EVENT_HOME_REMOTE_REACTION_VERIFICATION_FAILED":
            if (action.payload.postingId === state.postingId) {
                return immutable.set(state, ["verificationStatus", action.payload.reactionOwnerName], "none");
            }
            return state;

        default:
            return state;
    }
}
