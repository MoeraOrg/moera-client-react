import { CartesState } from "state/cartes/state";
import { ClientAction } from "state/action";
import { now } from "util/misc";

const initialState = {
    initialized: false,
    clientIp: null,
    cartesIp: null,
    cartes: [],
    clockOffset: 0,
    clockOffsetWarned: false
};

export default (state: CartesState = initialState, action: ClientAction): CartesState => {
    switch (action.type) {
        case "CONNECTED_TO_HOME":
            return {
                ...state,
                initialized: true,
                cartesIp: action.payload.cartesIp ?? null,
                cartes: action.payload.cartes ?? []
            };

        case "CARTES_SET":
            return {
                ...state,
                initialized: true,
                cartesIp: action.payload.cartesIp ?? state.cartesIp,
                cartes: action.payload.cartes ?? state.cartes,
                clockOffset: action.payload.clockOffset ?? state.clockOffset
            };

        case "DISCONNECTED_FROM_HOME":
            return {
                ...state,
                initialized: true,
                cartesIp: null,
                cartes: [],
                clockOffset: 0
            };

        case "CARTES_PURGE_EXPIRED":
            return {
                ...state,
                cartes: state.cartes.filter(carte => carte.deadline > now())
            };

        case "CLOCK_OFFSET_WARN":
            return {
                ...state,
                clockOffsetWarned: true
            }

        default:
            return state;
    }
}
