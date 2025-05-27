import { createSelector } from 'reselect';

import { AvatarImage, BlockedUserInfo, FriendGroupInfo } from "api";
import { ClientState } from "state/state";
import { getOwnerNameOrUrl, getToken } from "state/node/selectors";
import { getSearchNodeName } from "state/search/selectors";
import { NodeCardState } from "state/nodecards/state";
import { getNodeCard } from "state/nodecards/selectors";
import * as Browser from "ui/browser";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";

const EMPTY_ARRAY: any[] = [];

export function isHomeIntroduced(state: ClientState): boolean {
    return state.home.introduced;
}

export function getHomeRootLocation(state: ClientState): string | null {
    return state.home.root.location;
}

export function getHomeRootPage(state: ClientState): string | null {
    return state.home.root.page;
}

export function getHomeToken(state: ClientState): string | null {
    return getToken(state, getHomeRootLocation(state));
}

export function isConnectedToHome(state: ClientState): boolean {
    return !!getHomeToken(state);
}

export function getHomePermissions(state: ClientState): string[] {
    const location = getHomeRootLocation(state);
    return location != null ? (state.tokens[location]?.permissions ?? EMPTY_ARRAY) : EMPTY_ARRAY;
}

export function getHomeOwnerName(state: ClientState): string | null {
    return state.home.owner.name;
}

export function getHomeOwnerNameOrUrl(state: ClientState): string {
    return getHomeOwnerName(state) ?? getHomeRootLocation(state) ?? "";
}

export const getRelNodeNameContext = createSelector(
    getOwnerNameOrUrl,
    getHomeOwnerNameOrUrl,
    getSearchNodeName,
    (ownerNameOrUrl, homeOwnerNameOrUrl, searchName) => ({ownerNameOrUrl, homeOwnerNameOrUrl, searchName})
);

export function getHomeOwnerCard(state: ClientState): NodeCardState | null {
    return getNodeCard(state, getHomeOwnerNameOrUrl(state));
}

export function getHomeOwnerFullName(state: ClientState): string | null {
    return getHomeOwnerCard(state)?.details.profile.fullName ?? null;
}

export function getHomeOwnerAvatar(state: ClientState): AvatarImage | null {
    return getHomeOwnerCard(state)?.details.profile.avatar ?? null;
}

export function getHomeOwnerGender(state: ClientState): string | null {
    return getHomeOwnerCard(state)?.details.profile.gender ?? null;
}

export function isHomeOwnerNameSet(state: ClientState): boolean {
    return !!getHomeOwnerName(state);
}

export function getHomeFriendGroups(state: ClientState): FriendGroupInfo[] {
    return state.home.friendGroups;
}

export function getHomeFriendsId(state: ClientState): string | null {
    return getHomeFriendGroups(state).find(fg => fg.title === "t:friends")?.id ?? null;
}

export function getHomeInvisibleUsersChecksum(state: ClientState): number {
    return state.home.invisibleUsers.checksum;
}

export function getHomeInvisibleUsers(state: ClientState): BlockedUserInfo[] {
    return state.home.invisibleUsers.blockedUsers;
}

export interface HomeConnectionData {
    location: string | null;
    login: string | null;
    token: string | null;
    permissions: string[];
}

export function getHomeConnectionData(state: ClientState): HomeConnectionData {
    return {
        location: getHomeRootLocation(state),
        login: state.home.login,
        token: getHomeToken(state),
        permissions: getHomePermissions(state)
    }
}

export function isHomeGooglePlayHiding(state: ClientState): boolean {
    return Browser.isAndroidGooglePlay() && getHomeOwnerName(state) !== SHERIFF_GOOGLE_PLAY_TIMELINE;
}
