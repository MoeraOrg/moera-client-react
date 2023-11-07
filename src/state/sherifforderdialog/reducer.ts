import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { SheriffOrderDialogState } from "state/sherifforderdialog/state";

const initialState: SheriffOrderDialogState = {
    show: false,
    target: null,
    submitting: false
};

export default (state: SheriffOrderDialogState = initialState,
                action: WithContext<ClientAction>): SheriffOrderDialogState => {
    switch (action.type) {
        case "OPEN_SHERIFF_ORDER_DIALOG":
            return {
                ...cloneDeep(initialState),
                show: true,
                target: action.payload.target
            }

        case "CLOSE_SHERIFF_ORDER_DIALOG":
            return immutable.set(state, "show", false);

        case "SHERIFF_ORDER_DIALOG_SUBMIT":
            return immutable.set(state, "submitting", true);

        case "SHERIFF_ORDER_DIALOG_SUBMITTED":
            return immutable.assign(state, "", {
                show: false,
                submitting: false
            });

        case "SHERIFF_ORDER_DIALOG_SUBMIT_FAILED":
            return immutable.set(state, "submitting", false);

        default:
            return state;
    }
}
