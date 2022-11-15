import { call, put, select } from 'typed-redux-saga';

import { Node } from "api/node";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import {
    closeFriendGroupsDialog,
    NODE_CHANGE_FRIEND_GROUPS,
    NodeChangeFriendGroupsAction,
    nodeChangeFriendGroupsFailed
} from "state/friendgroupsdialog/actions";
import { friendGroupAdded, friendshipUpdated } from "state/people/actions";
import { getHomeFriendsId } from "state/home/selectors";
import { FriendGroupInfo } from "api/node/api-types";

export default [
    executor(NODE_CHANGE_FRIEND_GROUPS, payload => payload.nodeName, nodeChangeFriendGroupsSaga)
];

function* nodeChangeFriendGroupsSaga(action: WithContext<NodeChangeFriendGroupsAction>) {
    const {nodeName, groups, addedGroups, addedGroupTitles} = action.payload;
    const {homeOwnerNameOrUrl} = action.context;

    const allGroups = [...groups];
    const friendsId = yield* select(state => getHomeFriendsId(state));
    if (friendsId != null) {
        allGroups.push(friendsId);
    }

    const added: FriendGroupInfo[] = [];
    try {
        for (let i = 0; i < addedGroupTitles.length; i++) {
            if (!addedGroupTitles[i]) {
                continue;
            }
            const group = yield* call(Node.postFriendGroup, ":", addedGroupTitles[i], false);
            added.push(group);
            if (addedGroups.includes(i)) {
                allGroups.push(group.id);
            }
        }
        const friends = yield* call(Node.putFriends, ":", [{nodeName, groups: allGroups}]);
        yield* put(closeFriendGroupsDialog());
        yield* put(friendshipUpdated(nodeName, friends[0]?.groups ?? null));
    } catch (e) {
        yield* put(nodeChangeFriendGroupsFailed())
        yield* put(errorThrown(e));
    }
    for (const group of added) {
        yield* put(friendGroupAdded(homeOwnerNameOrUrl, group));
    }
}
