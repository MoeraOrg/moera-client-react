import { CartesState } from "state/cartes/state";
import { ClientAction } from "state/action";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { CARTES_PURGE_EXPIRED, CARTES_SET, CLOCK_OFFSET_WARN } from "state/cartes/actions";
import { EVENT_HOME_SUBSCRIBED } from "api/events/actions";
import { now } from "util/misc";

const initialState = {
    initialized: false,
    clientIp: null,
    cartesIp: null,
    cartes: [],
    clockOffset: 0,
    clockOffsetWarned: false
};

export default (state: CartesState = initialState, action: ClientAction) => {
    switch (action.type) {
        case CONNECTED_TO_HOME:
            return {
                ...state,
                initialized: true,
                cartesIp: action.payload.cartesIp,
                cartes: action.payload.cartes ?? [],
                clockOffset: action.payload!.clockOffset ?? state.clockOffset
            };

        case CARTES_SET:
            return {
                ...state,
                initialized: true,
                cartesIp: action.payload.cartesIp ?? state.cartesIp,
                cartes: action.payload.cartes ?? state.cartes,
                clockOffset: action.payload.clockOffset ?? state.clockOffset
            };

        case DISCONNECTED_FROM_HOME:
            return {
                ...state,
                initialized: true,
                cartes: []
            };

        case CARTES_PURGE_EXPIRED:
            return {
                ...state,
                cartes: state.cartes.filter(carte => carte.deadline > now())
            };

        case EVENT_HOME_SUBSCRIBED:
            return {
                ...state,
                clientIp: action.payload.clientIp
            };

        case CLOCK_OFFSET_WARN:
            return {
                ...state,
                clockOffsetWarned: true
            }

        default:
            return state;
    }
}
