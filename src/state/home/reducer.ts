import cloneDeep from 'lodash.clonedeep';
import * as immutable from 'object-path-immutable';

import { EVENT_HOME_AVATAR_ADDED, EVENT_HOME_AVATAR_DELETED, EVENT_HOME_AVATAR_ORDERED } from "api/events/actions";
import { AvatarInfo } from "api/node/api-types";
import {
    BROWSER_API_SET,
    CONNECT_TO_HOME,
    CONNECTED_TO_HOME,
    CONNECTION_TO_HOME_FAILED,
    CONNECTIONS_SET,
    DISCONNECTED_FROM_HOME,
    HOME_AVATARS_LOAD,
    HOME_AVATARS_LOAD_FAILED,
    HOME_AVATARS_LOADED,
    HOME_OWNER_SET,
    HOME_OWNER_VERIFIED
} from "state/home/actions";
import { toWsUrl } from "util/url";
import { PROFILE_AVATAR_CREATED, PROFILE_AVATAR_DELETED } from "state/profile/actions";
import { HomeState } from "state/home/state";
import { ClientAction } from "state/action";

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
    }
};

const initialState = {
    ...cloneDeep(emptyConnection),
    addonApiVersion: 1,
    roots: []
};

export default (state: HomeState = initialState, action: ClientAction): HomeState => {
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
                    location: action.payload.location,
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

        case BROWSER_API_SET:
            return {
                ...state,
                addonApiVersion: action.payload.version
            };

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

        default:
            return state;
    }
}
