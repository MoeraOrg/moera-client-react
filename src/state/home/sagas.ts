import { Node } from "api";
import { Storage } from "storage";
import {
    HomeAvatarsLoadAction,
    homeAvatarsLoaded,
    homeAvatarsLoadFailed, HomeFriendGroupsLoadAction,
    homeFriendGroupsLoaded, HomeInvisibleUsersLoadAction,
    homeInvisibleUsersLoaded
} from "state/home/actions";
import { homeIntroduced } from "state/init-barriers";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { getHomeInvisibleUsersChecksum, getHomeOwnerName } from "state/home/selectors";
import { NodeFeaturesLoadedAction } from "state/node/actions";
import { executor } from "state/executor";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("HOME_AVATARS_LOAD", "", homeAvatarsLoadSaga),
    executor("HOME_FRIEND_GROUPS_LOAD", "", homeFriendGroupsLoadSaga),
    executor("HOME_INVISIBLE_USERS_LOAD", "", homeInvisibleUsersLoadSaga),
    executor("NODE_FEATURES_LOADED", "", nodeFeaturesLoadedSaga)
];

async function homeAvatarsLoadSaga(action: WithContext<HomeAvatarsLoadAction>): Promise<void> {
    try {
        const avatars = await Node.getAvatars(action, REL_HOME);
        dispatch(homeAvatarsLoaded(avatars).causedBy(action));
    } catch (e) {
        dispatch(homeAvatarsLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function homeFriendGroupsLoadSaga(action: WithContext<HomeFriendGroupsLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const friendGroups = await Node.getFriendGroups(action, REL_HOME);
        dispatch(homeFriendGroupsLoaded(friendGroups).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function homeInvisibleUsersLoadSaga(action: WithContext<HomeInvisibleUsersLoadAction>): Promise<void> {
    await homeIntroduced();
    const prevChecksum = select(getHomeInvisibleUsersChecksum);
    try {
        const checksums = await Node.getBlockedUsersChecksums(action, REL_HOME);
        if (checksums.visibility === prevChecksum) {
            return;
        }
        const blockedUsers = await Node.searchBlockedUsers(action, REL_HOME, {
            blockedOperations: ["visibility" as const],
            strict: true
        });
        dispatch(homeInvisibleUsersLoaded(checksums.visibility, blockedUsers).causedBy(action));
        Storage.storeInvisibleUsers(checksums.visibility, blockedUsers);
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function nodeFeaturesLoadedSaga(action: WithContext<NodeFeaturesLoadedAction>): Promise<void> {
    await homeIntroduced();

    const homeOwnerName = select(getHomeOwnerName);
    if (homeOwnerName !== action.payload.nodeName || action.payload.stored) {
        return;
    }

    try {
        Storage.storeFeatures(action.payload.features);
    } catch (e) {
        dispatch(errorThrown(e));
    }
}
