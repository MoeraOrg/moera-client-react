import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { SheriffOrderDialogState } from "state/sherifforderdialog/state";
import {
    CLOSE_SHERIFF_ORDER_DIALOG,
    OPEN_SHERIFF_ORDER_DIALOG,
    SHERIFF_ORDER_DIALOG_SUBMIT,
    SHERIFF_ORDER_DIALOG_SUBMIT_FAILED,
    SHERIFF_ORDER_DIALOG_SUBMITTED
} from "state/sherifforderdialog/actions";

const initialState: SheriffOrderDialogState = {
    show: false,
    nodeName: "",
    fullName: null,
    feedName: "",
    postingId: null,
    commentId: null,
    heading: "",
    submitting: false
};

export default (state: SheriffOrderDialogState = initialState,
                action: WithContext<ClientAction>): SheriffOrderDialogState => {
    switch (action.type) {
        case OPEN_SHERIFF_ORDER_DIALOG:
            return {
                ...cloneDeep(initialState),
                show: true,
                nodeName: action.payload.nodeName,
                fullName: action.payload.fullName,
                feedName: action.payload.feedName,
                postingId: action.payload.postingId,
                commentId: action.payload.commentId,
                heading: action.payload.heading
            }

        case CLOSE_SHERIFF_ORDER_DIALOG:
            return immutable.set(state, "show", false);

        case SHERIFF_ORDER_DIALOG_SUBMIT:
            return immutable.set(state, "submitting", true);

        case SHERIFF_ORDER_DIALOG_SUBMITTED:
            return immutable.assign(state, "", {
                show: false,
                submitting: false
            });

        case SHERIFF_ORDER_DIALOG_SUBMIT_FAILED:
            return immutable.set(state, "submitting", false);

        default:
            return state;
    }
}
