import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import {
    closeFriendGroupAddDialog,
    FriendGroupAddAction,
    friendGroupAddFailed
} from "state/friendgroupadddialog/actions";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("FRIEND_GROUP_ADD", null, friendGroupAddSaga)
];

function* friendGroupAddSaga(action: WithContext<FriendGroupAddAction>) {
    const {title, view} = action.payload;

    try {
        yield* call(Node.createFriendGroup, action, REL_HOME, {title, operations: {view}});
        yield* put(closeFriendGroupAddDialog().causedBy(action));
    } catch (e) {
        yield* put(friendGroupAddFailed().causedBy(action))
        yield* put(errorThrown(e));
    }
}
