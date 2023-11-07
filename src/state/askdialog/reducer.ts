import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { AskDialogState } from "state/askdialog/state";

const initialState: AskDialogState = {
    show: false,
    loaded: false,
    loading: false,
    nodeName: null,
    nodeCount: 0,
    friendGroups: [],
    subjectsAllowed: [],
    sending: false
};

export default (state: AskDialogState = initialState, action: WithContext<ClientAction>): AskDialogState => {
    switch (action.type) {
        case "OPEN_ASK_DIALOG":
            return {
                ...cloneDeep(initialState),
                show: true,
                nodeName: action.payload.nodeName,
                nodeCount: action.payload.nodeCount
            }

        case "CLOSE_ASK_DIALOG":
            return immutable.set(state, "show", false);

        case "ASK_DIALOG_LOAD":
            return immutable.set(state, "loading", true);

        case "ASK_DIALOG_LOADED":
            if (action.payload.nodeName === state.nodeName) {
                return {
                    ...state,
                    loaded: true,
                    loading: false,
                    friendGroups: action.payload.friendGroups,
                    subjectsAllowed: action.payload.subjectsAllowed
                }
            }
            return state;

        case "ASK_DIALOG_LOAD_FAILED":
            if (action.payload.nodeName === state.nodeName) {
                return immutable.set(state, "loading", false);
            }
            return state;

        case "ASK_DIALOG_SEND":
            if (action.payload.nodeName === state.nodeName) {
                return immutable.set(state, "sending", true);
            }
            return state;

        case "ASK_DIALOG_SENT":
            if (action.payload.nodeName === state.nodeName) {
                return {
                    ...state,
                    show: false,
                    sending: false
                };
            }
            return state;

        case "ASK_DIALOG_SEND_FAILED":
            if (action.payload.nodeName === state.nodeName) {
                return immutable.set(state, "sending", false);
            }
            return state;

        default:
            return state;
    }
}
