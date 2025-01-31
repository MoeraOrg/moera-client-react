import { FriendGroupAssignment, FriendGroupInfo, Node } from "api";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import {
    closeFriendGroupsDialog,
    NodeChangeFriendGroupsAction,
    nodeChangeFriendGroupsFailed
} from "state/friendgroupsdialog/actions";
import { friendGroupAdded, friendshipUpdated } from "state/people/actions";
import { getHomeFriendsId } from "state/home/selectors";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("NODE_CHANGE_FRIEND_GROUPS", payload => payload.nodeName, nodeChangeFriendGroupsSaga)
];

async function nodeChangeFriendGroupsSaga(action: WithContext<NodeChangeFriendGroupsAction>): Promise<void> {
    const {nodeName, groups, view, addedGroups, addedGroupTitles, addedGroupView} = action.payload;
    const {homeOwnerNameOrUrl} = action.context;

    const allGroups: FriendGroupAssignment[] = groups.map(id => ({id, operations: {view}}));
    const friendsId = select(state => getHomeFriendsId(state));
    if (friendsId != null) {
        allGroups.push({id: friendsId});
    }

    const added: FriendGroupInfo[] = [];
    try {
        for (let i = 0; i < addedGroupTitles.length; i++) {
            if (!addedGroupTitles[i]) {
                continue;
            }
            const group = await Node.createFriendGroup(
                action, REL_HOME,
                {title: addedGroupTitles[i], operations: {view: addedGroupView[i]}}
            );
            added.push(group);
            if (addedGroups.includes(i)) {
                allGroups.push({id: group.id, operations: {view}});
            }
        }
        const friends = await Node.updateFriends(action, REL_HOME, [{nodeName, groups: allGroups}]);
        dispatch(closeFriendGroupsDialog().causedBy(action));
        if (friends.length > 0) {
            dispatch(friendshipUpdated(friends[0]).causedBy(action));
        }
    } catch (e) {
        dispatch(nodeChangeFriendGroupsFailed().causedBy(action))
        dispatch(errorThrown(e));
    }
    for (const group of added) {
        dispatch(friendGroupAdded(homeOwnerNameOrUrl, group).causedBy(action));
    }
}
