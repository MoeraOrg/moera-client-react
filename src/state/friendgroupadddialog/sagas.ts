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

export default [
    executor("FRIEND_GROUP_ADD", null, friendGroupAddSaga)
];

function* friendGroupAddSaga(action: WithContext<FriendGroupAddAction>) {
    const {title, view} = action.payload;

    try {
        yield* call(Node.createFriendGroup, ":", {title, operations: {view}});
        yield* put(closeFriendGroupAddDialog());
    } catch (e) {
        yield* put(friendGroupAddFailed())
        yield* put(errorThrown(e));
    }
}
