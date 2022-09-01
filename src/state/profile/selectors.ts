import { isPermitted } from "state/node/selectors";
import { ClientState } from "state/state";
import { AvatarInfo } from "api/node/api-types";
import { getNodeCard } from "state/nodecards/selectors";
import { getOwnerNameOrUrl } from "state/owner/selectors";

export function isProfileEditing(state: ClientState): boolean {
    return state.profile.editing;
}

export function isProfileEditable(state: ClientState): boolean {
    const details = getNodeCard(state, getOwnerNameOrUrl(state))?.details;
    return details != null && details.loaded && !details.loading
        && (isPermitted("edit", details.profile, "admin", state));
}

export function getAvatars(state: ClientState): AvatarInfo[] {
    return state.profile.avatars.avatars;
}
