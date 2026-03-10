import { Node } from "api";
import { saga } from "state/saga";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import {
    closeFriendGroupAddDialog,
    FriendGroupAddAction,
    friendGroupAddFailed
} from "state/friendgroupadddialog/actions";
import { REL_HOME } from "util/rel-node-name";

export default [
    saga("FRIEND_GROUP_ADD", null, friendGroupAddSaga)
];

async function friendGroupAddSaga(action: WithContext<FriendGroupAddAction>): Promise<void> {
    const {title, view} = action.payload;

    try {
        await Node.createFriendGroup(action, REL_HOME, {title, operations: {view}});
        dispatch(closeFriendGroupAddDialog().causedBy(action));
    } catch (e) {
        dispatch(friendGroupAddFailed().causedBy(action))
        dispatch(errorThrown(e));
    }
}
