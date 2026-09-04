import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";

export function atOwner(state: ClientState): string {
    const ownerName = getOwnerName(state);
    return ownerName ? " @ " + NodeName.shorten(ownerName) : "";
}
