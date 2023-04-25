import * as immutable from 'object-path-immutable';
import cloneDeep from "lodash.clonedeep";

import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { SheriffOrderDetailsDialogState } from "state/sherifforderdetailsdialog/state";
import {
    CLOSE_SHERIFF_ORDER_DETAILS_DIALOG,
    OPEN_SHERIFF_ORDER_DETAILS_DIALOG,
    SHERIFF_ORDER_DETAILS_DIALOG_LOAD,
    SHERIFF_ORDER_DETAILS_DIALOG_LOAD_FAILED,
    SHERIFF_ORDER_DETAILS_DIALOG_LOADED
} from "state/sherifforderdetailsdialog/actions";

const initialState: SheriffOrderDetailsDialogState = {
    show: false,
    loaded: false,
    loading: false,
    nodeName: null,
    id: null,
    info: null
};

export default (state: SheriffOrderDetailsDialogState = initialState,
                action: WithContext<ClientAction>): SheriffOrderDetailsDialogState => {
    switch (action.type) {
        case OPEN_SHERIFF_ORDER_DETAILS_DIALOG:
            return {
                ...cloneDeep(initialState),
                show: true,
                nodeName: action.payload.nodeName,
                id: action.payload.id
            }

        case CLOSE_SHERIFF_ORDER_DETAILS_DIALOG:
            return immutable.set(state, "show", false);

        case SHERIFF_ORDER_DETAILS_DIALOG_LOAD:
            return immutable.set(state, "loading", true);

        case SHERIFF_ORDER_DETAILS_DIALOG_LOADED:
            return {
                ...state,
                loaded: true,
                loading: false,
                info: action.payload.info
            };

        case SHERIFF_ORDER_DETAILS_DIALOG_LOAD_FAILED:
            return immutable.set(state, "loading", false);

        default:
            return state;
    }
}
