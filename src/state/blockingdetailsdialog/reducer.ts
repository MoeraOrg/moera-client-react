import * as immutable from 'object-path-immutable';
import cloneDeep from "lodash.clonedeep";

import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { BlockingDetailsDialogState } from "state/blockingdetailsdialog/state";
import {
    BLOCKING_DETAILS_DIALOG_LOAD,
    BLOCKING_DETAILS_DIALOG_LOAD_FAILED,
    BLOCKING_DETAILS_DIALOG_LOADED,
    CLOSE_BLOCKING_DETAILS_DIALOG,
    OPEN_BLOCKING_DETAILS_DIALOG
} from "state/blockingdetailsdialog/actions";

const initialState: BlockingDetailsDialogState = {
    show: false,
    loaded: false,
    loading: false,
    nodeName: null,
    remoteNodeName: null,
    remotePostingId: null,
    remotePostingHeading: null,
    by: false,
    blocked: []
};

export default (state: BlockingDetailsDialogState = initialState,
                action: WithContext<ClientAction>): BlockingDetailsDialogState => {
    switch (action.type) {
        case OPEN_BLOCKING_DETAILS_DIALOG:
            return {
                ...cloneDeep(initialState),
                show: true,
                nodeName: action.payload.nodeName,
                remoteNodeName: action.payload.remoteNodeName,
                remotePostingId: action.payload.remotePostingId,
                remotePostingHeading: action.payload.remotePostingHeading,
                by: action.payload.by
            }

        case CLOSE_BLOCKING_DETAILS_DIALOG:
            return immutable.set(state, "show", false);

        case BLOCKING_DETAILS_DIALOG_LOAD:
            return immutable.set(state, "loading", true);

        case BLOCKING_DETAILS_DIALOG_LOADED:
            return {
                ...state,
                loaded: true,
                loading: false,
                blocked: action.payload.blocked
            };

        case BLOCKING_DETAILS_DIALOG_LOAD_FAILED:
            return immutable.set(state, "loading", false);

        default:
            return state;
    }
}
