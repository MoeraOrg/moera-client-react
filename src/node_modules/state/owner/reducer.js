import moment from 'moment';

import {
    OWNER_SET,
    OWNER_SWITCH,
    OWNER_SWITCH_CLOSE,
    OWNER_SWITCH_FAILED,
    OWNER_SWITCH_OPEN,
    OWNER_VERIFIED
} from "state/owner/actions";

const initialState = {
    name: null,
    correct: false,
    deadline: null,
    verified: false,
    verifiedAt: 0,
    showNavigator: false,
    switching: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OWNER_SET:
            if (state.name !== action.payload.name) {
                return {
                    ...initialState,
                    name: action.payload.name
                };
            } else {
                return state;
            }

        case OWNER_VERIFIED:
            if (state.name === action.payload.name) {
                return {
                    ...state,
                    correct: action.payload.correct,
                    deadline: action.payload.deadline,
                    verified: true,
                    verifiedAt: moment().unix()
                };
            }
            return state;

        case OWNER_SWITCH_OPEN:
            return {
                ...state,
                showNavigator: true,
                switching: false
            };

        case OWNER_SWITCH_CLOSE:
            return {
                ...state,
                showNavigator: false,
                switching: false
            };

        case OWNER_SWITCH:
            return {
                ...state,
                switching: true
            };

        case OWNER_SWITCH_FAILED:
            return {
                ...state,
                switching: false
            };

        default:
            return state;
    }
}
