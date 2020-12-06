import cloneDeep from 'lodash.clonedeep';
import { getUnixTime } from 'date-fns';

import {
    OWNER_SET,
    OWNER_SWITCH,
    OWNER_SWITCH_CLOSE,
    OWNER_SWITCH_FAILED,
    OWNER_SWITCH_OPEN,
    OWNER_VERIFIED
} from "state/owner/actions";
import { INIT_FROM_LOCATION } from "state/navigation/actions";

const initialState = {
    name: null,
    correct: false,
    deadline: null,
    verified: false,
    verifiedAt: 0,
    changing: false,
    showNavigator: false,
    switching: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case INIT_FROM_LOCATION:
            return cloneDeep(initialState);

        case OWNER_SET:
            if (state.name !== action.payload.name) {
                return {
                    ...initialState,
                    name: action.payload.name,
                    changing: action.payload.changing ?? false
                };
            } else if (action.payload.changing != null) {
                return {
                    ...state,
                    changing: action.payload.changing
                }
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
                    verifiedAt: getUnixTime(new Date())
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
