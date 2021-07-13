import cloneDeep from 'lodash.clonedeep';
import { getUnixTime } from 'date-fns';
import * as immutable from 'object-path-immutable';

import {
    OWNER_SET,
    OWNER_SWITCH,
    OWNER_SWITCH_CLOSE,
    OWNER_SWITCH_FAILED,
    OWNER_SWITCH_OPEN,
    OWNER_VERIFIED
} from "state/owner/actions";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import { OwnerState } from "state/owner/state";
import { ClientAction } from "state/action";

const initialState = {
    name: null,
    fullName: null,
    gender: null,
    title: null,
    avatar: null,
    correct: false,
    verified: false,
    verifiedAt: 0,
    changing: false,
    showNavigator: false,
    switching: false
};

export default (state: OwnerState = initialState, action: ClientAction): OwnerState => {
    switch (action.type) {
        case INIT_FROM_LOCATION:
            return cloneDeep(initialState);

        case OWNER_SET: {
            const istate = immutable.wrap(state);
            if (state.name !== action.payload.name) {
                istate.assign("", initialState).set("name", action.payload.name);
            }
            if (action.payload.changing != null) {
                istate.set("changing", action.payload.changing);
            }
            if (action.payload.fullName !== false) {
                istate.set("fullName", action.payload.fullName);
            }
            if (action.payload.gender !== false) {
                istate.set("gender", action.payload.gender);
            }
            if (action.payload.title !== false) {
                istate.set("title", action.payload.title);
            }
            if (action.payload.avatar != null) {
                istate.set("avatar", action.payload.avatar);
            }
            return istate.value();
        }

        case OWNER_VERIFIED:
            if (state.name === action.payload.name) {
                return {
                    ...state,
                    correct: action.payload.correct,
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
