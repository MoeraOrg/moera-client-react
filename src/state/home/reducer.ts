import cloneDeep from 'lodash.clonedeep';
import * as immutable from 'object-path-immutable';

import {
    EVENT_HOME_AVATAR_ADDED,
    EVENT_HOME_AVATAR_DELETED,
    EVENT_HOME_AVATAR_ORDERED,
    EVENT_HOME_FRIEND_GROUP_ADDED,
    EVENT_HOME_FRIEND_GROUP_DELETED,
    EVENT_HOME_FRIEND_GROUP_UPDATED
} from "api/events";
import { AvatarInfo, BlockedUserInfo, FriendGroupInfo } from "api";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import {
    CONNECT_TO_HOME,
    CONNECTED_TO_HOME,
    CONNECTION_TO_HOME_FAILED,
    CONNECTIONS_SET,
    DISCONNECTED_FROM_HOME,
    HOME_AVATARS_LOAD,
    HOME_AVATARS_LOAD_FAILED,
    HOME_AVATARS_LOADED,
    HOME_FRIEND_GROUPS_LOADED,
    HOME_INVISIBLE_USERS_LOADED,
    HOME_OWNER_SET,
    HOME_OWNER_VERIFIED
} from "state/home/actions";
import { FRIEND_GROUP_ADDED } from "state/people/actions";
import { PROFILE_AVATAR_CREATED, PROFILE_AVATAR_DELETED } from "state/profile/actions";
import { BLOCKED_USERS_ADDED, BLOCKED_USERS_DELETED } from "state/blockedoperations/actions";
import { HomeState } from "state/home/state";
import { toWsUrl } from "util/url";

const emptyConnection = {
    connecting: false,
    root: {
        location: null,
        page: null,
        api: null,
        events: null
    },
    login: null,
    owner: {
        name: null,
        verified: false,
        correct: false,
        changing: false
    },
    avatars: {
        loading: false,
        loaded: false,
        avatars: []
    },
    friendGroups: [],
    invisibleUsers: {
        checksum: 0,
        blockedUsers: []
    }
};

const initialState: HomeState = {
    ...cloneDeep(emptyConnection),
    roots: []
};

function updateBlocked(state: HomeState, list: BlockedUserInfo[], append: boolean): HomeState {
    const blockedUsers = list.filter(bu =>
        bu.entryId == null && bu.entryNodeName == null && bu.entryPostingId == null
        && bu.blockedOperation === "visibility");
    if (blockedUsers.length === 0) {
        return state;
    }
    const ids = blockedUsers.map(bu => bu.id);
    return immutable.update(state, "invisibleUsers.blockedUsers",
        (bus: BlockedUserInfo[]) => bus.filter(bu => !ids.includes(bu.id)).concat(append ? blockedUsers : []));
}

export default (state: HomeState = initialState, action: WithContext<ClientAction>): HomeState => {
    switch (action.type) {
        case CONNECT_TO_HOME:
            return {
                ...state,
                connecting: true
            };

        case CONNECTION_TO_HOME_FAILED:
            return {
                ...state,
                connecting: false
            };

        case CONNECTED_TO_HOME:
            return {
                ...state,
                connecting: false,
                root: {
                    location: action.payload.location.toLowerCase(),
                    page: action.payload.location + "/moera",
                    api: action.payload.location + "/moera/api",
                    events: toWsUrl(action.payload.location + "/moera/api/events"),
                },
                login: action.payload.login,
                roots: action.payload.roots ?? state.roots
            };

        case DISCONNECTED_FROM_HOME:
            return {
                ...state,
                ...cloneDeep(emptyConnection)
            };

        case HOME_OWNER_SET:
            return {
                ...state,
                owner: {
                    ...state.owner,
                    name: action.payload.name,
                    verified: false,
                    correct: false,
                    changing: action.payload.changing ?? state.owner.changing
                }
            };

        case HOME_OWNER_VERIFIED:
            if (state.owner.name === action.payload.name) {
                return {
                    ...state,
                    owner: {
                        ...state.owner,
                        name: action.payload.name,
                        correct: action.payload.correct,
                        verified: true
                    }
                };
            }
            return state;

        case CONNECTIONS_SET:
            return {
                ...state,
                roots: action.payload.roots
            };

        case HOME_AVATARS_LOAD:
            return immutable.set(state, "avatars.loading", true);

        case HOME_AVATARS_LOADED:
            return immutable.assign(state, "avatars", {
                loading: false,
                loaded: true,
                avatars: action.payload.avatars
            });

        case HOME_AVATARS_LOAD_FAILED:
            return immutable.set(state, "avatars.loading", false);

        case HOME_FRIEND_GROUPS_LOADED:
            return immutable.set(state, "friendGroups",
                action.payload.friendGroups.sort((a, b) => a.createdAt - b.createdAt));

        case HOME_INVISIBLE_USERS_LOADED:
            return immutable.assign(state, "invisibleUsers", {
                checksum: action.payload.checksum,
                blockedUsers: action.payload.blockedUsers
            });

        case BLOCKED_USERS_ADDED:
            return updateBlocked(state, action.payload.blockedUsers, true);

        case BLOCKED_USERS_DELETED:
            return updateBlocked(state, action.payload.blockedUsers, false);

        case FRIEND_GROUP_ADDED:
            if (action.payload.nodeName === action.context.homeOwnerNameOrUrl) {
                return immutable.update(
                    state,
                    "friendGroups",
                    (fgs: FriendGroupInfo[]) =>
                        [...fgs.filter(fg => fg.id !== action.payload.details.id), action.payload.details]
                            .sort((a, b) => a.createdAt - b.createdAt)
                );
            }
            return state;

        case PROFILE_AVATAR_CREATED:
            if (state.avatars.loaded) {
                return immutable.insert(state, "avatars.avatars", action.payload.avatar, 0);
            }
            return state;

        case PROFILE_AVATAR_DELETED:
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.id);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case EVENT_HOME_AVATAR_ADDED:
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.avatar.id);
                avatars.push(action.payload.avatar);
                avatars.sort((a, b) => b.ordinal - a.ordinal);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case EVENT_HOME_AVATAR_DELETED:
            if (state.avatars.loaded) {
                const avatars = state.avatars.avatars.filter(av => av.id !== action.payload.id);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case EVENT_HOME_AVATAR_ORDERED:
            if (state.avatars.loaded) {
                const avatars: AvatarInfo[] = [];
                state.avatars.avatars.forEach(av => {
                    if (av.id !== action.payload.id) {
                        avatars.push(av);
                    } else {
                        avatars.push({...av, ordinal: action.payload.ordinal});
                    }
                });
                avatars.sort((a, b) => b.ordinal - a.ordinal);
                return immutable.set(state, "avatars.avatars", avatars);
            }
            return state;

        case EVENT_HOME_FRIEND_GROUP_ADDED:
        case EVENT_HOME_FRIEND_GROUP_UPDATED:
            return immutable.update(
                state,
                "friendGroups",
                (fgs: FriendGroupInfo[]) =>
                    [...fgs.filter(fg => fg.id !== action.payload.friendGroup.id), action.payload.friendGroup]
                        .sort((a, b) => a.createdAt - b.createdAt)
            );

        case EVENT_HOME_FRIEND_GROUP_DELETED:
            return immutable.update(
                state,
                "friendGroups",
                (fgs: FriendGroupInfo[]) => fgs.filter(fg => fg.id !== action.payload.friendGroupId)
            );

        default:
            return state;
    }
}
