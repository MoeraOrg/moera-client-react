import { call, put } from 'typed-redux-saga';

import { Node } from "api/node";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import {
    closeFriendGroupsDialog,
    NODE_CHANGE_FRIEND_GROUPS,
    NodeChangeFriendGroupsAction,
    nodeChangeFriendGroupsFailed
} from "state/friendgroupsdialog/actions";
import { friendshipUpdated } from "state/people/actions";

export default [
    executor(NODE_CHANGE_FRIEND_GROUPS, payload => payload.nodeName, nodeChangeFriendGroupsSaga)
];

function* nodeChangeFriendGroupsSaga(action: NodeChangeFriendGroupsAction) {
    const {nodeName, groups} = action.payload;
    try {
        const friends = yield* call(Node.putFriends, ":", [{nodeName, groups}]);
        yield* put(closeFriendGroupsDialog());
        yield* put(friendshipUpdated(nodeName, friends[0]?.groups ?? null));
    } catch (e) {
        yield* put(nodeChangeFriendGroupsFailed())
        yield* put(errorThrown(e));
    }
}
