import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { BlockDialogState } from "state/blockdialog/state";
import { CLOSE_BLOCK_DIALOG, OPEN_BLOCK_DIALOG } from "state/blockdialog/actions";

const initialState: BlockDialogState = {
    show: false,
    nodeName: ""
};

export default (state: BlockDialogState = initialState, action: WithContext<ClientAction>): BlockDialogState => {
    switch (action.type) {
        case OPEN_BLOCK_DIALOG:
            return {
                ...cloneDeep(initialState),
                show: true,
                nodeName: action.payload.nodeName
            }

        case CLOSE_BLOCK_DIALOG:
            return immutable.set(state, "show", false);

        default:
            return state;
    }
}
