import { isNodeNameOperationFinished } from "state/nodename/selectors";
import { ClientState } from "state/state";
import { AvatarImage } from "api/node/api-types";

export function getOwnerName(state: ClientState): string | null {
    return state.owner.name;
}

export function getOwnerNameOrUrl(state: ClientState): string {
    return getOwnerName(state) ?? state.node.root.location ?? "";
}

export function getOwnerFullName(state: ClientState): string | null {
    return state.owner.fullName;
}

export function getOwnerGender(state: ClientState): string | null {
    return state.owner.gender;
}

export function getOwnerTitle(state: ClientState): string | null {
    return state.owner.title;
}

export function getOwnerAvatar(state: ClientState): AvatarImage | null {
    return state.owner.avatar;
}

export function isOwnerNameSet(state: ClientState): boolean {
    return getOwnerName(state) != null;
}

export function isOwnerNameRecentlyChanged(state: ClientState): boolean {
    return isOwnerNameSet(state)
        && (state.owner.verifiedAt === 0
            || (isNodeNameOperationFinished(state)
                && state.owner.verifiedAt < (state.nodeName.operationStatusUpdated ?? 0)));
}
