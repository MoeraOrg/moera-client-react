import { AvatarInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getOwnerCard, isPermitted } from "state/node/selectors";

export function isProfileEditing(state: ClientState): boolean {
    return state.profile.editing;
}

export function isProfileEditable(state: ClientState): boolean {
    const details = getOwnerCard(state)?.details;
    return details != null && details.loaded && !details.loading
        && (isPermitted("edit", details.profile, "admin", state));
}

export function getAvatars(state: ClientState): AvatarInfo[] {
    return state.profile.avatars.avatars;
}
