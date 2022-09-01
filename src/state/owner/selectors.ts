import { isNodeNameOperationFinished } from "state/nodename/selectors";
import { ClientState } from "state/state";
import { AvatarImage } from "api/node/api-types";
import { getNodeCard } from "state/nodecards/selectors";
import { NodeCardState } from "state/nodecards/state";

export function getOwnerName(state: ClientState): string | null {
    return state.owner.name;
}

export function getOwnerNameOrUrl(state: ClientState): string {
    return getOwnerName(state) ?? state.node.root.location ?? "";
}

export function getOwnerCard(state: ClientState): NodeCardState | null {
    return getNodeCard(state, getOwnerNameOrUrl(state));
}

export function getOwnerFullName(state: ClientState): string | null {
    return getOwnerCard(state)?.details.profile.fullName ?? null;
}

export function getOwnerTitle(state: ClientState): string | null {
    return getOwnerCard(state)?.details.profile.title ?? null;
}

export function getOwnerAvatar(state: ClientState): AvatarImage | null {
    return getOwnerCard(state)?.details.profile.avatar ?? null;
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
