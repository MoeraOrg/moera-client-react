import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { Storage } from "storage";
import {
    HomeAvatarsLoadAction,
    homeAvatarsLoaded,
    homeAvatarsLoadFailed, HomeFriendGroupsLoadAction,
    homeFriendGroupsLoaded, HomeInvisibleUsersLoadAction,
    homeInvisibleUsersLoaded
} from "state/home/actions";
import { homeIntroduced } from "state/init-selectors";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import { getHomeInvisibleUsersChecksum } from "state/home/selectors";
import { executor } from "state/executor";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("HOME_AVATARS_LOAD", "", homeAvatarsLoadSaga),
    executor("HOME_FRIEND_GROUPS_LOAD", "", homeFriendGroupsLoadSaga, homeIntroduced),
    executor("HOME_INVISIBLE_USERS_LOAD", "", homeInvisibleUsersLoadSaga, homeIntroduced)
];

function* homeAvatarsLoadSaga(action: WithContext<HomeAvatarsLoadAction>) {
    try {
        const avatars = yield* call(Node.getAvatars, action, REL_HOME);
        yield* put(homeAvatarsLoaded(avatars).causedBy(action));
    } catch (e) {
        yield* put(homeAvatarsLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* homeFriendGroupsLoadSaga(action: WithContext<HomeFriendGroupsLoadAction>) {
    try {
        const friendGroups = yield* call(Node.getFriendGroups, action, REL_HOME);
        yield* put(homeFriendGroupsLoaded(friendGroups).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* homeInvisibleUsersLoadSaga(action: WithContext<HomeInvisibleUsersLoadAction>) {
    const prevChecksum = yield* select(getHomeInvisibleUsersChecksum);
    try {
        const checksums = yield* call(Node.getBlockedUsersChecksums, action, REL_HOME);
        if (checksums.visibility === prevChecksum) {
            return;
        }
        const blockedUsers = yield* call(Node.searchBlockedUsers, action, REL_HOME, {
            blockedOperations: ["visibility" as const],
            strict: true
        });
        yield* put(homeInvisibleUsersLoaded(checksums.visibility, blockedUsers).causedBy(action));
        Storage.storeInvisibleUsers(checksums.visibility, blockedUsers);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
