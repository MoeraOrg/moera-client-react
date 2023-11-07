import { call, put, select } from 'typed-redux-saga';

import { FriendGroupAssignment, FriendGroupInfo, Node } from "api";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import {
    closeFriendGroupsDialog,
    NodeChangeFriendGroupsAction,
    nodeChangeFriendGroupsFailed
} from "state/friendgroupsdialog/actions";
import { friendGroupAdded, friendshipUpdated } from "state/people/actions";
import { getHomeFriendsId } from "state/home/selectors";

export default [
    executor("NODE_CHANGE_FRIEND_GROUPS", payload => payload.nodeName, nodeChangeFriendGroupsSaga)
];

function* nodeChangeFriendGroupsSaga(action: WithContext<NodeChangeFriendGroupsAction>) {
    const {nodeName, groups, view, addedGroups, addedGroupTitles, addedGroupView} = action.payload;
    const {homeOwnerNameOrUrl} = action.context;

    const allGroups: FriendGroupAssignment[] = groups.map(id => ({id, operations: {view}}));
    const friendsId = yield* select(state => getHomeFriendsId(state));
    if (friendsId != null) {
        allGroups.push({id: friendsId});
    }

    const added: FriendGroupInfo[] = [];
    try {
        for (let i = 0; i < addedGroupTitles.length; i++) {
            if (!addedGroupTitles[i]) {
                continue;
            }
            const group = yield* call(Node.createFriendGroup, ":",
                {title: addedGroupTitles[i], operations: {view: addedGroupView[i]}});
            added.push(group);
            if (addedGroups.includes(i)) {
                allGroups.push({id: group.id, operations: {view}});
            }
        }
        const friends = yield* call(Node.updateFriends, ":", [{nodeName, groups: allGroups}]);
        yield* put(closeFriendGroupsDialog());
        if (friends.length > 0) {
            yield* put(friendshipUpdated(friends[0]));
        }
    } catch (e) {
        yield* put(nodeChangeFriendGroupsFailed())
        yield* put(errorThrown(e));
    }
    for (const group of added) {
        yield* put(friendGroupAdded(homeOwnerNameOrUrl, group));
    }
}
