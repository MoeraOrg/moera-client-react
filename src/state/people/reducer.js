import * as immutable from 'object-path-immutable';

import { PEOPLE_GO_TO_TAB } from "state/people/actions";

const initialState = {
    tab: "subscribers"
};

export default (state = initialState, action) => {
    switch (action.type) {
        case PEOPLE_GO_TO_TAB:
            return immutable.set(state, "tab", action.payload.tab)

        default:
            return state;
    }
}
