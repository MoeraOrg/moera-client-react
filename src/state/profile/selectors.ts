import { isPermitted } from "state/node/selectors";
import { ClientState } from "state/state";
import { AvatarInfo } from "api/node/api-types";

export function isProfileToBeLoaded(state: ClientState): boolean {
    return !state.profile.loaded && !state.profile.loading;
}

export function isProfileReady(state: ClientState): boolean {
    return state.profile.loaded && !state.profile.loading;
}

export function isProfileEditing(state: ClientState): boolean {
    return state.profile.editing;
}

export function isProfileEditable(state: ClientState): boolean {
    return isProfileReady(state) && (isPermitted("edit", state.profile.profile, state));
}

export function getAvatars(state: ClientState): AvatarInfo[] {
    return state.profile.avatars.avatars;
}
