import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { Storage } from "storage";
import {
    HOME_AVATARS_LOAD,
    HOME_FRIEND_GROUPS_LOAD,
    HOME_INVISIBLE_USERS_LOAD,
    homeAvatarsLoaded,
    homeAvatarsLoadFailed,
    homeFriendGroupsLoaded,
    homeInvisibleUsersLoaded
} from "state/home/actions";
import { introduced } from "state/init-selectors";
import { errorThrown } from "state/error/actions";
import { getHomeInvisibleUsersChecksum } from "state/home/selectors";
import { executor } from "state/executor";

export default [
    executor(HOME_AVATARS_LOAD, "", homeAvatarsLoadSaga),
    executor(HOME_FRIEND_GROUPS_LOAD, "", homeFriendGroupsLoadSaga, introduced),
    executor(HOME_INVISIBLE_USERS_LOAD, "", homeInvisibleUsersLoadSaga, introduced)
];

function* homeAvatarsLoadSaga() {
    try {
        const avatars = yield* call(Node.getAvatars, ":");
        yield* put(homeAvatarsLoaded(avatars));
    } catch (e) {
        yield* put(homeAvatarsLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* homeFriendGroupsLoadSaga() {
    try {
        const friendGroups = yield* call(Node.getFriendGroups, ":");
        yield* put(homeFriendGroupsLoaded(friendGroups));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* homeInvisibleUsersLoadSaga() {
    const prevChecksum = yield* select(getHomeInvisibleUsersChecksum);
    try {
        const checksums = yield* call(Node.getBlockedUsersChecksums, ":");
        if (checksums.visibility === prevChecksum) {
            return;
        }
        const blockedUsers = yield* call(Node.searchBlockedUsers, ":", {
            blockedOperations: ["visibility" as const],
            strict: true
        });
        yield* put(homeInvisibleUsersLoaded(checksums.visibility, blockedUsers));
        Storage.storeInvisibleUsers(checksums.visibility, blockedUsers);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
