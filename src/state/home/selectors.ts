import { AvatarImage } from "api/node/api-types";
import { ClientState } from "state/state";
import { getToken } from "state/node/selectors";
import { NodeCardState } from "state/nodecards/state";
import { getNodeCard } from "state/nodecards/selectors";

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
    return location != null ? (state.tokens[location]?.permissions ?? []) : [];
}

export function getHomeOwnerName(state: ClientState): string | null {
    return state.home.owner.name;
}

export function getHomeOwnerNameOrUrl(state: ClientState): string {
    return getHomeOwnerName(state) ?? getHomeRootLocation(state) ?? "";
}

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

export interface HomeConnectionData {
    addonApiVersion: number;
    location: string | null;
    login: string | null;
    token: string | null;
    permissions: string[];
}

export function getHomeConnectionData(state: ClientState): HomeConnectionData {
    return {
        addonApiVersion: getAddonApiVersion(state),
        location: getHomeRootLocation(state),
        login: state.home.login,
        token: getHomeToken(state),
        permissions: getHomePermissions(state)
    }
}

export function getAddonApiVersion(state: ClientState): number {
    return state.home.addonApiVersion ?? 1;
}

export function hasInactiveConnections(state: ClientState): boolean {
    return state.home.roots.length > 1;
}
