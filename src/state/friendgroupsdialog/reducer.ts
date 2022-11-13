import { ClientAction } from "state/action";
import {
    CLOSE_FRIEND_GROUPS_DIALOG,
    NODE_CHANGE_FRIEND_GROUPS,
    NODE_CHANGE_FRIEND_GROUPS_FAILED,
    OPEN_FRIEND_GROUPS_DIALOG
} from "state/friendgroupsdialog/actions";
import { FriendGroupsDialogState } from "state/friendgroupsdialog/state";

const initialState = {
    show: false,
    nodeName: null,
    changing: false
};

export default (state: FriendGroupsDialogState = initialState, action: ClientAction): FriendGroupsDialogState => {
    switch (action.type) {
        case OPEN_FRIEND_GROUPS_DIALOG:
            return {
                ...state,
                show: true,
                nodeName: action.payload.nodeName,
                changing: false
            }

        case CLOSE_FRIEND_GROUPS_DIALOG:
            return {
                ...state,
                changing: false,
                show: false
            }

        case NODE_CHANGE_FRIEND_GROUPS:
            return {
                ...state,
                changing: true
            }

        case NODE_CHANGE_FRIEND_GROUPS_FAILED:
            return {
                ...state,
                changing: false
            }

        default:
            return state;
    }
}
