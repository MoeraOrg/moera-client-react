import { ClientAction } from "state/action";
import { SharingsDialogState } from "state/sharingsdialog/state";
import { REL_CURRENT } from "util/rel-node-name";

const initialState: SharingsDialogState = {
    show: false,
    nodeName: REL_CURRENT,
    postingId: null,
    loading: false,
    loaded: false,
    after: Number.MAX_SAFE_INTEGER,
    total: 0,
    items: []
};

export default (state: SharingsDialogState = initialState, action: ClientAction): SharingsDialogState => {
    switch (action.type) {
        case "OPEN_SHARINGS_DIALOG": {
            const {nodeName, postingId} = action.payload;

            if (state.nodeName === nodeName && state.postingId === postingId && state.loading) {
                return {
                    ...state,
                    show: true
                }
            }

            return {
                ...initialState,
                show: true,
                nodeName,
                postingId
            };
        }

        case "CLOSE_SHARINGS_DIALOG":
            return {
                ...state,
                show: false
            };

        case "SHARINGS_DIALOG_UNSET":
            return {
                ...initialState
            };

        case "SHARINGS_DIALOG_PAST_SHARINGS_LOAD": {
            const {nodeName, postingId, before} = action.payload;

            if (state.nodeName !== nodeName || state.postingId !== postingId || state.after !== before) {
                return state;
            }

            return {
                ...state,
                loading: true
            };
        }

        case "SHARINGS_DIALOG_PAST_SHARINGS_LOAD_FAILED": {
            const {nodeName, postingId, before} = action.payload;

            if (state.nodeName !== nodeName || state.postingId !== postingId || state.after !== before) {
                return state;
            }

            return {
                ...state,
                loading: false
            };
        }

        case "SHARINGS_DIALOG_PAST_SHARINGS_LOADED": {
            const {nodeName, postingId, before, slice} = action.payload;

            if (state.nodeName !== nodeName || state.postingId !== postingId || state.after !== before) {
                return state;
            }

            const items = new Map(state.items.map(item => [item.id, item]));
            slice.sharings.forEach(item => items.set(item.id, item));

            return {
                ...state,
                loading: false,
                loaded: true,
                after: slice.after,
                total: slice.total,
                items: Array.from(items.values()).sort((a, b) => b.moment - a.moment)
            };
        }

        default:
            return state;
    }
}
