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
import { introduced } from "state/init-selectors";
import { errorThrown } from "state/error/actions";
import { getHomeInvisibleUsersChecksum } from "state/home/selectors";
import { executor } from "state/executor";

export default [
    executor("HOME_AVATARS_LOAD", "", homeAvatarsLoadSaga),
    executor("HOME_FRIEND_GROUPS_LOAD", "", homeFriendGroupsLoadSaga, introduced),
    executor("HOME_INVISIBLE_USERS_LOAD", "", homeInvisibleUsersLoadSaga, introduced)
];

function* homeAvatarsLoadSaga(action: HomeAvatarsLoadAction) {
    try {
        const avatars = yield* call(Node.getAvatars, action, ":");
        yield* put(homeAvatarsLoaded(avatars).causedBy(action));
    } catch (e) {
        yield* put(homeAvatarsLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* homeFriendGroupsLoadSaga(action: HomeFriendGroupsLoadAction) {
    try {
        const friendGroups = yield* call(Node.getFriendGroups, action, ":");
        yield* put(homeFriendGroupsLoaded(friendGroups).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* homeInvisibleUsersLoadSaga(action: HomeInvisibleUsersLoadAction) {
    const prevChecksum = yield* select(getHomeInvisibleUsersChecksum);
    try {
        const checksums = yield* call(Node.getBlockedUsersChecksums, action, ":");
        if (checksums.visibility === prevChecksum) {
            return;
        }
        const blockedUsers = yield* call(Node.searchBlockedUsers, action, ":", {
            blockedOperations: ["visibility" as const],
            strict: true
        });
        yield* put(homeInvisibleUsersLoaded(checksums.visibility, blockedUsers).causedBy(action));
        Storage.storeInvisibleUsers(checksums.visibility, blockedUsers);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
