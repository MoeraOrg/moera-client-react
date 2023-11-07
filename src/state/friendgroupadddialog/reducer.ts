import { ClientAction } from "state/action";
import { FriendGroupAddDialogState } from "state/friendgroupadddialog/state";

const initialState: FriendGroupAddDialogState = {
    show: false,
    submitting: false
};

export default (state: FriendGroupAddDialogState = initialState, action: ClientAction): FriendGroupAddDialogState => {
    switch (action.type) {
        case "OPEN_FRIEND_GROUP_ADD_DIALOG":
            return {
                ...state,
                show: true,
                submitting: false
            }

        case "CLOSE_FRIEND_GROUP_ADD_DIALOG":
            return {
                ...state,
                submitting: false,
                show: false
            }

        case "FRIEND_GROUP_ADD":
            return {
                ...state,
                submitting: true
            }

        case "FRIEND_GROUP_ADD_FAILED":
            return {
                ...state,
                submitting: false
            }

        default:
            return state;
    }
}
